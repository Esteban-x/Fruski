import PostCard from '@/components/cards/PostCard'
import Comment from '@/components/forms/Comment'
import { fetchPostById } from '@/lib/actions/post.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params

  const user = await currentUser()

  if (!user) return null

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) redirect('/onboarding')

  const post = await fetchPostById(id)

  return (
    <section className='relative'>
      <div>
        <PostCard
          key={post._id}
          id={post._id}
          currentUserId={user?.id}
          parentId={post.parentId}
          content={post.text}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
          author={post.author}
        />
      </div>
      <div className='mt-7'>
        <Comment
          postId={post.id}
          currentUserImg={userInfo.image}
          currentUserId={userInfo._id.toString()}
        />
      </div>
      <div className='mt-10 space-y-4'>
        {post.children.map((childItem: any) => (
          <PostCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user?.id}
            parentId={childItem.parentId}
            content={childItem.text}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            author={childItem.author}
            isComment
          />
        ))}
      </div>
    </section>
  )
}

export default Page
