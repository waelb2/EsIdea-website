import mongoose, { Schema, Document, mongo } from 'mongoose'
import { IdeaInterface } from './ideaInterface'

const ideaSchema = new Schema<IdeaInterface>({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now()
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  comments: [
    {
      content: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  votes: {
    type: Number,
    default: 0
  },
  isBold: Boolean,
  isItalic: Boolean,
  color: String
})

const Idea = mongoose.model<IdeaInterface>('Idea', ideaSchema)

export { Idea }
