import mongoose , {Schema, Document, mongo} from "mongoose";
import { UserInterface } from "./userInterface";



enum UserRole{
    ADMIN = "admin",
    USER = "user"
}

const userSchema = new Schema<UserInterface>({
    firstName : {
        type:String , 
        required:[true, "First name is required"]
    },
    lastName : {
        type:String , 
        required:[true, "Last name is required"]
    },
    email:{
        type : String ,
        required:[true, "Email is required"],
    },
    password :{
        type : String,
    }, 
    profilePicUrl: {
        type : String,
    },
    role:{
        type:String,
        enum : Object.values(UserRole) ,
        default : UserRole.USER
    },
    joinDate :{
        type :Date ,
        required : [true , "User joining date is required"]
    },
    projects :[ {
        project  : {
            type : mongoose.Types.ObjectId,
            ref : 'Project',
        },
        joinedAt : Date,
    }],
    projectInvitations : [{
        type : mongoose.Types.ObjectId,
        ref : 'Invitation'
    }],
    //notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    ban: {
        isBan: {
            type : Schema.Types.Boolean,
            default : false
        },
        banEnd: Date
    },
})


const User = mongoose.model<UserInterface>('User', userSchema);


export {User,UserRole}