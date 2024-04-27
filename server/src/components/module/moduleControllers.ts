import { Request, Response } from 'express'
import { Module } from './moduleModel'

const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find({})

    const formattedModules = modules.map(module => {
      return {
        moduleName: module.moduleName,
        _id: module._id
      }
    })
    return res.status(200).json(formattedModules)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export { getModules }
