import { Request, Response } from 'express'
import { Event } from './eventModel'

const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({})
    return res.status(200).json({
      events
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
}

export { getEvents }
