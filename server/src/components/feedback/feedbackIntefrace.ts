import { Document } from "mongoose";
import { UserInterface } from "../user/userInterface";


export interface feedbackInterface extends Document {
    created_by : {
        firstName: string,
        lastName: string,
        profilePicUrl?: string
    },
    title : string,
    description : string,
    creationDate: Date
}