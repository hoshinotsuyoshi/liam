import type { Schema } from '@liam-hq/db-structure'
import { deepClone } from 'valtio/utils'
import { schemaStore } from './store'

export const initSchemaStore = (schema: Schema) => {
  for (const key of Object.keys(schema)) {
    // @ts-expect-error ... for (const value of Object.keys(obj)) is not typed
    schemaStore[key] = deepClone(schema[key])
  }
}
