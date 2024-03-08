import mongoose , {Document, Schema, mongo} from "mongoose";
import { UserDocument } from "../user/userModels";



enum ProjectStatus {
  Draft = 'draft',
  InProgress = 'in_progress',
  Completed = 'completed',
  OnHold = 'on_hold',
  Cancelled = 'cancelled',
  UnderReview = 'under_review',
  Approved = 'approved',
  Rejected = 'rejected',
}

enum ProjectVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

interface ProjectDocument extends Document {
    coordinator : UserDocument,
    title : string ,
    description? : string,
    //template : TemplateDocument
    //ideationMethod : ideaMethodDocument ,
    creationDate : Date,
    deadline? : Date,
    status: ProjectStatus,
    visibility : ProjectVisibility,
    collaboratorsCount : number,
    //club
   // module
    //event
}

const projectSchema = new Schema   ({
    coodinator : {
        type:mongoose.Types.ObjectId ,
        ref : 'User' ,
        required :[true , "Project coordinator (creator) is required"]
    },
    title : {
        type : String , 
        required: [true, "Project title is required"]
    },
    description :{
        type : String ,
    },
    template : {
        type : mongoose.Types.ObjectId,
        ref:'Template' ,
        required :[true, "Project template is required"]
    },
    status :{
        type : String,
        required : [true, "Project status is required"],
        enum : Object.values(ProjectStatus), 
        default:ProjectStatus.Draft,
    },
    visibility : {
        type : String ,
        required:[true, "Project visibility is required"],
        enum : Object.values(ProjectVisibility),
        default: ProjectVisibility.PRIVATE,
    },
    collaboratorsCount : {
        type : Number, 
    },
    collaborators :[ {
        type : mongoose.Types.ObjectId,
        ref : 'User',

    }],
    //idea
    //topic 
    //club, event. ..
   thumbnailUrl : String
   })


   const Project = mongoose.model<ProjectDocument>('Project', projectSchema)

   export {Project, ProjectStatus, ProjectVisibility}