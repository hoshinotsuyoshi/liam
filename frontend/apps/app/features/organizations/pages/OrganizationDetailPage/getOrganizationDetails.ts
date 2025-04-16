import { createClient } from '@/libs/db/server'

export const getOrganizationDetails = async (organizationId: string) => {
  const supabase = await createClient()

  const { data: organization, error } = await supabase
    .from('Organization')
    .select('*')
    .eq('id', organizationId)
    .single()

  if (error) {
    console.error('Error fetching organization:', error)
    return null
  }

  return organization
}

export const getOrganizationMembers = async (organizationId: string) => {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('OrganizationMember')
    .select(`
      id,

      user:userId(
        id,
        name,
        email
      )
    `)
    .eq('organizationId', organizationId)

  if (error) {
    console.error('Error fetching organization members:', error)
    return null
  }

  return members
}

export const getOrganizationInvites = async (organizationId: string) => {
  const supabase = await createClient()

  const { data: invites, error } = await supabase
    .from('MembershipInvites')
    .select(`
      id,
      email,

      inviteBy:inviteByUserId(
        id,
        name,
        email
      )
    `)
    .eq('organizationId', organizationId)

  if (error) {
    console.error('Error fetching organization invites:', error)
    return null
  }

  return invites
}
