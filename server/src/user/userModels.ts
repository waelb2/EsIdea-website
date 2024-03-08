import mongoose , {Schema, Document, mongo} from "mongoose";
import isEmail from "validator/es/lib/isEmail"

interface UserDocument extends Document {
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


enum UserRole{
    ADMIN = "admin",
    USER = "user"
}

const userSchema = new Schema<UserDocument>({
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
        validate : [isEmail,"Enter a valid email"]
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
    //notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
   // projects : [{ type: Schema.Types.ObjectId, ref: 'Project' }], 
    // invitations :    // projects : [{ type: Schema.Types.ObjectId, ref: 'Invitation' }], 

})


const User = mongoose.model<UserDocument>('User', userSchema);


export {User, UserDocument,UserRole}