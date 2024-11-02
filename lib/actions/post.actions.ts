'use server'
import { revalidatePath } from 'next/cache'
import Post from '../models/post.model'
import User from '../models/user.model'
import { connectToDb } from '../mongoose'

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}

export const createPost = async ({
  text,
  author,
  communityId,
  path,
}: Params) => {
  try {
    connectToDb()

    const createdPost = await Post.create({
      text,
      author,
      community: null,
    })

    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    })

    revalidatePath(path)
  } catch (error: any) {
    console.error(error)
    throw new Error('Erreur lors de la création du post', error)
  }
}

export const fetchPosts = async (pageNumber = 1, pageSize = 20) => {
  connectToDb()

  /* On calcule le nombre de posts à ne pas afficher sur la page */
  const skipAmount = (pageNumber - 1) * pageSize

  /*   Query pour fetch les posts qui n'ont pas de parents */
  const postsQuery = Post.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: 'children',
      populate: {
        path: 'children',
        model: User,
        select: '_id name parentId image',
      },
    })

  const totalPostsCount = await Post.countDocuments({
    parentId: { $in: [null, undefined] },
  })

  const posts = await postsQuery.exec()

  const isNext = totalPostsCount > skipAmount + posts.length

  return { posts, isNext }
}

export const fetchPostById = async (postId: string) => {
  connectToDb()
  try {
    const post = await Post.findById({
      _id: postId,
    })
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'children',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentId image',
          },
          {
            path: 'children',
            model: Post,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentId image',
            },
          },
        ],
      })
      .exec()

    return post
  } catch (error: any) {
    console.error(error)
    throw new Error('Erreur lors de la récuperation du post', error)
  }
}

export const addComment = async (
  postId: string,
  content: string,
  userId: string,
  path: string
) => {
  connectToDb()
  try {
    const post = await Post.findById(postId)

    if (!post) {
      throw new Error('Post introuvable')
    }

    const commentPost = new Post({
      text: content,
      author: userId,
      parentId: postId,
    })

    const savedCommentPost = await commentPost.save()

    post.children.push(savedCommentPost)

    await post.save()

    revalidatePath(path)
  } catch (error: any) {
    throw new Error("Erreur lors de l'ajout du commentaire ")
  }
}
