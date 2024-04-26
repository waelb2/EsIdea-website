import { Request, Response } from 'express'
import { Club } from './clubModel'

const getClubs = async (req: Request, res: Response) => {
  try {
    const clubs = await Club.find({})
    return res.status(200).json({
      clubs
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export { getClubs }
