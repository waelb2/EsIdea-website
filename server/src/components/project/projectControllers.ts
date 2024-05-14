// Importing necessary modules and types
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
import mongoose from 'mongoose'
import { Idea } from '../idea/ideaModels'

// Controller function to create a project
const createProject = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
  let secureURL: string = ''

  try {
    // Handling file upload (thumbnail)
    if (req.file) {
      const cloudImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'projectThumbnails'
      })
      secureURL = cloudImage.secure_url
      fs.unlinkSync(req.file.path)
    }

    // Destructuring request body
    const {
      projectTitle,
      description,
      ideationMethodName,
      collaborators,
      mainTopic,
      subTopics,
      tags,
      timer
    }: {
      projectTitle: string
      description: string
      ideationMethodName: string
      collaborators: string[] // needs an email validation
      mainTopic: string
      subTopics: string[]
      tags: string[]
      timer: number
    } = req.body

    // Getting and validating project metadata

    // Finding the coordinator (user who is creating the project)
    const coordinator: UserInterface | null = await User.findById(userId)

    if (!coordinator) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Finding the ideation method for the project
    const ideationMethod: IdeationMethodInterface | null =
      await IdeationMethod.findOne({
        methodName: { $regex: ideationMethodName, $options: 'i' }
      })

    if (!ideationMethod) {
      return res.status(404).json({
        error: 'Ideation method not found'
      })
    }

    // Creating main topic for the project
    const parentTopic = await Topic.create({
      topicName: mainTopic,
      parentTopic: null
    })

    let subTopicsIds: string[] = []
    // Creating sub topics for the project
    if (subTopics) {
      for (const topic of subTopics) {
        const subTopic = await Topic.create({
          topicName: topic,
          parentTopic: parentTopic.id
        })
        subTopicsIds.push(subTopic.id)
      }
    }

    let clubList: ClubInterface[] = []
    let moduleList: ModuleInterface[] = []
    let eventList: EventInterface[] = []

    // Processing tags (clubs, modules, events)
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

    // Checking if at least one club, module or event is provided
    if (
      clubList.length == 0 &&
      moduleList.length == 0 &&
      eventList.length == 0
    ) {
      return res.status(400).json({
        error: 'Either one club, module or event must be provided'
      })
    }

    // Creating the project document
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
      thumbnailUrl: secureURL,
      timer
    })

    // Normalizing collaborators' emails
    const normalized_collaborators = collaborators.map(email =>
      email.toLowerCase().trim()
    )

    // Finding invited users
    const invitedUsers: UserInterface[] = await User.find({
      email: { $in: normalized_collaborators }
    })

    // Creating invitations and sending emails
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

      // Associating project with the coordinator
      coordinator.projects.push({
        project,
        joinedAt: new Date(),
        isTrashed: false,
        isFav: false
      })
      await coordinator.save()

      user?.projectInvitations.push(invitation)
      user?.save()

      // Sending the invitation email
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

// Controller function to update a project
const updateProject = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload

  const { projectId } = req.params
  let secureURL: string = ''

  try {
    // Handling file upload (thumbnail)
    if (req.file) {
      const cloudImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'projectThumbnails'
      })
      secureURL = cloudImage.secure_url
      fs.unlinkSync(req.file.path)
    }
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

    const { title, description }: { title: string; description: string } =
      req.body

    if (title) project.title = title
    if (description) project.description = description
    if (secureURL) project.thumbnailUrl = secureURL

    await project.save()
    res.status(200).json({ message: 'Project updated successfully' })
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Controller function to update project status
const updateProjectStatus = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload

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

    const { newStatus }: { newStatus: string } =
      req.body

    if(newStatus){
      project.status = newStatus as ProjectStatus
    }
    await project.save()
    res.status(200).json({ message: 'Project status updated successfully' })
  } catch (error) {
    console.error('Error updating project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Controller function to delete a project
const deleteProject = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
  const { projectId } = req.params

  try {
    // Validating project ID
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

    // Finding the collaborator
    const collaborator = await User.findById(userId)

    if (!collaborator) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Finding the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    // Checking if the user is a collaborator in this project
    const collaborators = project.collaborators.filter(
      collaborator => collaborator.member._id.toString() === userId
    )
    if (collaborators.length < 0) {
      return res.status(400).json({
        error: 'This user is not a collaborator in this project'
      })
    }

    // Removing the collaborator from project collaborators list
    const updatedCollaborators = project.collaborators.filter(
      collaborator => collaborator.member._id.toString() !== userId
    )
    project.collaborators = updatedCollaborators
    project.save()

    // Removing the project from user projects list
    const updatedProjectsList = collaborator.projects.filter(
      collaboratorProject =>
        collaboratorProject.project._id.toString() !== projectId
    )
    collaborator.projects = updatedProjectsList
    collaborator.save()

    res.status(200).json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Controller function to trash a project
const trashProject = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
  const { projectId } = req.params

  try {
    // Validating project ID
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

    // Finding the collaborator
    const collaborator = await User.findById(userId)

    if (!collaborator) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Finding the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    // Checking if the user is a collaborator in this project
    const collaborators = project.collaborators.filter(
      collaborator => collaborator.member._id.toString() === userId
    )
    if (collaborators.length < 0) {
      return res.status(400).json({
        error: 'This user is not a collaborator in this project'
      })
    }

    // Updating the project's trashed status
    const projectIndex = collaborator.projects.findIndex(
      project => project.project.toString() === projectId
    )
    if (projectIndex === -1) {
      return res.status(404).json({
        error: "Project not found in the user's project list"
      })
    }
    collaborator.projects[projectIndex].isTrashed = true
    await collaborator.save()

    res.status(200).json({ message: 'Project trashed successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Controller function to restore a trashed project
const restoreProject = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
  const { projectId } = req.body

  try {
    // Validating project ID
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

    // Finding the collaborator
    const collaborator = await User.findById(userId)

    if (!collaborator) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Finding the project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }

    // Checking if the user is a collaborator in this project
    const collaborators = project.collaborators.filter(
      collaborator => collaborator.member._id.toString() === userId
    )
    if (collaborators.length < 0) {
      return res.status(400).json({
        error: 'This user is not a collaborator in this project'
      })
    }

    // Updating the project's trashed status
    const projectIndex = collaborator.projects.findIndex(
      project => project.project.toString() === projectId
    )
    if (projectIndex === -1) {
      return res.status(404).json({
        error: "Project not found in the user's project list"
      })
    }
    collaborator.projects[projectIndex].isTrashed = false
    await collaborator.save()

    res.status(200).json({ message: 'Project restored successfully' })
  } catch (error) {
    console.error('Error restoring project:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// Controller function to get projects by user ID
const getProjectByUserId = async (req: Request, res: Response) => {
  const { userId } = req.user as AuthPayload
  try {
    // Validating user ID
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
      .populate({
        path: 'projects.project',
        populate: {
          path: 'ideationMethod',
          model: 'IdeationMethod'
        }
      })
      .populate({
        path: 'projects.project',
        populate: {
          path: 'coordinator',
          model: 'User'
        }
      })

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      })
    }

    // Formatting project details
    const projects = user.projects.map(project => project)
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
      } = project.project
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
      const coordinator = {
        firstName: project.project.coordinator.firstName,
        lastName: project.project.coordinator.lastName,
        email: project.project.coordinator.email,
        profilePicUrl: project.project.coordinator.profilePicUrl
      }
      const formattedProject = {
        projectId: project.project.id,
        IdeationMethod: project.project.ideationMethod.methodName,
        ProjectTitle: title,
        Description: description,
        coordinator,
        Visibility: visibility,
        CollaboratorsCount: collaboratorsCount.toString(),
        collaborators: formattedCollaborators,
        MainTopic: mainTopic?.topicName || '',
        MainTopicId: mainTopic?.id,
        SubTopics: formattedSubTopics,
        Clubs: clubs.map(club => club.clubName),
        Modules: modules.map(module => module.moduleName),
        Events: events.map(event => event.eventName),
        ThumbnailUrl: thumbnailUrl,
        isTrashed: project.isTrashed,
        isFav: project.isFav,
        joinedDate: project.joinedAt,
        projectStatus: project.project.status,
        timer: project.project.timer,
        ProjectStatus : project.project.status
      }

      return formattedProject
    })

    res.status(200).json(projectStrings)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
const deleteProjectManyIdeas = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    const { ideaIds } = req.body
    if (!ideaIds || !Array.isArray(ideaIds)) {
      return res
        .status(400)
        .json({
          error: 'Invalid input. Idea IDs must be provided in an array.'
      })
    }

    // Fetch the project document
    const project = await Project.findById(projectId).populate('ideas')

    if (!project) {
      console.error('Project not found')
      return // Exit the function if project is not found
    }

    const filteredIdeas = project.ideas.filter(
      idea => !ideaIds.includes(idea.id)
    )
    const ideaObjectIds = ideaIds.map(id => new mongoose.Types.ObjectId(id))

    project.ideas = filteredIdeas

    await project.save()
    await Idea.deleteMany({ _id: { $in: ideaObjectIds } })

    res.status(200).json({ message: 'Ideas deleted successfully.' })
  } catch (error) {
    console.error('Error deleting ideas:', error)
    res.status(500).json({ error: 'An error occurred while deleting ideas.' })
  }
}

// Exporting controller functions
export {
  createProject,
  updateProject,
  deleteProject,
  getProjectByUserId,
  trashProject,
  restoreProject,
  deleteProjectManyIdeas,
  updateProjectStatus
}
