import { Document } from 'mongoose'

// Define the interface for IdeationMethod
export interface IdeationMethodInterface extends Document {
  methodName: string // Name of the ideation method
  description: string // Description of the ideation method
}
