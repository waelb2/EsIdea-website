import mongoose, { Schema } from "mongoose"
import { EventInterface } from "./eventInterface"

// Define the schema for the Event model
const eventSchema = new Schema<EventInterface>({
    eventName: {
        type: String,
        required: [true, "Event name is required"]
    },
    description: String
})

// Create and export the Event model
export const Event = mongoose.model<EventInterface>('Event', eventSchema)