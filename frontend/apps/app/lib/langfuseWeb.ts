import { LangfuseWeb } from 'langfuse'

export const getLangfuseWeb = () => {
  if (typeof window !== 'undefined') {
    return new LangfuseWeb({
      publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY || '',
    })
  }
  return null
}

export const generateTraceId = (entityType: string, entityId: string | number) => {
  return `${entityType}_${entityId}`
}
