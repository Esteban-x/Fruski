'use client'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface Props {
  key: string
  id: string
  username: string
  userType: string
  imgUrl: string
  name: string
}

const UserCard = ({ key, id, username, name, userType, imgUrl }: Props) => {
  const router = useRouter()
  return (
    <article className='user-card'>
      <div className='user-card_avatar'>
        <Image
          src={imgUrl}
          alt={'Profile image'}
          width={48}
          height={48}
          className='rounded-full'
        />
        <div className='flex-1 text-ellipsis'>
          <h4 className='text-base-semibold text-light-1'>{name}</h4>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>
      <Button
        className='user-card_btn'
        onClick={() => router.push(`profile/${id}`)}
      >
        View
      </Button>
    </article>
  )
}

export default UserCard
