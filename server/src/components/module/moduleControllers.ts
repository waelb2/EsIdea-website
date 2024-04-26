import { Request, Response} from "express"
import { Module } from "./moduleModel"

const getMoudules = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find({})
    return res.status(200).send(modules)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export { getMoudules }