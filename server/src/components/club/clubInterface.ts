import { Document } from 'mongoose'

export interface ClubInterface extends Document {
  clubName: string // Name of the club
  description: {
    imageUrl: string // URL of the club's image
    creationDate: string // Date of club creation
    field: string // Field or category of the club
    numberOfEvents: number // Number of events associated with the club
    majorEvents: string[] // List of major events organized by the club
  }
}
