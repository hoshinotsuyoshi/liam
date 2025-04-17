import { createClient } from '@/libs/db/server'

export interface ProjectRepository {
  repository: {
    name: string
    owner: string
    installationId: number
  }
}

export const getProjectRepository = async (
  projectId: string,
): Promise<ProjectRepository | null> => {
  try {
    const supabase = await createClient()
    const { data: project, error } = await supabase
      .from('Project')
      .select(`
        *,
        ProjectRepositoryMapping:ProjectRepositoryMapping(
          *,
          Repository:Repository(
            name, owner, installationId
          )
        )
      `)
      .eq('id', projectId)
      .single()

    if (error) {
      return null
    }

    const repository = project?.ProjectRepositoryMapping[0]?.Repository
    if (!repository?.installationId || !repository.owner || !repository.name) {
      console.error('Repository information not found')
      return null
    }

    return {
      repository: {
        name: repository.name,
        owner: repository.owner,
        installationId: repository.installationId,
      },
    }
  } catch (error) {
    console.error('Error in getProjectRepository:', error)
    return null
  }
}
