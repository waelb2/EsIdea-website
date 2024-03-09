import mongoose, {Schema} from "mongoose";
import { ClubInterface } from "./clubInterface";


const clubSchema = new Schema<ClubInterface>({
    clubName :{
        type : String, 
        required : [true, "Club name is required"]
    },
    description : {
        imageUrl : String,
        creationDate : String,
        field: String,
        eventsNumber : Number,
        bestEvent : String
    }
})

const Club = mongoose.model<ClubInterface>('Club', clubSchema)

export {Club}