import mongoose , {Schema} from "mongoose";
import { EventInterface } from "./eventInterface";

const eventSchema = new Schema<EventInterface>({
    eventName : {
        type : String, 
        required : [true, "Event name is required"]
    },
    description : String 
})


export const Event = mongoose.model<EventInterface>('Event', eventSchema)