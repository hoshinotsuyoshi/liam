import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import { chain } from '@liam-hq/jobs'
import * as dotenv from 'dotenv'
import { type ApiGetScoresResponse, Langfuse } from 'langfuse'
import { createDatasetItemHandler } from 'langfuse-langchain'
import { testCases, testByJsRecords } from './testCases'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })
const baseUrl =
  process.env['LANGFUSE_BASE_URL'] ?? 'https://us.cloud.langfuse.com'

const tests = testCases.map((testCase) => {
  return `src/fixtures/github.com/${testCase}/fixture.json`
})

const inputs = tests.map(
  (test) =>
    JSON.parse(fs.readFileSync(test, 'utf8')) as {
      name: string
      vars: Record<string, unknown>
      assert: Array<{ type: string; value: string }>
    },
)

// TODO: use a dynamic dataset name
const datasetName = 'ci-2025-04-09'

async function main() {
  const environment = process.env['CI'] ? 'test' : 'development'
  const langfuse = new Langfuse({ environment, baseUrl })

  const existingShas = (await langfuse.getDataset(datasetName)).items.map(
    (item) => {
      return (item.metadata as unknown as { sha?: string })['sha']
    },
  )
  const shas: string[] = []

  // step 1: create new items
  // TODO: use Promise.all
  for (const input of inputs) {
    const sha = crypto
      .createHash('sha1')
      .update(JSON.stringify(input))
      .digest('hex')
    shas.push(sha)
    const name = input.name
    if (existingShas.includes(sha)) {
      continue
    }

    // NOTE:
    // - name: the name of the test
    // - sha: the sha of the item. It's used to identify for skipping existing items
    // - assertion: the assertion of the test. It's used to evaluate the output of the test by llm.
    const metadata = { name, sha }
    let assertion: string | null = null
    // TODO: rename from llm-rubric to something more descriptive
    if (input.assert?.[0]?.type === 'llm-rubric') {
      assertion = input.assert[0].value
    }

    await langfuse.createDatasetItem({
      datasetName,
      input: input.vars,
      expectedOutput: {},
      metadata: assertion ? { ...metadata, assertion } : metadata,
    })
  }

  // step 2: run tests
  const runName = `run-${Date.now()}`
  const userId = `test-${runName}`
  const dataset = await langfuse.getDataset(datasetName)

  const testByJsScores: Array<{
    testCaseName: string
    traceId: string
    'test-by-js': number
    'test-by-js-comment': string
  }> = []
  for (const item of dataset.items) {
    if (
      !shas.includes(
        (item.metadata as unknown as { sha?: string })['sha'] ?? '',
      )
    ) {
      // skip
      continue
    }
    const testCaseName =
      (item.metadata as unknown as { name?: string })['name'] ?? ''
    const { handler, trace } = await createDatasetItemHandler({
      item,
      runName,
      langfuseClient: langfuse,
    })

    // NOTE: for later score detection.
    trace.update({ userId })

    console.info(`processing ${testCaseName} ...`)
    await chain.invoke(item.input, { callbacks: [handler] })

    const output = await chain.invoke(item.input, { callbacks: [handler] })
    const testFns =
      testByJsRecords[testCaseName as (typeof testCases)[number]]()

    // NOTE: we need to catch the error here to avoid the error from crashing the whole process
    try {
      const testByJsResults = testFns.map((fn) => fn(output))
      const testByJsScore =
        testByJsResults.length > 0
          ? testByJsResults.filter((result) => result[0]).length /
            testByJsResults.length
          : 1
      const testByJsComment = testByJsResults.map((result) => `${result[0] ? '✅' : '❌'} - ${result[1]}`).join('\n')
      trace.score({
        name: 'test-by-js',
        value: testByJsScore,
        comment: testByJsComment,
      })
      testByJsScores.push({
        testCaseName,
        traceId: trace.traceId,
        'test-by-js': testByJsScore,
        'test-by-js-comment': testByJsComment,
      })
    } catch (err) {
      console.error(`error processing testByJs for ${testCaseName}:`, err)
    } finally {
      await langfuse.flushAsync()
    }
  }

  // step 3: get the score
  const waitUntilScoreMatches = async () => {
    let apiGetScoresResponse: ApiGetScoresResponse
    while (true) {
      apiGetScoresResponse = await langfuse.api.scoreGet(
        { userId, name: 'test-by-llm' },
        {},
      )
      if (apiGetScoresResponse.data.length === testByJsScores.length) {
        const scores = apiGetScoresResponse.data.map((datum) => {
          const testByJsScore = testByJsScores.find(
            (testByJsScore) => testByJsScore.traceId === datum.traceId,
          )
          if (!testByJsScore) {
            throw new Error(`testByJsScore not found for ${datum.traceId}`)
          }
          return {
            ...testByJsScore,
            'test-by-llm': datum.value,
            'test-by-llm-comment': datum.comment,
          }
        })
        return scores
      }
      console.info('waiting for scores ...')
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
  const withTimeout = async <T>(
    promise: Promise<T>,
    ms: number,
  ): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timed out')), ms),
      ),
    ])
  }
  let scoreResult: {
    'test-by-llm': number | null | undefined
    'test-by-llm-comment': string | null | undefined
    testCaseName: string
    traceId: string
    'test-by-js': number
    'test-by-js-comment': string
  }[] = []
  try {
    // Timeout if not finished in 30 seconds
    scoreResult = await withTimeout(waitUntilScoreMatches(), 30000)
  } catch (err) {
    if (err instanceof Error && err.message.includes('Timed out')) {
      console.error('Failed to get matching score in time:', err)
    } else {
      throw err
    }
  }

  console.info('scoreResult', JSON.stringify(scoreResult, null, 2))

  // step 4: put the result to the result.json
  // This is for the github action to get the langfuse dataset run url. see also .github/workflows/prompt-test.yml
  const run = await langfuse.getDatasetRun({ datasetName, runName })
  const url = `${baseUrl}/project/${dataset.projectId}/datasets/${dataset.id}/runs/${run.id}`
  const result = {
    url,
    datasetRunItemsLength: run.datasetRunItems.length,
    testByJsBadCount: scoreResult.filter((datum) => datum['test-by-js'] < 1)
      .length,
    testByJsGoodCount: scoreResult.filter((datum) => datum['test-by-js'] >= 1)
      .length,
    testByLlmBadCount: scoreResult.filter(
      (datum) => datum['test-by-llm'] && datum['test-by-llm'] < 1,
    ).length,
    testByLlmGoodCount: scoreResult.filter(
      (datum) => datum['test-by-llm'] && datum['test-by-llm'] >= 1,
    ).length,
  }
  fs.writeFileSync('result.json', JSON.stringify(result, null, 2))

  // TODO: we need some vitest like report?
}

main().catch(console.error)
