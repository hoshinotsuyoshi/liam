import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from '../../../supabase/database.types'
import type { DocFilePathsOverride } from './doc_file_paths'
import type { GithubPullRequestCommentsOverride } from './github_pull_request_comments'
import type { GithubPullRequestsOverride } from './github_pull_requests'
import type { KnowledgeSuggestionDocMappingsOverride } from './knowledge_suggestion_doc_mappings'
import type { KnowledgeSuggestionsOverride } from './knowledge_suggestions'
import type { MigrationPullRequestMappingsOverride } from './migration_pull_request_mappings'
import type { MigrationsOverride } from './migrations'
import type { OverallReviewKnowledgeSuggestionMappingsOverride } from './overall_review_knowledge_suggestion_mappings'
import type { OverallReviewsOverride } from './overall_reviews'
import type { ProjectRepositoryMappingsOverride } from './project_repository_mappings'
import type { ReviewFeedbackKnowledgeSuggestionMappingsOverride } from './review_feedback_knowledge_suggestion_mappings'
import type { SchemaFilePathsOverride } from './schema_file_paths'

export type AppDatabaseOverrides = MergeDeep<
  DatabaseGenerated,
  KnowledgeSuggestionsOverride &
    KnowledgeSuggestionDocMappingsOverride &
    ReviewFeedbackKnowledgeSuggestionMappingsOverride &
    OverallReviewKnowledgeSuggestionMappingsOverride &
    OverallReviewsOverride &
    GithubPullRequestsOverride &
    MigrationPullRequestMappingsOverride &
    GithubPullRequestCommentsOverride &
    OverallReviewKnowledgeSuggestionMappingsOverride &
    SchemaFilePathsOverride &
    DocFilePathsOverride &
    ProjectRepositoryMappingsOverride &
    MigrationsOverride &
    GithubPullRequestsOverride
>
