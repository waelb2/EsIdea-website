import { Document } from 'mongoose'

export interface IdeationMethodInterface extends Document {
  methodName: string
  description: string
}
