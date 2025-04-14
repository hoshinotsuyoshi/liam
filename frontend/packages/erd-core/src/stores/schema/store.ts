import type { Schema } from '@liam-hq/db-structure'
import { proxy } from 'valtio'

export const schemaStore = proxy<Schema>({
  tables: {},
  relationships: {},
  tableGroups: {},
})
