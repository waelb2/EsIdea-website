import express, { Request, Response } from 'express'
import { Idea } from './ideaModels'
import { IdeaInterface } from './ideaInterface'
import { AuthPayload } from '../auth/authInterface'
import { User } from '../user/userModels'
import { Project } from '../project/projectModels'
import { Topic } from '../project/topicModel'
import { auth } from '../auth/authController'

export const getIdeasByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params
    if (!projectId) {
      return res.status(400).json({
        error: 'Project ID must be provided'
      })
    }
    const ideas: IdeaInterface[] = await Idea.find({
      projectId
    })
      .populate('topic')
      .populate('createdBy')

    const formattedIdeas = ideas.map(idea => {
      const formattedIdea = {
        ideaId : idea.id,
        content: idea.content,
        createdBy: {
          firstName: idea.createdBy.firstName,
          lastName: idea.createdBy.lastName,
          email: idea.createdBy.email,
          profilePicUrl: idea.createdBy.profilePicUrl
        },
        createdAt: idea.creationDate,
        votes: idea.votes,
        isBold: idea.isBold,
        isItalic: idea.isItalic
      }
      return formattedIdea
    })
    res.status(201).json(formattedIdeas)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}
export const postIdea = async (req: Request, res: Response) => {
  try {
   // const userId = '662d1119ace155f48b676a7d'
    const { userId } = req.user as AuthPayload
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        error: `User with id : ${userId} does not exist`
      })
    }

    const {
      projectId,
      topicId,
      content,
      isBold,
      isItalic,
      color,
      selected
    }: {
      projectId: string
      topicId: string
      content: string
      isBold: boolean
      isItalic: boolean
      color: string
      selected: boolean
    } = req.body
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        error: `Project with id : ${projectId} does not exist`
      })
    }

    ;(await project.populate('collaborators.member')).populate('coordinator')

    const collaboratorIds = project.collaborators.map(collaborator => {
      const objectId = collaborator.member._id
      return objectId.toString()
    })

    collaboratorIds.push(project.coordinator._id.toString())

    const foundUsers = collaboratorIds.filter(
      collaboratorId => collaboratorId === userId
    )
    if (foundUsers.length === 0) {
      return res.status(401).json({
        error: `User with ID ${userId} is unauthorized to collaborate on this project`
      })
    }
    const topic = await Topic.findById(topicId)

    if (!topic) {
      return res.status(404).json({
        error: `Topic with id : ${topicId} does not exist`
      })
    }

    const createdIdea = await Idea.create({
      projectId: project,
      createdBy: user,
      topic,
      content,
      creationDate: new Date(),
      isBold,
      isItalic,
      color,
    })
    ;(await createdIdea.populate('topic')).populate('createdBy')

    if (!createdIdea) {
      return res.status(500).json({
        error: 'Error posting the idea'
      })
    }

    project.ideas.push(createdIdea)
    project.save()

    const author = {
      firstName: user.firstName,
      email: user.email,
      profilePicUrl: user.profilePicUrl
    }
    const formattedIdea = {
      ideaId: createdIdea.id,
      createdBy: author,
      topic: createdIdea.topic.topicName,
      content: createdIdea.content,
      creationDate: createdIdea.creationDate
    }
    res.status(201).json(formattedIdea)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
}

export const deleteIdea = async (req: Request, res: Response) => {
  try {
    const { ideaId } = req.params
    if (!ideaId) {
      return res.status(400).json({
        error: 'Idea ID must be provided'
      })
    }

    const deletedIdea = await Idea.findOneAndDelete({
      _id: ideaId
    })

    if (!deletedIdea) {
      return res.status(404).json({
        error: 'Idea not found'
      })
    }
    const projectId = deletedIdea.projectId

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      })
    }
    const projectIdeas = project.ideas
    const newIdeasList = projectIdeas.filter(idea => idea._id !== ideaId)
    project.ideas = newIdeasList
    project.save()
    return res.status(200).json({
      msg: 'Idea deleted successfully'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'Internal server error '
    })
  }
}
