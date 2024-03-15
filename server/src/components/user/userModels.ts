import mongoose , {Schema} from "mongoose";
import { UserInterface } from "./userInterface";
import validator from 'validator';


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
        unique: true,
        lowercase: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Invalid email format.',
        }
    },
    password :{
        type : String,
        minlength: [6, 'Password must be at least 6 characters long.'],
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
    }]
    //notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],

})


const User = mongoose.model<UserInterface>('User', userSchema);


export {User,UserRole}