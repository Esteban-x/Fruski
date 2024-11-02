import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async () => {
  const user = await currentUser()
  const userInfo = await fetchUser(user?.id)

  if (!user) redirect('/')

  if (!userInfo.onboarded) redirect('/onboading')

  const activity = await getActivity(userInfo._id.toString())

  return (
    <section>
      <h1 className='head-text mb-10'>Activities</h1>
      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map(activity => (
              <Link
                key={activity._id.toString()}
                href={`post/${activity.parentId}`}
              >
                <article className='activity-card'>
                  <Image
                    src={activity.author.image}
                    alt={'Profile image'}
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='flex flex-row gap-2 !text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500 capitalize'>
                      {activity.author.username}
                    </span>{' '}
                    replied to your post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </section>
  )
}

export default Page
