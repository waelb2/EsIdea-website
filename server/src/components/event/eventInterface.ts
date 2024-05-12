import { Document } from "mongoose";


export interface EventInterface extends Document {
    eventName : string, 
    description : string 
}