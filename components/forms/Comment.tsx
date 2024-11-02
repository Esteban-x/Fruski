'use client'
import { CommentValidation } from '@/lib/validations/post'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '../ui/input'
import Image from 'next/image'
import { Button } from '../ui/button'
import { addComment } from '@/lib/actions/post.actions'
interface Props {
  postId: string
  currentUserImg: string
  currentUserId: string
}
const Comment = ({ postId, currentUserImg, currentUserId }: Props) => {
  const path = usePathname()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addComment(postId, values.content, currentUserId, path)
    form.reset()
  }

  return (
    <div>
      <Form {...form}>
        <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='flex flex-row w-full items-center gap-3'>
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    width={48}
                    height={48}
                    className='rounded-full object-cover'
                    alt='Profile image'
                  />
                </FormLabel>
                <FormControl className='border-none bg-transparent'>
                  <Input
                    type='text'
                    placeholder='Comment...'
                    className='no-focus text-light-1 outline-none'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type='submit' className='comment-form_btn'>
            Reply
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Comment
