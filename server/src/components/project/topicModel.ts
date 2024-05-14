import mongoose, { Schema } from 'mongoose'
import { TopicInterface } from './topicInterface'

// Defining the schema for the Topic document
const topicSchema = new Schema<TopicInterface>({
  /** The name of the topic. */
  topicName: {
    type: String,
    required: [true, 'Topic name is required']
  },
  /** Reference to the parent topic, if any. */
  parentTopic: { type: mongoose.Types.ObjectId, ref: 'Topic' }
})

// Creating the Topic model from the schema
export const Topic = mongoose.model<TopicInterface>('Topic', topicSchema)
