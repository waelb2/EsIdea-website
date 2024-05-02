import mongoose, { Schema } from 'mongoose'
import { TopicInterface } from './topicInterface'
import { ProjectInterface } from './projectInterface'

enum ProjectStatus {
  InProgress = 'in_progress',
  Completed = 'completed'
}

enum ProjectVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

enum projectAssociation {
  MODULE = 'module',
  CLUB = 'club',
  EVENT = 'event'
}

// project schema
const projectSchema = new Schema<ProjectInterface>({
  coordinator: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project coordinator (creator) is required']
  },
  title: {
    type: String,
    required: [true, 'Project title is required']
  },
  description: {
    type: String
  },
  template: {
    type: mongoose.Types.ObjectId,
    ref: 'Template'
  },
  ideationMethod: {
    type: mongoose.Types.ObjectId,
    ref: 'IdeationMethod',
    required: [true, 'Ideation method is required']
  },
  status: {
    type: String,
    required: [true, 'Project status is required'],
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.InProgress
  },
  visibility: {
    type: String,
    required: [true, 'Project visibility is required'],
    enum: Object.values(ProjectVisibility),
    default: ProjectVisibility.PRIVATE
  },
  collaboratorsCount: {
    type: Number,
    default: 0
  },
  collaborators: [
    {
      member: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      },
      joinedAt: Date
    }
  ],
  ideas: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Idea'
    }
  ],
  mainTopic: {
    type: mongoose.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Main topic is required']
  },
  subTopics: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Topic'
    }
  ],
  clubs: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Club'
    }
  ],
  modules: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Module'
    }
  ],
  events: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Event'
    }
  ],
  thumbnailUrl: String,
  creationDate: {
    type: Date,
    default: Date.now()
  }
})

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
const Project = mongoose.model<ProjectInterface>('Project', projectSchema)

export { Project, ProjectStatus, ProjectVisibility, projectAssociation }
