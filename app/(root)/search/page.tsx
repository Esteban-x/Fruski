import UserCard from '@/components/cards/UserCard'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async () => {
  const user = await currentUser()
  const userInfo = await fetchUser(user?.id)

  const result = await fetchUsers({
    userId: user?.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25,
  })

  if (!user) redirect('/')

  if (!userInfo?.onboarded) redirect('/onboarding')

  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1>
      <div className='mt-14 flex-flex col gap-9'>
        {!result.users ? (
          <p className='no-result'>No users found...</p>
        ) : (
          <>
            {result.users.map(user => (
              <UserCard
                key={user.id}
                id={user.id}
                username={user.username}
                imgUrl={user.image}
                userType={'User'}
                name={user.name}
              />
            ))}
          </>
        )}
      </div>
    </section>
  )
}

export default Page
