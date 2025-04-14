import type { Schema } from '@liam-hq/db-structure'
import { useSnapshot } from 'valtio'
import { schemaStore } from './store'

export const useSchemaStore = () =>
  useSnapshot(schemaStore) as Schema
