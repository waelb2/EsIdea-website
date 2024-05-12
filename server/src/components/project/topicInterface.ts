import { Document } from 'mongoose'

export interface TopicInterface extends Document {
  topicName: string
  parentTopic?: TopicInterface | null
}
