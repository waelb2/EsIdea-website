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
import path from 'path'
import { model } from 'mongoose'
import { AuthPayload } from '../auth/authInterface'

const createProject = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
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
      ideationMethodName,
      collaborators,
      mainTopic,
      subTopics,
      tags
    }: {
      projectTitle: string
      description: string
      ideationMethodName: string
      collaborators: string[] // needs an email validation
      mainTopic: string
      subTopics: string[]
      tags: string[]
    } = req.body
    console.log('her')
    console.log('here')
    console.log(req.body)
    // Getting and validating project metadata

    const coordinator: UserInterface | null = await User.findById(userId)

    if (!coordinator) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    const ideationMethod: IdeationMethodInterface | null =
      await IdeationMethod.findOne({
        methodName: { $regex: ideationMethodName, $options: 'i' }
      })

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

    let clubList: ClubInterface[] = []
    let moduleList: ModuleInterface[] = []
    let eventList: EventInterface[] = []

    const formattedTags = tags.map(tag => JSON.parse(tag))
    for (const tag of formattedTags) {
      const tagId = tag.tagId
      const tagType = tag.tagType.toLowerCase()

      switch (tagType) {
        case 'club':
          const club: ClubInterface | null = await Club.findById(tagId)
          if (!club) {
            return res.status(404).json({
              error: `Club ${tagId} not found `
            })
          }
          clubList.push(club)

          break
        case 'module':
          const module: ModuleInterface | null = await Module.findById(tagId)
          if (!module) {
            return res.status(404).json({
              error: `Module ${tagId} not found `
            })
          }
          moduleList.push(module)
          break
        case 'event':
          const event: EventInterface | null = await Event.findById(tagId)
          if (!event) {
            return res.status(404).json({
              error: `Event ${tagId} not found `
            })
          }
          eventList.push(event)
          break
        default:
          return res.status(400).json({
            error: 'Invalid association type'
          })
      }
    }
    if (
      clubList.length == 0 &&
      moduleList.length == 0 &&
      eventList.length == 0
    ) {
      return res.status(400).json({
        error: 'Either one club, module or event must be provided'
      })
    }
    // creating the project document
    const project = await Project.create({
      title: projectTitle,
      description: description,
      coordinator: coordinator.id,
      ideationMethod: ideationMethod.id,
      mainTopic: parentTopic.id,
      subTopics: subTopicsIds,
      clubs: clubList,
      modules: moduleList,
      events: eventList,
      thumbnailUrl: secureURL
    })

    const normalized_collaborators = collaborators.map(email =>
      email.toLowerCase().trim()
    )

    // creating and sending invitations
    const invitedUsers: UserInterface[] = await User.find({
      email: { $in: normalized_collaborators }
    })
    // creating invitations
    for (const collaborator of normalized_collaborators) {
      const user: UserInterface | undefined = invitedUsers.find(
        user => user.email === collaborator
      )
      const currentDate = new Date()
      const expirationDate = new Date()
      expirationDate.setDate(currentDate.getDate() + 3)
      const invitation = await Invitation.create({
        senderId: coordinator.id,
        receiverId: user ? user.id : null,
        receiverEmail: collaborator,
        projectId: project.id,
        invitationDate: currentDate,
        expiresAt: expirationDate
      })

      // Associating project with his coordinator
      coordinator.projects.push({
        project,
        joinedAt: new Date(),
        isTrashed: false
      })
      await coordinator.save()

      user?.projectInvitations.push(invitation)
      user?.save()

      //sending the invitation email
      sendInvitationEMail(
        coordinator.lastName + ' ' + coordinator.firstName,
        user?.id,
        collaborator,
        project.id,
        project.title,
        invitation.id
      )
    }
    return res.status(201).json({
      success: 'Project created successfully'
    })
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
  const userId = '65ef22333d0a83e5abef43fd'
  const { projectId } = req.params

  try {
    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID must be provided'
      })
    }
    if (!userId) {
      return res.status(400).json({
        error: 'User ID must be provided'
      })
    }

    const collaborator = await User.findById(userId)

    if (!collaborator) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    const collaborators = project.collaborators.filter(
      collaborator => collaborator.member._id.toString() === userId
    )
    if (collaborators.length < 0) {
      return res.status(400).json({
        error: 'This user is not a collaborator in this project'
      })
    }
    const updatedCollaborators = project.collaborators.filter(
      collaborator => collaborator.member._id.toString() !== userId
    )

    // deleting the collaborator from project collaborators list
    project.collaborators = updatedCollaborators
    project.save()

    const updatedProjectsList = collaborator.projects.filter(
      collaboratorProject => console.log(collaboratorProject)
      //collaboratorProject.project._id.toString() !== projectId
    )

    // deleting the project from user projects list
    collaborator.projects = updatedProjectsList
    collaborator.save()

    res.status(200).json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
const getProjectByUserId = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
  try {
    if (!userId) {
      return res.status(400).json({
        error: 'User ID must be provided'
      })
    }
    const user: UserInterface | null = await User.findById(userId)
      .populate({
        path: 'projects.project',
        populate: {
          path: 'subTopics',
          model: 'Topic'
        }
      })
      .populate({
        path: 'projects.project',
        populate: {
          path: 'collaborators.member',
          model: 'User'
        }
      })
      .populate({
        path: 'projects.project',
        populate: {
          path: 'mainTopic',
          model: 'Topic'
        }
      })
      .populate({
        path: 'projects.project',
        populate: {
          path: 'clubs',
          model: 'Club'
        }
      })
      .populate({
        path: 'projects.project',
        populate: {
          path: 'events',
          model: 'Event'
        }
      })
      .populate({
        path: 'projects.project',
        populate: {
          path: 'modules',
          model: 'Module'
        }
      })

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    const projects = user.projects.map(project => project?.project)
    const projectStrings = projects.map(project => {
      const {
        title,
        description,
        visibility,
        collaboratorsCount,
        collaborators,
        mainTopic,
        subTopics,
        clubs,
        modules,
        events,
        thumbnailUrl
      } = project

      const formattedSubTopics = subTopics?.map(topic => {
        return {
          topicId: topic._id,
          topicName: topic.topicName
        }
      })
      const formattedCollaborators = collaborators?.map(collaborator => {
        if (collaborator.member) {
          const { firstName, lastName, email, profilePicUrl } =
            collaborator.member
          return {
            firstName,
            lastName,
            email,
            profilePicUrl
          }
        }

        return null
      })
      const formattedProject = {
        ProjectTitle: title,
        Description: description,
        Visibility: visibility,
        CollaboratorsCount: collaboratorsCount.toString(),
        collaborators: formattedCollaborators,
        MainTopic: mainTopic?.topicName || '',
        SubTopics: formattedSubTopics,
        Clubs: clubs.map(club => club.clubName),
        Modules: modules.map(module => module.moduleName),
        Events: events.map(event => event.eventName),
        ThumbnailUrl: thumbnailUrl
      }

      return formattedProject
    })

    res.status(200).json(projectStrings)
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
export { createProject, updateProject, deleteProject, getProjectByUserId }
