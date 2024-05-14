import { Request, Response } from 'express'
import { User } from '../user/userModels'
import { Project, ProjectVisibility } from '../project/projectModels'
import { Statistics, banMsg } from './adminInterface'
import { nbVisits24h } from '../../utils/adminUtils'
import mongoose, { isObjectIdOrHexString } from 'mongoose'
import { validationResult } from 'express-validator'
import { ClubInterface } from '../club/clubInterface'
import { ModuleInterface } from '../module/moduleInterface'
import { EventInterface } from '../event/eventInterface'
import { Club } from '../club/clubModel'
import { Module } from '../module/moduleModel'
import { Event } from '../event/eventModel'
import { feedback } from '../feedback/feedbackModel'
import { publicProjectRequest } from '../publicProjectRequest/publicProjectRequestModel'
import { IdeationMethod } from '../idea/ideationMethodModel'
import fs from 'fs'

const getStats = async (req: Request, res: Response) => {
  // Initialize statistics object
  let stats: Statistics = {
    nbUsers: 0,
    nbProjects: [],
    nbVisits24h: 0,
    nbProjects24h: 0
  }

  try {
    // Number of users
    stats.nbUsers = await User.countDocuments()

    // Number of projects per method
    const methods = await IdeationMethod.find()
    for (const method of methods) {
      const nb = await Project.find({
        ideationMethod: method._id
      }).countDocuments()
      stats.nbProjects.push(nb)
    }

    // Number of website visits in the last 24 hours
    stats.nbVisits24h = await nbVisits24h()

    // Number of new projects in the last 24 hours
    const avant24h = new Date(Date.now() - 24 * 3600 * 1000)
    // Filtering the projects created in the last 24 hours
    const projects24h = await Project.find({ creationDate: { $gte: avant24h } })
    stats.nbProjects24h = projects24h.length

    // Send statistics in response
    return res.status(200).send(stats)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Internal server error
  }
}

const getUsers = async (req: Request, res: Response) => {
  try {
    // Find all users
    const users = await User.find({})
    // Send users in response
    return res.status(200).send(users)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Internal server error
  }
}

const deleteUser = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract user ID from request body
  const userId: string = req.body.id

  // Check if user ID is valid
  if (!isObjectIdOrHexString(userId)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(userId)

  try {
    // Find user by ID
    const user = await User.findById(objectId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    // Remove user from collaborators of all projects
    for (const projectObj of user.projects) {
      const project = await Project.findById(new mongoose.Types.ObjectId(projectObj.project._id.toString()))
      if (project) {
        const updatedCollaborators = project.collaborators.filter(
          collaborator => collaborator.member._id.toString() !== userId
        )
        project.collaborators = updatedCollaborators
        await project.save()
      } else {
        return res.status(404).send({ error: 'Project of the user not found' })
      }
    }

    // Delete user
    await User.deleteOne(objectId)
    return res.sendStatus(200) // Success response
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Internal server error
  }
}

const banUser = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract user ID and duration from request body
  const userId: string = req.body.id
  const duration: number = req.body.duration

  // Check if duration is valid
  if (duration <= 0)
    return res.status(400).send({
      error: 'Bad duration: must be positive different from 0 integer'
    })

  // Check if user ID is valid
  if (!isObjectIdOrHexString(userId))
    return res
      .status(400)
      .send({ error: 'Bad id: must be 24 character hex string' })

  const objectId = new mongoose.Types.ObjectId(userId)

  try {
    // Find user by ID
    const user = await User.findById(objectId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    // Calculate end date of ban
    const endDate: Date = new Date(Date.now() + duration * 24 * 3600 * 1000)
    user.ban.isBan = true
    user.ban.banEnd = endDate
    await user.save()

    return res.sendStatus(200) // Success response
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Internal server error
  }
}

const unbanUser = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract user ID from request body
  const userId: string = req.body.id

  // Check if user ID is valid
  if (!isObjectIdOrHexString(userId))
    return res
      .status(400)
      .send({ error: 'Bad id: must be 24 character hex string' })

  const objectId = new mongoose.Types.ObjectId(userId)

  try {
    // Find user by ID
    const user = await User.findById(objectId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    // Check if user is banned
    if (user.ban.isBan) {
      // Check if ban period has expired
      if (Date.now() >= user.ban.banEnd.getTime()) {
        user.ban.isBan = false
        await user.save()
        return res.sendStatus(200) // Success response
      }
      return res.status(403).send({ error: banMsg }) // Forbidden response
    }

    return res.status(400).send({ error: 'User is not banned' }) // Bad request response
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Internal server error
  }
}

const forceUnbanUser = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract user ID from request body
  const userId: string = req.body.id

  // Check if user ID is valid
  if (!isObjectIdOrHexString(userId))
    return res
      .status(400)
      .send({ error: 'Bad id: must be 24 character hex string' })

  const objectId = new mongoose.Types.ObjectId(userId)

  try {
    // Find user by ID
    const user = await User.findById(objectId)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    // Check if user is banned
    if (user.ban.isBan) {
      user.ban.isBan = false
      await user.save()
      return res.sendStatus(200) // Success response
    }

    return res.status(400).send({ error: 'User is not banned' }) // Bad request response
  } catch (error) {
    console.log(error)
    return res.sendStatus(500) // Internal server error
  }
}

const getTags = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract type from query parameters
  const type: string = req.query.type as string;
  let docs: (ClubInterface | ModuleInterface | EventInterface)[]

  try {
    // Retrieve documents based on type
    switch (type.toLowerCase()) {
      case 'club':
        docs = await Club.find({})
        break
      case 'module':
        docs = await Module.find({})
        break
      case 'event':
        docs = await Event.find({})
        break
      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }

    // Send retrieved documents
    return res.status(200).send(docs)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const createTag = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract type and tag details from request body
  const { type, ...tag } = req.body
  let savedDoc: ClubInterface | ModuleInterface | EventInterface

  try {
    // Create new document based on type
    switch (type.toLowerCase()) {
      case 'club':
        const newClub = new Club(tag)
        savedDoc = await newClub.save()
        break
      case 'module':
        const newModule = new Module(tag)
        savedDoc = await newModule.save()
        break
      case 'event':
        const newEvent = new Event(tag)
        savedDoc = await newEvent.save()
        break
      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }

    // Send success response
    return res.status(201).send({ msg: 'Created successfully', savedDoc })
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

const deleteTag = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract tag ID and type from request body
  const id: string = req.body.id,
    type: string = req.body.type

  // Check if ID is valid
  if (!isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(id)

  try {
    // Delete document based on type and ID
    switch (type.toLowerCase()) {
      // If type is 'club', delete the club document
      case 'club':
        // Find the club document by its ID
        const club = await Club.findById(objectId)
        // If club document not found, send error response
        if (!club) {
          return res.status(404).send({ error: 'Club not found' })
        }
        // Delete the club document
        await Club.deleteOne(objectId)
        break
      
      // If type is 'module', delete the module document
      case 'module':
        // Find the module document by its ID
        const module = await Module.findById(objectId)
        // If module document not found, send error response
        if (!module) {
          return res.status(404).send({ error: 'Module not found' })
        }
        // Delete the module document
        await Module.deleteOne(objectId)
        break
      
      // If type is 'event', delete the event document
      case 'event':
        // Find the event document by its ID
        const event = await Event.findById(objectId)
        // If event document not found, send error response
        if (!event) {
          return res.status(404).send({ error: 'Event not found' })
        }
        // Delete the event document
        await Event.deleteOne(objectId)
        break
      
      // If type is not recognized, send invalid tag type error response
      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }
    // Send success response
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const modifyTag = async (req: Request, res: Response) => {
  // Validate request body
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })
  const { id, type, tag } = req.body

  // Check if ID is valid
  if (!isObjectIdOrHexString(id)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = mongoose.Types.ObjectId.createFromHexString(id);
  try {
    // Modify document based on type
    switch (type.toLowerCase()) {
      case 'club':
        let club = await Club.findById(objectId)
        if (!club) {
          return res.status(404).send({ error: 'Club not found' })
        }
        if (tag.clubName) club.clubName = tag.clubName
        if (tag.description)
          club.description = { ...club.description, ...tag.description }
        await club.save()
        break

      case 'module':
        const module = await Module.findById(objectId)
        if (!module) {
          return res.status(404).send({ error: 'Module not found' })
        }
        if (tag.moduleName) module.moduleName = tag.moduleName
        if (tag.description)
          module.description = {...module.description,...tag.description }
        await module.save()
        break

      case 'event':
        let event = await Event.findById(objectId)
        if (!event) {
          return res.status(404).send({ error: 'Event not found' })
        }
        if (tag.eventName) event.eventName = tag.eventName
        if (tag.description) event.description = tag.description
        await event.save()
        break

      default:
        return res.status(400).send({ error: 'Invalid tag type' })
    }

    // Send success response
    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

const getFeedbacks = async (req: Request, res: Response) => {
  try {
    // Retrieve feedbacks
    const fbs = await feedback.find({})
    // Send success response
    return res.status(200).send(fbs)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const getPublicProjectRequests = async (req: Request, res: Response) => {
  try {
    // Retrieve public project requests with populated data
    const ppRequests = await publicProjectRequest.find({})
      .populate({
        path: 'projectId',
        populate: {
          path: 'coordinator',
          model: 'User'
        }
      })
    // Send success response
    return res.status(200).send(ppRequests)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

const approvePublicProjectRequest = async (req: Request, res: Response) => {
  // Validate request body parameters
  const errResult = validationResult(req)
  if (!errResult.isEmpty())
    return res.status(400).send({ errors: errResult.array() })

  // Extract project publication request ID from request body
  const pprId: string = req.body.id

  // Validate project publication request ID
  if (!isObjectIdOrHexString(pprId))
    return res
      .status(400)
      .send({ error: 'Bad id: must be 24 character hex string' })

  // Convert project publication request ID to MongoDB ObjectId
  const pprObjectId = new mongoose.Types.ObjectId(pprId)

  try {
    // Find the project publication request by ID
    const ppr = await publicProjectRequest.findById(pprObjectId)
    if (!ppr) {
      return res
        .status(404)
        .send({ error: 'Project publication request not found' })
    }
    // Find the project associated with the publication request
    const project = await Project.findById(ppr.projectId)
    if (!project) {
      return res
        .status(404)
        .send({ error: 'The project of the publication request not found' })
    }
    // Approve the public visibility of the project
    project.visibility = ProjectVisibility.PUBLIC
    await project.save()
    // Delete the approved project publication request
    await publicProjectRequest.deleteOne(pprObjectId)
    // Send success response
    return res.status(200).send({ msg: "The public project request has been approved" })
  } catch (error) {
    // Handle errors and send error response
    console.log(error)
    return res.sendStatus(500)
  }
}

const getLogs = (req: Request, res: Response) => {
  // Read the content of the access log file
  fs.readFile("./access.log", 'utf8', (error, data) => {
    if (error) {
      // If error occurs during file reading, send error response
      console.log(error)
      return res.status(500).send({ error: 'Error in reading logs file' })
    }
    // Split the data into individual lines
    const lines: string[] = data.split('\n')
    
    // Initialize an array to store parsed log entries
    const parsedLogs: {date: Date, requestType: string, route: string}[] = []

    // Iterate over each line of the log file
    lines.forEach((line) => {
        // Split the line to extract date, request type, and route
        if(line) {
          const [date, requestInfo] = line.split(' - ')
          const [requestType, route] = requestInfo.split(' ')

          // Create an object for the log entry
          const logEntry = {
              date: new Date(date.trim()),
              requestType: requestType.trim(),
              route: route.trim()
          }
          // Push the object to the array
          parsedLogs.push(logEntry)
        }
    })
    // Send the parsed log entries as response
    return res.status(200).send(parsedLogs)
  })
}

const deleteLogs = (req: Request, res: Response) => {
  // Overwrite the content of the access log file with an empty string
  fs.writeFile("./access.log", '', (error) => {
    if (error) {
        // If error occurs during file writing, send error response
        return res.status(500).send({ msg: 'Error deleting file content', error })
    }
    // Send success response after deleting file content
    return res.sendStatus(200)
  })
}

export {
  getStats,
  getUsers,
  deleteUser,
  banUser,
  unbanUser,
  forceUnbanUser,
  getTags,
  createTag,
  deleteTag,
  modifyTag,
  getFeedbacks,
  getPublicProjectRequests,
  approvePublicProjectRequest,
  getLogs,
  deleteLogs
}