import { Document } from "mongoose"

export interface EventInterface extends Document {
    // Define the properties of the EventInterface
    eventName: string
    description: string
}