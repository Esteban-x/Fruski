import PostCard from '@/components/cards/PostCard'
import { fetchPosts } from '@/lib/actions/post.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const result = await fetchPosts(1, 30)
  const user = await currentUser()
  const userInfo = await fetchUser(user?.id)

  if (!user) return null

  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <main>
      <h1 className='head-text text-left'>Home</h1>
      <section className='mt-9 flex flex-col gap-10'>
        {result.posts.length === 0 ? (
          <p className='no-result'>No posts founds</p>
        ) : (
          <>
            {result.posts.map(post => (
              <PostCard
                key={post.id}
                id={post.id}
                currentUserId={user?.id}
                parentId={post.parentId}
                content={post.text}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                author={post.author}
              />
            ))}
          </>
        )}
      </section>
    </main>
  )
}
