import { Document } from "mongoose";


export interface ClubInterface extends Document {
    clubName : string, 
    description : {
        imageUrl : string , 
        creationDate : string, 
        field : string,
        eventsNumber : number, 
        bestEvent: string,
    }
}
