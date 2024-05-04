import { Document } from 'mongoose'
import { UserInterface } from '../user/userInterface'
import { ProjectInterface } from '../project/projectInterface'
import { TopicInterface } from '../project/topicInterface'

export interface IdeaInterface extends Document {
  createdBy: UserInterface
  projectId: ProjectInterface
  content: string
  creationDate: Date
  topic: TopicInterface
  comments: {
    content: string
    author: UserInterface
  }[]
  votes: number
  isBold: boolean
  isItalic: boolean
  color: string
}
