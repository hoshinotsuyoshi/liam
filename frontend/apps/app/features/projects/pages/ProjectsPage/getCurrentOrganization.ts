import { createClient } from '@/libs/db/server'

export const getCurrentOrganization = async (
  specificOrganizationId?: string,
) => {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.error('Error fetching user:', userError)
    return null
  }

  let query = supabase
    .from('OrganizationMember')
    .select(`
      organization:organizationId(
        id,
        name
      )
    `)
    .eq('userId', userData.user.id)

  if (specificOrganizationId) {
    query = query.eq('organizationId', specificOrganizationId)
  }

  const { data: organizationMembers, error } = await query

  if (error) {
    console.error('Error fetching organizations:', error)
    return null
  }

  if (!organizationMembers || organizationMembers.length === 0) {
    return null
  }

  return organizationMembers[0].organization
}

export const getUserOrganizations = async () => {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    console.error('Error fetching user:', userError)
    return null
  }

  const { data: organizationMembers, error } = await supabase
    .from('OrganizationMember')
    .select(`
      organization:organizationId(
        id,
        name
      )
    `)
    .eq('userId', userData.user.id)

  if (error) {
    console.error('Error fetching organizations:', error)
    return null
  }

  return organizationMembers.map((item) => item.organization)
}
