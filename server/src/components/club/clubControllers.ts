import { Request, Response } from 'express' // Importing Request and Response types from express
import { Club } from './clubModel' // Importing Club model

const getClubs = async (req: Request, res: Response) => {
  try {
    const clubs = await Club.find({}) // Finding all clubs
    return res.status(200).json(clubs) // Sending clubs as JSON response
  } catch (error) {
    console.log(error) // Logging any errors
    return res.sendStatus(500) // Sending a 500 status code for internal server error
  }
}

export { getClubs } // Exporting the getClubs function
