import mongoose, { Schema } from 'mongoose'
import { IdeaInterface } from './ideaInterface'

// Define the schema for the Idea model
const ideaSchema = new Schema<IdeaInterface>({
  // The user who created the idea
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The project to which the idea belongs
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  // The content of the idea
  content: {
    type: String,
    required: true
  },
  // The date when the idea was created (defaults to current date)
  creationDate: {
    type: Date,
    default: Date.now()
  },
  // The topic associated with the idea
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  // Comments on the idea
  comments: [
    {
      // The content of the comment
      content: String,
      // The author of the comment
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  // Number of votes received by the idea
  votes: {
    type: Number,
    default: 0
  },
  // Whether the idea text is bold
  isBold: Boolean,
  // Whether the idea text is italicized
  isItalic: Boolean,
  // The color of the idea text
  color: String
})

// Create the Idea model
const Idea = mongoose.model<IdeaInterface>('Idea', ideaSchema)

export { Idea }
