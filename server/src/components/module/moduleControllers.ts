// Importing necessary modules and types from express and moduleModel
import { Request, Response } from 'express'
import { Module } from './moduleModel'

// Controller function to handle GET request for fetching modules
const getModules = async (req: Request, res: Response) => {
  try {
    // Retrieving all modules from the database
    const modules = await Module.find({})

    // Formatting the retrieved modules before sending the response
    const formattedModules = modules.map(module => {
      return {
        moduleName: module.moduleName,
        _id: module._id
      }
    })

    // Sending a success response with the formatted modules
    return res.status(200).json(formattedModules)
  } catch (error) {
    // Handling errors and logging them
    console.log(error)
    // Sending a server error response if an error occurs
    return res.sendStatus(500)
  }
}

// Exporting the getModules function to make it available for other modules
export { getModules }
