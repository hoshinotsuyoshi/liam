import type { PageProps } from '@/app/types'
import { BranchDetailPage } from '@/features/projects/pages/BranchDetailPage/BranchDetailPage'
import { branchOrCommitSchema } from '@/utils/routes'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  projectId: v.string(),
  branchOrCommit: branchOrCommitSchema,
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, params)
  if (!parsedParams.success) return notFound()

  const { projectId, branchOrCommit } = parsedParams.output
  return (
    <BranchDetailPage projectId={projectId} branchOrCommit={branchOrCommit} />
  )
}
