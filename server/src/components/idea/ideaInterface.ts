import { Document } from 'mongoose'
import { UserInterface } from '../user/userInterface'
import { ProjectInterface } from '../project/projectInterface'
import { TopicInterface } from '../project/topicInterface'

// Interface for Idea document in MongoDB
export interface IdeaInterface extends Document {
  createdBy: UserInterface // User who created the idea
  projectId: ProjectInterface // Project associated with the idea
  content: string // Content of the idea
  creationDate: Date // Date and time when the idea was created
  topic: TopicInterface // Topic related to the idea
  comments: { // Array of comments on the idea
    content: string // Content of the comment
    author: UserInterface // Author of the comment
  }[]
  votes: number // Number of votes on the idea
  isBold: boolean // Flag indicating if the idea is bold
  isItalic: boolean // Flag indicating if the idea is italic
  color: string // Color of the idea
}
