import { Request, Response } from 'express'
import { Project, ProjectVisibility, ProjectStatus } from './projectModels'
import { User } from '../user/userModels'
import { UserInterface } from '../user/userInterface'
import { TemplateInterface } from '../template/templateInterface'
import Template from '../template/templateModel'
import { IdeationMethodInterface } from '../idea/ideationMethodInterface'
import { IdeationMethod } from '../idea/ideationMethodModel'
import { TopicInterface } from './topicInterface'
import { Topic } from './topicModel'
import { Club } from '../club/clubModel'
import { Module } from '../module/moduleModel'
import { Event } from '../event/eventModel'
import { error } from 'console'
import { ClubInterface } from '../club/clubInterface'
import { ModuleInterface } from '../module/moduleInterface'
import { EventInterface } from '../event/eventInterface'
import { Invitation } from '../invitation/invitationModel'
import sendMail from '../../utils/sendInvitationEmail'
import sendInvitationEMail from '../../utils/sendInvitationEmail'
import cloudinary from '../../config/cloudConfig'
import fs from 'fs'

const createProject = async (req: Request, res: Response) => {
  //const {userId} = req.user
  const userId = '65ef22333d0a83e5abef43e3'
  let secureURL: string = ''

  try {
    if (req.file) {
      const cloudImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'projectThumbnails'
      })
      secureURL = cloudImage.secure_url
      fs.unlinkSync(req.file.path)
    }
    let projectAssociation: string

    const {
      projectTitle,
      description,
      templateId,
      ideationMethodId,
      visibility,
      collaborators,
      mainTopic,
      subTopics,
      association,
      associationId
    }: {
      projectTitle: string
      description: string
      templateId: string
      ideationMethodId: string
      visibility: string
      collaborators: [string] // needs an email validation
      mainTopic: string
      subTopics: [string]
      association: string
      associationId: string
    } = req.body

    // Getting and validating project metadata

    const coordinator: UserInterface | null = await User.findById(userId)

    if (!coordinator) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    const template: TemplateInterface | null = await Template.findById(
      templateId
    )

    if (!template) {
      return res.status(404).json({
        error: 'Template not found'
      })
    }
    const ideationMethod: IdeationMethodInterface | null =
      await IdeationMethod.findById(ideationMethodId)

    if (!ideationMethod) {
      return res.status(404).json({
        error: 'Ideation method not found'
      })
    }
    const parentTopic = await Topic.create({
      topicName: mainTopic,
      parentTopic: null
    })

    let subTopicsIds: string[] = []

    for (const topic of subTopics) {
      const subTopic = await Topic.create({
        topicName: topic,
        parentTopic: parentTopic.id
      })
      subTopicsIds.push(subTopic.id)
    }

    let associationData: ClubInterface | ModuleInterface | EventInterface | null
    projectAssociation = association.toLowerCase()

    switch (projectAssociation) {
      case 'club':
        associationData = await Club.findById(associationId)
        if (!associationData) {
          return res.status(404).json({
            error: 'Club not found '
          })
        }
        break
      case 'module':
        associationData = await Module.findById(associationId)
        if (!associationData) {
          return res.status(404).json({
            error: 'Module not found '
          })
        }
        break
      case 'event':
        associationData = await Event.findById(associationId)
        if (!associationData) {
          return res.status(404).json({
            error: 'Event not found '
          })
        }
        break
      default:
        return res.status(400).json({
          error: 'Invalid association type'
        })
    }

    // creating the project document
    const project = await Project.create({
      title: projectTitle,
      description: description,
      coordinator: coordinator.id,
      template: template.id,
      ideationMethod: ideationMethod.id,
      visibility,
      mainTopic: parentTopic.id,
      subTopics: subTopicsIds,
      club: projectAssociation === 'club' ? associationData.id : null,
      module: projectAssociation === 'module' ? associationData.id : null,
      event: projectAssociation === 'event' ? associationData.id : null,
      thumbnailUrl: secureURL
    })

    // creating and sending invitations

    const invitedUsers: UserInterface[] = await User.find({
      email: { $in: collaborators }
    })
    // creating invitations
    for (const collaborator of collaborators) {
      const user: UserInterface | undefined = invitedUsers.find(
        user => user.email === collaborator
      )

      const currentDate = new Date()
      const expirationDate = new Date(currentDate)
      expirationDate.setDate(expirationDate.getDate() + 3)

      const invitation = await Invitation.create({
        senderId: coordinator.id,
        receiverId: user ? user.id : null,
        receiverEmail: collaborator,
        projectId: project.id,
        invitationDate: currentDate,
        expiresAt: expirationDate
      })

      //sending the invitation email
      sendInvitationEMail(
        coordinator.lastName + ' ' + coordinator.firstName,
        user?.id,
        collaborator,
        project.id,
        project.title,
        invitation.id
      )
      return res.status(201).json({
        success: 'Project created successfully'
      })
    }
  } catch (err) {
    console.log('Error : ', err)
    res.status(500).json({
      error: 'Internal Server Error'
    })
  }
}

const updateProject = async (req: Request, res: Response) => {
  const userId = '65ef22333d0a83e5abef440e'
  const { projectId } = req.params

  try {
    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID must be provided'
      })
    }
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    if (project.coordinator.toString() !== userId) {
      return res.status(403).json({
        error: 'Unauthorized - Only project coordinator can update the project'
      })
    }

    const {
      title,
      description,
      status
    }: { title: string; description: string; status: ProjectStatus } = req.body
    project.title = title
    project.description = description
    project.status = status

    await project.save()
    res.status(200).json({ message: 'Project updated successfully' })
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
const deleteProject = async (req: Request, res: Response) => {
  const userId = '65ef22333d0a83e5abef440e'
  const { projectId } = req.params

  try {
    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID must be provided'
      })
    }

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }
    console.log(project.collaborators)
    res.status(200).json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
export { createProject, updateProject, deleteProject }
