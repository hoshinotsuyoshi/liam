import { OrganizationSwitcher } from '@/features/organizations/components/OrganizationSwitcher'
import { urlgen } from '@/utils/routes'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './ProjectsPage.module.css'
import {
  getCurrentOrganization,
  getUserOrganizations,
} from './getCurrentOrganization'
import { getProjects } from './getProjects'

interface Organization {
  id: string
  name: string
}

interface ProjectsPageProps {
  organizationId?: string
}

export const ProjectsPage: FC<ProjectsPageProps> = async ({
  organizationId,
}) => {
  const currentOrganization = organizationId
    ? await getCurrentOrganization(organizationId)
    : await getCurrentOrganization()
  const organizations = await getUserOrganizations()
  const projects = await getProjects(currentOrganization?.id)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Projects</h1>
          {currentOrganization && organizations && (
            <OrganizationSwitcher
              currentOrganization={currentOrganization as Organization}
              organizations={organizations as Organization[]}
            />
          )}
        </div>
        <Link
          href={
            currentOrganization
              ? urlgen('organizations/[organizationId]/projects/new', {
                  organizationId: currentOrganization.id.toString(),
                })
              : urlgen('organizations/new')
          }
          className={styles.createButton}
        >
          Create New Project
        </Link>
      </div>

      {projects === null || projects.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No projects found.</p>
          <p>Create a new project to get started.</p>
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <Link
              key={project.id}
              href={urlgen('projects/[projectId]', {
                projectId: `${project.id}`,
              })}
              className={styles.projectCard}
            >
              <h2>{project.name || 'Untitled Project'}</h2>
              <p className={styles.createdAt}>Created: {project.createdAt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
