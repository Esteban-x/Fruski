import mongoose from 'mongoose'

let isConnected = false

export const connectToDb = async () => {
  mongoose.set('strictQuery', true)
  if (!process.env.MONGODB_URL)
    return console.log('Pas de variable environnement pour MongoDB')
  if (isConnected) console.log('Déja connecté à la base de données')
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true
  } catch (error) {
    console.error(error)
  }
}
