import { createClient } from '@/libs/db/server'
import { describe, expect, it } from 'vitest'
import { getProjectRepository } from './getProjectRepository'

describe('getProjectRepository', () => {
  it.skip('should return repository information with the correct structure', async () => {
    const supabase = await createClient()

    // Create test repository
    const { data: repository } = await supabase
      .from('Repository')
      .insert({
        name: 'test-repo',
        owner: 'test-owner',
        installationId: 12345,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    // Create test project
    const { data: project } = await supabase
      .from('Project')
      .insert({
        name: 'Test Project',
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single()

    // Fail the test if project or repository doesn't exist
    expect(project).not.toBeNull()
    expect(repository).not.toBeNull()

    if (!project || !repository) {
      throw new Error('Project or repository is null')
    }

    // Create mapping between project and repository
    await supabase.from('ProjectRepositoryMapping').insert({
      projectId: project.id,
      repositoryId: repository.id,
      updatedAt: new Date().toISOString(),
    })

    const result = await getProjectRepository(project.id.toString())

    expect(result).not.toBeNull()
    expect(result?.repository).toHaveProperty('name', 'test-repo')
    expect(result?.repository).toHaveProperty('owner', 'test-owner')
    expect(result?.repository).toHaveProperty('installationId', '12345')
  })

  it('should return null when project does not exist', async () => {
    const result = await getProjectRepository('999999')
    expect(result).toBeNull()
  })
})
