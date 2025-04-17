import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import styles from './KnowledgeSuggestionsListPage.module.css'

type Props = {
  projectId: string
  branchOrCommit: string
}

async function getKnowledgeSuggestions(
  projectId: string,
  branchOrCommit: string,
) {
  const projectId_num = projectId
  const supabase = await createClient()

  const { data: knowledgeSuggestions, error } = await supabase
    .from('KnowledgeSuggestion')
    .select(
      'id, type, title, path, approvedAt, createdAt, updatedAt, branchName',
    )
    .eq('projectId', projectId_num)
    .eq('branchName', branchOrCommit)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching knowledge suggestions:', error)
    notFound()
  }

  return knowledgeSuggestions || []
}

export const KnowledgeSuggestionsListPage: FC<Props> = async ({
  projectId,
  branchOrCommit,
}) => {
  const knowledgeSuggestions = await getKnowledgeSuggestions(
    projectId,
    branchOrCommit,
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link
            href={urlgen('projects/[projectId]/ref/[branchOrCommit]', {
              projectId,
              branchOrCommit,
            })}
            className={styles.backLink}
            aria-label="Back to project details"
          >
            ← Back to Branch Details
          </Link>
          <h1 className={styles.title}>
            Knowledge Suggestions for {branchOrCommit}
          </h1>
        </div>
      </div>

      <div className={styles.content}>
        {knowledgeSuggestions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No knowledge suggestions found for this branch.</p>
          </div>
        ) : (
          <ul className={styles.suggestionsList}>
            {knowledgeSuggestions.map((suggestion) => (
              <li key={suggestion.id} className={styles.suggestionItem}>
                <Link
                  href={urlgen(
                    'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions/[id]',
                    {
                      projectId,
                      branchOrCommit,
                      id: `${suggestion.id}`,
                    },
                  )}
                  className={styles.suggestionLink}
                >
                  <div className={styles.suggestionTitle}>
                    {suggestion.title}
                  </div>
                  <div className={styles.suggestionMeta}>
                    <span className={styles.metaItem}>
                      Type: {suggestion.type}
                    </span>
                    <span className={styles.metaItem}>
                      Path: {suggestion.path}
                    </span>
                    <span
                      className={
                        suggestion.approvedAt ? styles.approved : styles.pending
                      }
                    >
                      Status: {suggestion.approvedAt ? 'Approved' : 'Pending'}
                    </span>
                    <span className={styles.metaItem}>
                      Created:{' '}
                      {new Date(suggestion.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        hour12: false,
                      })}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
