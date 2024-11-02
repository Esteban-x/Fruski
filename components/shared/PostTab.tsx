import { fetchUserPosts } from '@/lib/actions/user.actions'
import React from 'react'
import PostCard from '../cards/PostCard'

interface Props {
  currentUserId: string
  accountId: string
  accountType: string
}

const PostTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserPosts(accountId)

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result?.posts.map((post: any) => (
        <PostCard
          key={post._id}
          id={post._id}
          author={
            accountType === 'User'
              ? { name: result.name, id: result.id, image: result.image }
              : {
                  name: post.author.name,
                  id: post.author.id,
                  image: post.author.image,
                }
          }
          currentUserId={currentUserId}
          comments={post.children}
          content={post.text}
          createdAt={post.createdAt}
          parentId={post.parentId}
          community={post.community}
        />
      ))}
    </section>
  )
}

export default PostTab
