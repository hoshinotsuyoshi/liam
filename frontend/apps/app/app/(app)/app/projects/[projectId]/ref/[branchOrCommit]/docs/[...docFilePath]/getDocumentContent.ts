import { getFileContent } from '@liam-hq/github'
import { getProjectRepository } from './getProjectRepository'

export interface DocumentContentParams {
  projectId: string
  branchOrCommit: string
  docFilePath: string[]
}

export const getDocumentContent = async ({
  projectId,
  branchOrCommit,
  docFilePath,
}: DocumentContentParams): Promise<string | null> => {
  try {
    const projectRepo = await getProjectRepository(projectId)
    if (!projectRepo) {
      console.error('Repository information not found')
      return null
    }

    const { repository } = projectRepo
    const repositoryFullName = `${repository.owner}/${repository.name}`
    const filePath = docFilePath.join('/')

    const fileData = await getFileContent(
      repositoryFullName,
      filePath,
      branchOrCommit,
      Number(repository.installationId),
    )

    return fileData.content
  } catch (error) {
    console.error('Error fetching document content:', error)
    return null
  }
}
