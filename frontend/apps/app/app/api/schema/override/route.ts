import { SCHEMA_OVERRIDE_FILE_PATH } from '@/app/(app)/app/projects/[projectId]/ref/[branchOrCommit]/schema/[...schemaFilePath]/constants'
import { createClient } from '@/libs/db/server'
import { schemaOverrideSchema, tableGroupsSchema } from '@liam-hq/db-structure'
import { createOrUpdateFileContent, getFileContent } from '@liam-hq/github'
import { type NextRequest, NextResponse } from 'next/server'
import * as v from 'valibot'
import { parse as parseYaml } from 'yaml'

const requestParamsSchema = v.object({
  tableGroups: tableGroupsSchema,
  projectId: v.string(),
  branchOrCommit: v.string(),
})

export async function POST(request: NextRequest) {
  try {
    const requestParams = await request.json()
    const parsedRequestParams = v.safeParse(requestParamsSchema, requestParams)

    if (!parsedRequestParams.success) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 },
      )
    }

    const { tableGroups, projectId, branchOrCommit } =
      parsedRequestParams.output

    const supabase = await createClient()
    const { data: project } = await supabase
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
      .eq('id', Number(projectId))
      .single()

    const repository = project?.ProjectRepositoryMapping[0].Repository
    if (!repository?.installationId || !repository.owner || !repository.name) {
      return NextResponse.json(
        { error: 'Repository information not found' },
        { status: 404 },
      )
    }

    const repositoryFullName = `${repository.owner}/${repository.name}`
    const { content, sha } = await getFileContent(
      repositoryFullName,
      SCHEMA_OVERRIDE_FILE_PATH,
      branchOrCommit,
      Number(repository.installationId),
    )

    const rawSchemaOverride = content
      ? parseYaml(content)
      : { overrides: { tableGroups: {} } }

    const validationResult = v.safeParse(
      schemaOverrideSchema,
      rawSchemaOverride,
    )

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Failed to validate schema override file' },
        { status: 500 },
      )
    }

    const schemaOverride = validationResult.output
    schemaOverride.overrides.tableGroups = tableGroups

    const { success } = await createOrUpdateFileContent(
      repositoryFullName,
      SCHEMA_OVERRIDE_FILE_PATH,
      JSON.stringify(schemaOverride, null, 2),
      `Update ${SCHEMA_OVERRIDE_FILE_PATH}`,
      Number(repository.installationId),
      branchOrCommit,
      sha || undefined,
    )

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update schema override' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
