'use client'

import { createClient } from '@/libs/db/client'
import { urlgen } from '@/utils/routes'
import { Button } from '@liam-hq/ui'
import { useRouter } from 'next/navigation'
import { type FC, type FormEvent, useState } from 'react'
import { Tabs } from '../../components/Tabs'
import styles from './OrganizationDetailPage.module.css'

interface OrganizationDetailPageProps {
  organization: {
    id: string
    name: string
  }
  members: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  }> | null
  invites: Array<{
    id: string
    email: string
    inviteBy: {
      id: string
      name: string
      email: string
    }
  }> | null
}

export const OrganizationDetailPage: FC<OrganizationDetailPageProps> = ({
  organization,
  members,
  invites,
}) => {
  const [name, setName] = useState(organization.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!name) {
      setError('Organization name is required')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const supabase = await createClient()

      const { error: updateError } = await supabase
        .from('Organization')
        .update({ name })
        .eq('id', organization.id)

      if (updateError) throw updateError

      setSuccessMessage('Organization updated successfully')
      router.refresh()
    } catch (err) {
      console.error('Error updating organization:', err)
      setError('Failed to update organization. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{organization.name}</h1>
        <Button
          onClick={() =>
            router.push(
              urlgen('organizations/[organizationId]/projects/new', {
                organizationId: organization.id.toString(),
              }),
            )
          }
        >
          Create Project
        </Button>
      </div>

      <Tabs
        tabs={[
          {
            id: 'general',
            label: 'General',
            children: (
              <div className={styles.generalTab}>
                <form className={styles.form} onSubmit={handleUpdate}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Organization Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      disabled={loading}
                    />
                  </div>
                  {error && <p className={styles.error}>{error}</p>}
                  {successMessage && (
                    <p className={styles.success}>{successMessage}</p>
                  )}
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Organization'}
                  </Button>
                </form>
              </div>
            ),
          },
          {
            id: 'members',
            label: 'Members',
            children: (
              <div className={styles.membersTab}>
                <h2 className={styles.sectionTitle}>Members</h2>
                <div className={styles.table}>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members && members.length > 0 ? (
                        members.map((member) => (
                          <tr key={member.id}>
                            <td>{member.user.name}</td>
                            <td>{member.user.email}</td>
                            <td>ACTIVE</td>
                            <td>-</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No members found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <h2 className={styles.sectionTitle}>Invites</h2>
                <div className={styles.table}>
                  <table>
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Invited By</th>
                        <th>Invited On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invites && invites.length > 0 ? (
                        invites.map((invite) => (
                          <tr key={invite.id}>
                            <td>{invite.email}</td>
                            <td>{invite.inviteBy.name}</td>
                            <td>-</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3}>No pending invites</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          },
        ]}
        defaultTab="general"
      />
    </div>
  )
}
