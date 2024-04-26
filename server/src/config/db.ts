import mongoose from 'mongoose'

export const connectDB = (uri: string) => {
  return mongoose.connect(uri)
}
