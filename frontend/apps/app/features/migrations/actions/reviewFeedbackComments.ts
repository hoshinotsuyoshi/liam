'use server'

import { createClient } from '@/libs/db/server'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import * as v from 'valibot'

// Schema for adding a comment
const addCommentSchema = v.object({
  feedbackId: v.pipe(v.string()),
  content: v.pipe(v.string(), v.minLength(1, 'Comment cannot be empty')),
})

// Schema for fetching comments
const getCommentsSchema = v.object({
  feedbackId: v.pipe(v.string()),
})

// Type for a comment with user information
export type CommentWithUser = Tables<'ReviewFeedbackComment'> & {
  user: Tables<'User'>
}

/**
 * Add a comment to a review feedback
 */
export async function addReviewFeedbackComment(data: {
  feedbackId: string
  content: string
}) {
  // Validate input data
  const parsedData = v.safeParse(addCommentSchema, data)
  if (!parsedData.success) {
    throw new Error(`Invalid data: ${JSON.stringify(parsedData.issues)}`)
  }

  // Get the current user
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    throw new Error('You must be logged in to add a comment')
  }

  const { feedbackId, content } = parsedData.output
  const now = new Date().toISOString()

  try {
    // Insert the comment
    const { data: comment, error } = await supabase
      .from('ReviewFeedbackComment')
      .insert({
        reviewFeedbackId: feedbackId,
        userId: userData.user.id,
        content,
        updatedAt: now,
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to add comment: ${error.message}`)
    }

    return { success: true, data: comment }
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

/**
 * Get comments for a review feedback with user information
 */
export async function getReviewFeedbackComments(data: {
  feedbackId: string
}): Promise<CommentWithUser[]> {
  // Validate input data
  const parsedData = v.safeParse(getCommentsSchema, data)
  if (!parsedData.success) {
    throw new Error(`Invalid data: ${JSON.stringify(parsedData.issues)}`)
  }

  const { feedbackId } = parsedData.output

  try {
    const supabase = await createClient()

    // Get comments with user information
    const { data: comments, error } = await supabase
      .from('ReviewFeedbackComment')
      .select<string, CommentWithUser>(`
        *,
        user:userId (
          name
        )
      `)
      .eq('reviewFeedbackId', feedbackId)
      .order('createdAt', { ascending: true })

    if (error) {
      throw new Error(`Failed to get comments: ${error.message}`)
    }

    return comments
  } catch (error) {
    console.error('Error getting comments:', error)
    throw error
  }
}
