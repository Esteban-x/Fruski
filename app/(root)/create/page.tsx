import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchUser } from '@/lib/actions/user.actions'
import PostThread from '@/components/forms/PostThread'

const Page = async () => {
  const user = await currentUser()

  if (!user) redirect('/')

  const userInfo = await fetchUser(user.id)

  if (!userInfo?.onboarded) {
    redirect('/onboarding')
  }

  return (
    <>
      <h1 className='head-text'>Create Thread</h1>
      <PostThread objectId={userInfo._id.toString()} userId={userInfo.id} />
    </>
  )
}

export default Page
