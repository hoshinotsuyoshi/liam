'use server'

import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { redirect } from 'next/navigation'

export const addProject = async (formData: FormData) => {
  // FIXME: Transaction management will use Supabase RPC in the future
  const projectName = formData.get('projectName') as string
  const repositoryName = formData.get('repositoryName') as string
  const repositoryOwner = formData.get('repositoryOwner') as string
  const installationId = formData.get('installationId') as string
  const organizationId = formData.get('organizationId') as string

  const supabase = await createClient()
  const now = new Date().toISOString()

  // Create project
  const { data: project, error: projectError } = await supabase
    .from('Project')
    .insert({
      name: projectName,
      createdAt: now,
      updatedAt: now,
      ...(organizationId ? { organizationId } : {}),
    })
    .select()
    .single()

  if (projectError || !project) {
    throw new Error('Failed to create project')
  }

  // Create repository
  const { data: repository, error: repositoryError } = await supabase
    .from('Repository')
    .insert({
      name: repositoryName,
      owner: repositoryOwner,
      installationId: Number(installationId),
      isActive: true,
      updatedAt: now,
    })
    .select()
    .single()

  if (repositoryError || !repository) {
    throw new Error('Failed to create repository')
  }

  // Create project-repository mapping
  const { error: mappingError } = await supabase
    .from('ProjectRepositoryMapping')
    .insert({
      projectId: project.id,
      repositoryId: repository.id,
      updatedAt: now,
    })

  if (mappingError) {
    throw new Error('Failed to create project-repository mapping')
  }

  redirect(urlgen('projects/[projectId]', { projectId: `${project.id}` }))
}
