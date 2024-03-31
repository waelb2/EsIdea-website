import { UserInterface } from "../user/userInterface"
import { ProjectInterface } from "../project/projectInterface"
import { TopicInterface } from "../project/topicInterface"

export   interface IdeaInterface extends Document {
    idea_id: string,
    created_by:UserInterface, 
    project_id :ProjectInterface, 
    content: string,
    creation_date: Date,
    topic: TopicInterface
}


