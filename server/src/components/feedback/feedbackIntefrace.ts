import { Document } from "mongoose";
import { UserInterface } from "../user/userInterface";


export interface feedbackInterface extends Document {
    created_by : UserInterface, 
    title : string,
    description : string, 
    adminResponse : string 
}