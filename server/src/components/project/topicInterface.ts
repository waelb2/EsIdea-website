import { Document } from 'mongoose'

/**
 * Interface representing a topic document in the database.
 */
export interface TopicInterface extends Document {
  /** The name of the topic. */
  topicName: string
  /** The parent topic, if any. */
  parentTopic?: TopicInterface | null
}
