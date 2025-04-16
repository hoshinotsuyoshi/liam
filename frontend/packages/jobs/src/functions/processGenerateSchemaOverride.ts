import { v4 as uuidv4 } from 'uuid'
import { createClient } from '../libs/supabase'
import { generateSchemaOverride } from '../prompts/generateSchemaOverride/generateSchemaOverride'
import type {
  GenerateSchemaOverridePayload,
  SchemaOverrideResult,
} from '../types'
import { fetchSchemaInfoWithOverrides } from '../utils/schemaUtils'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

export const processGenerateSchemaOverride = async (
  payload: GenerateSchemaOverridePayload,
): Promise<SchemaOverrideResult> => {
  try {
    const supabase = createClient()

    // Get the overall review from the database with nested relations
    const { data: overallReview, error } = await supabase
      .from('OverallReview')
      .select(`
        *,
        pullRequest:PullRequest(*,
          repository:Repository(*)
        ),
        project:Project(*)
      `)
      .eq('id', payload.overallReviewId)
      .single()

    if (error || !overallReview) {
      throw new Error(
        `Overall review with ID ${payload.overallReviewId} not found: ${JSON.stringify(error)}`,
      )
    }

    const { pullRequest, project } = overallReview
    if (!pullRequest) {
      throw new Error(
        `Pull request not found for overall review ${payload.overallReviewId}`,
      )
    }

    if (!project) {
      throw new Error(
        `Project not found for overall review ${payload.overallReviewId}`,
      )
    }

    const { repository } = pullRequest
    if (!repository) {
      throw new Error(`Repository not found for pull request ${pullRequest.id}`)
    }

    const predefinedRunId = uuidv4()
    const callbacks = [langfuseLangchainHandler]

    // Fetch schema information with overrides
    const repositoryFullName = `${repository.owner}/${repository.name}`
    const { currentSchemaOverride, overriddenSchema } =
      await fetchSchemaInfoWithOverrides(
        project.id,
        overallReview.branchName,
        repositoryFullName,
        repository.installationId,
      )

    const schemaOverrideResult = await generateSchemaOverride(
      overallReview.reviewComment || '',
      callbacks,
      currentSchemaOverride,
      predefinedRunId,
      overriddenSchema,
    )

    // If no update is needed, return early with createNeeded: false
    if (!schemaOverrideResult.updateNeeded) {
      return {
        createNeeded: false,
      }
    }

    // Return the schema meta along with information needed for createKnowledgeSuggestionTask
    return {
      createNeeded: true,
      override: schemaOverrideResult.override,
      projectId: project.id,
      pullRequestNumber: Number(pullRequest.pullNumber), // Convert bigint to number
      branchName: overallReview.branchName, // Get branchName from overallReview
      title: `Schema meta update from PR #${Number(pullRequest.pullNumber)}`,
      traceId: predefinedRunId,
      reasoning: schemaOverrideResult.reasoning,
      overallReviewId: payload.overallReviewId,
    }
  } catch (error) {
    console.error('Error generating schema meta:', error)
    throw error
  }
}
