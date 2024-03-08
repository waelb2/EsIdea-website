import mongoose , {Document, Schema, mongo} from "mongoose";
import { UserDocument } from "../user/userModels";
import { IdeaDocument } from "../idea/ideaModels";



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
    template : TemplateDocument,
    //ideationMethod : ideaMethodDocument ,
    creationDate : Date,
    deadline? : Date,
    status: ProjectStatus,
    visibility : ProjectVisibility,
    collaboratorsCount : number,
    collaborators : [UserDocument],
    ideas : [IdeaDocument]
    //club
   // module
    //event
    thumbnailUrl : string,
}

interface TopicDocument extends Document {
    topicName : string,
    parentTopic? : TopicDocument,
}

// Topic schema 

const topicSchema = new Schema <TopicDocument>({
    topicName : {
        type : String , 
        required : [true, "Topic name is required"]
    },
    parentTopic : {type : mongoose.Types.ObjectId,
    ref: 'Topic'}, 

})

// project schema 
const projectSchema = new Schema<ProjectDocument>({
    coordinator : {
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
    ideas :[ {
        type : mongoose.Types.ObjectId,
        ref : 'Idea',
    }],
    //topic 
    //club, event. ..
   thumbnailUrl : String
   })


   const Topic  = mongoose.model<TopicDocument>('Topic', topicSchema);
   const Project = mongoose.model<ProjectDocument>('Project', projectSchema)
   
   export {Project,Topic ,TopicDocument,ProjectDocument, ProjectStatus, ProjectVisibility}