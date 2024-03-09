import { Document } from "mongoose";

export interface UserInterface extends Document {
    firstName :string, 
    lastName : string ,
    email : string,
    password? : string, 
    profilePicUrl?: string,
    role : string,
    joinDate : Date,
   // notifications
   //projects 
   //invitations 
}
