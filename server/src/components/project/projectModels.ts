import mongoose , { Schema, mongo, } from "mongoose";
import { TopicInterface } from "./topicInterface";
import { ProjectInterface } from "./projectInterface";



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


// Topic schema 

const topicSchema = new Schema <TopicInterface>({
    topicName : {
        type : String , 
        required : [true, "Topic name is required"]
    },
    parentTopic : {type : mongoose.Types.ObjectId,
    ref: 'Topic'}, 

})

// project schema 
const projectSchema = new Schema<ProjectInterface>({
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
    ideationMethod : {
        type : mongoose.Types.ObjectId,
        ref:'IdeationMethod',
        required : [true, "Ideation method is required"]
    }
    ,
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
    mainTopic : {
        type : mongoose.Types.ObjectId , 
        ref : 'Topic', 
        required : [true, "Main topic is required"]
    },
    subTopics : [{
        type : mongoose.Types.ObjectId,
        ref : 'Topic',
    }],
    //club, event. ..
   thumbnailUrl : String
   })


   const Topic  = mongoose.model<TopicInterface>('Topic', topicSchema);
   const Project = mongoose.model<ProjectInterface>('Project', projectSchema)
   
   export {Project,Topic , ProjectStatus, ProjectVisibility}