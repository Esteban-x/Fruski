'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { PostValidation } from '@/lib/validations/post'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { createPost } from '@/lib/actions/post.actions'

interface Props {
  userId: string
  objectId: string
}

const PostThread = ({ userId, objectId }: Props) => {
  const path = usePathname()
  const router = useRouter()

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: { thread: '', accountId: userId },
  })

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    await createPost({
      text: values.thread,
      author: objectId,
      path,
      communityId: null,
    })

    router.push('/')
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-10 mt-10'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex flex-col w-full gap-3'>
              <FormLabel>{field.name}</FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea {...field} rows={15} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          Publish
        </Button>
      </form>
    </Form>
  )
}

export default PostThread
