import { createClient } from '@/libs/db/server'

export const getProjects = async (organizationId?: string) => {
  const supabase = await createClient()

  let query = supabase
    .from('Project')
    .select('id, name, createdAt, organizationId')
    .order('id', { ascending: false })

  if (organizationId) {
    query = query.eq('organizationId', organizationId)
  }

  const { data: projects, error } = await query

  if (error) {
    console.error('Error fetching projects:', error)
    return null
  }

  return projects
}
