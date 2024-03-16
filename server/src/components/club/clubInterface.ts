import { Document } from "mongoose";


export interface ClubInterface extends Document {
    clubName : string, 
    description : {
        imageUrl : string , 
        creationDate : string, 
        field : string,
        numberOfEvents : number, 
        majorEvents: [string],
    }
}
