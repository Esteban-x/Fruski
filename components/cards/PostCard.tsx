import { ObjectId } from 'mongoose'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  key: ObjectId | string
  id: ObjectId | string
  currentUserId: string | undefined
  parentId: ObjectId | null
  content: string
  community: {
    id: string
    name: string
    image: string
  } | null
  createdAt: Date
  comments: {
    author: {
      image: string
    }
  }[]
  author: {
    name: string
    image: string
    id: string
  }
  isComment?: boolean
}

const PostCard = ({
  key,
  id,
  author,
  currentUserId,
  parentId,
  content,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`}
    >
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                fill
                alt='Profile image'
                className='cursor-pointer rounded-full'
              />
            </Link>
            <div className='thread-card_bar' />
          </div>
          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit'>
              <h4 className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </h4>
            </Link>
            <p className='mt-2 text-small-regular text-light-2'>{content}</p>
            <div className='mt-5 flex flex-col gap-3'>
              <div className='flex gap-3.5'>
                <Image
                  src='/assets/heart-gray.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer'
                />
                <Link href={`/post/${id.toString()}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='heart'
                    width={24}
                    height={24}
                    className='cursor-pointer'
                  />
                </Link>

                <Image
                  src='/assets/repost.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer'
                />
                <Image
                  src='/assets/share.svg'
                  alt='heart'
                  width={24}
                  height={24}
                  className='cursor-pointer'
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`post/${id.toString()}`}>
                  <div className='mt-1 text-subtle-medium text-gray-1'></div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PostCard
