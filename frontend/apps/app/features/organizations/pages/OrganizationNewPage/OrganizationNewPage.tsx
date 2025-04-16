'use client'

import { createClient } from '@/libs/db/client'
import type { SupabaseClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { Button } from '@liam-hq/ui'
import { useRouter } from 'next/navigation'
import { type FC, type FormEvent, useState } from 'react'
import styles from './OrganizationNewPage.module.css'

export const OrganizationNewPage: FC = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createOrg = async (supabase: SupabaseClient) => {
    const { data, error } = await supabase
      .from('Organization')
      .insert({ name })
      .select('id')
      .single()

    if (error) throw error
    return data
  }

  const addUserToOrg = async (
    supabase: SupabaseClient,
    userId: string,
    organizationId: string,
  ) => {
    const { error } = await supabase.from('OrganizationMember').insert({
      userId,
      organizationId,
    })

    if (error) throw error
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name) {
      setError('Organization name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = await createClient()

      const organization = await createOrg(supabase)

      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      await addUserToOrg(supabase, userData.user.id, organization.id)

      router.push(
        urlgen('organizations/[organizationId]/projects/new', {
          organizationId: organization.id.toString(),
        }),
      )
    } catch (err) {
      console.error('Error creating organization:', err)
      setError('Failed to create organization. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Create Organization</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Organization Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter organization name"
            className={styles.input}
            disabled={loading}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Organization'}
        </Button>
      </form>
    </div>
  )
}
