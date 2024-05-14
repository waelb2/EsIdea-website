// Importing mongoose and Schema from mongoose
import mongoose, { Schema } from 'mongoose'
// Importing interfaces
import { TopicInterface } from './topicInterface'
import { ProjectInterface } from './projectInterface'

// Enum for project status
enum ProjectStatus {
  InProgress = 'in_progress',
  Completed = 'completed'
}

// Enum for project visibility
enum ProjectVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

// Enum for project associations
enum projectAssociation {
  MODULE = 'module',
  CLUB = 'club',
  EVENT = 'event'
}

// Defining project schema
const projectSchema = new Schema<ProjectInterface>(
  {
    // Coordinator of the project
    coordinator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project coordinator (creator) is required']
    },
    // Title of the project
    title: {
      type: String,
      required: [true, 'Project title is required']
    },
    // Description of the project
    description: {
      type: String
    },
    // Template used for the project
    template: {
      type: mongoose.Types.ObjectId,
      ref: 'Template'
    },
    // Ideation method employed for the project
    ideationMethod: {
      type: mongoose.Types.ObjectId,
      ref: 'IdeationMethod',
      required: [true, 'Ideation method is required']
    },
    // Date of project creation
    creationDate: {
      type: Schema.Types.Date,
      default: () => new Date()
    },
    // Status of the project
    status: {
      type: String,
      required: [true, 'Project status is required'],
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.InProgress
    },
    // Visibility of the project
    visibility: {
      type: String,
      required: [true, 'Project visibility is required'],
      enum: Object.values(ProjectVisibility),
      default: ProjectVisibility.PRIVATE
    },
    // Number of collaborators in the project
    collaboratorsCount: {
      type: Number,
      default: 0
    },
    // List of collaborators with their join dates
    collaborators: [
      {
        member: {
          type: mongoose.Types.ObjectId,
          ref: 'User'
        },
        joinedAt: Date
      }
    ],
    // List of ideas associated with the project
    ideas: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Idea'
      }
    ],
    // Main topic of the project
    mainTopic: {
      type: mongoose.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Main topic is required']
    },
    // Sub-topics of the project
    subTopics: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Topic'
      }
    ],
    // Clubs associated with the project
    clubs: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Club'
      }
    ],
    // Modules associated with the project
    modules: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Module'
      }
    ],
    // Events associated with the project
    events: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Event'
      }
    ],
    // URL of the project thumbnail
    thumbnailUrl: String,
    // Timer setting for the project
    timer: Number
  },
  { versionKey: 'version' }
)

// Pre-save hook to validate associations
projectSchema.pre('save', function (next) {
  if (
    this.clubs.length === 0 &&
    this.modules.length == 0 &&
    this.events.length == 0
  ) {
    const error = new Error(
      'At least one of module, club or event must be provided'
    )
    return next(error)
  }
  next()
})

// Pre-save hook to validate project visibility
projectSchema.pre('save', function (next) {
  if (!Object.values(ProjectVisibility).includes(this.visibility)) {
    const error = new Error(
      `Project visibility must be either one of these values : ${
        (ProjectVisibility.PRIVATE, ProjectVisibility.PUBLIC)
      }`
    )
    return next(error)
  }
  next()
})

// Creating Project model
const Project = mongoose.model<ProjectInterface>('Project', projectSchema)

// Exporting Project model, ProjectStatus, ProjectVisibility, and projectAssociation enums
export { Project, ProjectStatus, ProjectVisibility, projectAssociation }
