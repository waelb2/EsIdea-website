import mongoose , {Schema, Document, mongo} from "mongoose";
import { ProjectDocument, TopicDocument } from "../project/projectModels";
import { UserDocument } from "../user/userModels";

interface IdeaDocument extends Document {
    idea_id: string,
    created_by: UserDocument ,
    project_id :ProjectDocument, 
    content: string,
    creation_date: Date,
    topic: TopicDocument
}


const ideaSchema = new Schema<IdeaDocument>({
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', 
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic', 
    required: true
  }
});


const Idea = mongoose.model<IdeaDocument>('Idea', ideaSchema)

export {Idea, IdeaDocument}