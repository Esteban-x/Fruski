import PostTab from '@/components/shared/PostTab'
import ProfileHeader from '@/components/shared/ProfileHeader'
import { TabsTrigger, TabsList, Tabs, TabsContent } from '@/components/ui/tabs'
import { profileTabs } from '@/constants'
import { fetchUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const user = await currentUser()

  if (!user) return null

  const currentUserInfo = await fetchUser(user.id)
  const userInfo = await fetchUser(id)
  console.log(userInfo)

  if (!currentUserInfo.onboarded) redirect('/onboarding')

  return (
    <section>
      <ProfileHeader
        accountId={userInfo._id.toString()}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className='mt-9'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map(tab => (
              <TabsTrigger className='tab' key={tab.label} value={tab.value}>
                <Image
                  alt={tab.label}
                  src={tab.icon}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>
                {tab.label === 'Posts' && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo?.posts?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map(tab => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              <PostTab
                currentUserId={currentUserInfo.id}
                accountId={userInfo.id}
                accountType='User'
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

export default Page
