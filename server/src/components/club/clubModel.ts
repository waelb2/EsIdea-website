import mongoose, { Schema } from 'mongoose'
import { ClubInterface } from './clubInterface'

// Define the schema for the club document
const clubSchema = new Schema<ClubInterface>({
  clubName: {
    type: String,
    required: [true, 'Club name is required'], // Club name is a required field
  },
  description: {
    imageUrl: String,
    creationDate: String,
    field: String,
    numberOfEvents: Number,
    majorEvents: [String],
  }
})

// Create a model for the club document
const Club = mongoose.model<ClubInterface>('Club', clubSchema)

export { Club }
