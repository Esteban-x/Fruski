import * as z from 'zod'

export const PostValidation = z.object({
  thread: z.string().min(3),
  accountId: z.string(),
})

export const CommentValidation = z.object({
  content: z.string().min(1).max(10000),
})
