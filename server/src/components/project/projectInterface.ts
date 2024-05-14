// Importing required modules and interfaces
import { Document } from 'mongoose'
import { IdeaInterface } from '../idea/ideaInterface'
import { UserInterface } from '../user/userInterface'
import { ProjectStatus, ProjectVisibility } from './projectModels'
import { TemplateInterface } from '../template/templateInterface'
import { IdeationMethodInterface } from '../idea/ideationMethodInterface'
import { TopicInterface } from './topicInterface'
import { ClubInterface } from '../club/clubInterface'
import { ModuleInterface } from '../module/moduleInterface'
import { EventInterface } from '../event/eventInterface'

// Defining the ProjectInterface extending the Document interface from mongoose
export interface ProjectInterface extends Document {
  // Coordinator of the project
  coordinator: UserInterface
  // Title of the project
  title: string
  // Description of the project (optional)
  description?: string
  // Template used for the project
  template: TemplateInterface
  // Ideation method employed for the project
  ideationMethod: IdeationMethodInterface
  // Date of project creation
  creationDate: Date
  // Deadline for the project (optional)
  deadline?: Date
  // Status of the project
  status: ProjectStatus
  // Visibility of the project
  visibility: ProjectVisibility
  // Number of collaborators in the project
  collaboratorsCount: number
  // List of collaborators with their join dates
  collaborators: {
    member: UserInterface
    joinedAt: Date
  }[]
  // List of ideas associated with the project
  ideas: IdeaInterface[]
  // Main topic of the project
  mainTopic: TopicInterface
  // Sub-topics of the project (optional)
  subTopics?: TopicInterface[]
  // Clubs associated with the project
  clubs: ClubInterface[]
  // Modules associated with the project
  modules: ModuleInterface[]
  // Events associated with the project
  events: EventInterface[]
  // URL of the project thumbnail
  thumbnailUrl: string
  // Timer setting for the project
  timer: number
}
