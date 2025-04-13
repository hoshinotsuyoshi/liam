export type TestCase = {
  bodyMarkdown: string
  feedbacks: [
    {
      severity: string
      suggestionSnippets: [
        {
          filename: string
          snippet: string
        },
      ]
    },
  ]
}

export const testCases = [
  'liam-hq/liam/pull/1033',
  'liam-hq/liam/pull/1055',
  'liam-hq/liam/pull/1105',
  'liam-hq/liam/pull/1304',
  'liam-hq/liam/pull/1322',
] as const

const commonTests = [
  (output: TestCase): [boolean, string] =>
    [output.feedbacks.filter((feedback) => feedback.severity === 'POSITIVE').length > 0, 'Positive feedback is present'],
  (output: TestCase): [boolean, string] =>
    [output.bodyMarkdown.split('. ').length <= 3, 'The generation must be less than 3 sentences'],
  (output: TestCase): [boolean, string] =>
    [output.bodyMarkdown.split(' ').length <= 80, 'The generation must be less than 80 words'],
]

type Description = string

export const testByJsRecords: Record<
  (typeof testCases)[number],
  () => ((output: TestCase) => [boolean, Description])[]
> = {
  'liam-hq/liam/pull/1033': () => {
    return [
      (output: TestCase): [boolean, string] =>
        [!!output.feedbacks
          .flatMap((feedback) => feedback.suggestionSnippets)
          .find(
            (snippet) =>
              snippet.filename ===
              'frontend/packages/db/prisma/migrations/20250328105323_add_branch_name_to_knowledge_suggestion/migration.sql',
          ), 'The file path must present in suggestion snippets'],
      (output: TestCase): [boolean, string] =>
        [!!output.feedbacks
          .flatMap((feedback) => feedback.suggestionSnippets)
          .find((snippet) =>
            snippet.snippet.includes(
              'ALTER TABLE "KnowledgeSuggestion" ADD COLUMN "branchName" TEXT NOT NULL DEFAULT \'',
            ),
          ), 'The sql expression must present in suggestion snippets'],
      ...commonTests,
    ]
  },
  'liam-hq/liam/pull/1055': () => {
    return [
      ...commonTests,
    ]
  },
  'liam-hq/liam/pull/1105': () => {
    return [
      ...commonTests,
    ]
  },
  'liam-hq/liam/pull/1304': () => {
    return [
      ...commonTests,
    ]
  },
  'liam-hq/liam/pull/1322': () => {
    return [
      ...commonTests,
    ]
  },
} 
