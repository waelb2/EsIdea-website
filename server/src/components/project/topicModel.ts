import mongoose, { Schema } from 'mongoose'
import { TopicInterface } from './topicInterface'

const topicSchema = new Schema<TopicInterface>({
  topicName: {
    type: String,
    required: [true, 'Topic name is required']
  },
  parentTopic: { type: mongoose.Types.ObjectId, ref: 'Topic' }
})

export const Topic = mongoose.model<TopicInterface>('Topic', topicSchema)
