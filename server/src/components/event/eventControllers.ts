import { Request, Response } from 'express'
import { Event } from './eventModel'

const getEvents = async (req: Request, res: Response) => {
  try {
    // Retrieve all events from the database
    const events = await Event.find({})
    // Return the events as JSON response
    return res.status(200).json(events)
  } catch (error) {
    // Log any errors and return a 500 status code
    console.log(error)
    return res.sendStatus(500)
  }
}

export { getEvents }
