'use server'

import { revalidatePath } from 'next/cache'
import User from '../models/user.model'
import { connectToDb } from '../mongoose'
import Post from '../models/post.model'
import { FilterQuery, SortOrder } from 'mongoose'

interface Params {
  userId: string | undefined
  username: string
  name: string
  bio: string
  image: string
  path: string
}

export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: Params): Promise<void> => {
  try {
    connectToDb()
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    )
    if (path === '/profile/edit') revalidatePath(path)
  } catch (error: any) {
    throw new Error(`Impossible de créer ou d'update un User ${error.message}`)
  }
}

export const fetchUser = async (userId: string | undefined) => {
  try {
    connectToDb()
    return await User.findOne({ id: userId }) /* .populate({
      path: 'communities',
      model: 'Community',
    }) */
  } catch (error: any) {
    throw new Error(error)
  }
}

export const fetchUserPosts = async (userId: string) => {
  try {
    connectToDb()

    const posts = await User.findOne({ id: userId }).populate({
      path: 'posts',
      model: Post,
      populate: [
        {
          path: 'children',
          model: Post,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id',
          },
        },
      ],
    })

    return posts
  } catch (error: any) {
    throw new Error(
      'Erreur lors de la récuperation des posts du User',
      error.message
    )
  }
}

export const fetchUsers = async ({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string | undefined
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}) => {
  try {
    connectToDb()

    const skipAmount = (pageNumber - 1) * pageSize

    const regex = new RegExp(searchString, 'i')

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    }

    if (searchString.trim() !== '') {
      query.$or = [
        {
          username: { $regex: regex },
          name: { $regex: regex },
        },
      ]
    }

    const sortOption = { createdAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOption)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec()

    const isNext = totalUsersCount > skipAmount + users.length

    return { users, isNext }
  } catch (error: any) {
    throw new Error(
      'Erreur lors de la récuperation des utilisateurs',
      error.message
    )
  }
}

export const getActivity = async (userId: string) => {
  try {
    connectToDb()

    const userPosts = await Post.find({ author: userId })

    const childPostIds = userPosts.reduce((acc, userPost) => {
      return acc.concat(userPost.children)
    }, [])

    const replies = await Post.find({
      _id: { $in: childPostIds },
      author: { $ne: userId },
    }).populate({
      path: 'author',
      model: User,
      select: 'name username image _id ',
    })

    return replies
  } catch (error: any) {
    console.log(error)
    throw new Error("Erreur lors de la récupération de l'activité", error)
  }
}
