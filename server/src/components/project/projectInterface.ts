import { Document } from "mongoose";
import { IdeaInterface } from "../idea/ideaInterface"
import { UserInterface } from "../user/userInterface"
import { ProjectStatus , ProjectVisibility} from "./projectModels"
import { TemplateInterface } from "../template/templateInterface";
import { IdeationMethodInterface } from "../idea/ideationMethodInterface";
import { TopicInterface } from "./topicInterface";


export interface ProjectInterface extends Document {
    coordinator : UserInterface,
    title : string ,
    description? : string,
    template : TemplateInterface,
    ideationMethod : IdeationMethodInterface ,
    creationDate : Date,
    deadline? : Date,
    status: ProjectStatus,
    visibility : ProjectVisibility,
    collaboratorsCount : number,
    collaborators : [UserInterface],
    ideas : [IdeaInterface],
    mainTopic : TopicInterface,
    subTopics? : [TopicInterface],
    //club
   // module
    //event
    thumbnailUrl : string,
}
