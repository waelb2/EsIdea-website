import mongoose , {Schema, Document, mongo} from "mongoose";
import { IdeaInterface } from "./ideaInterface";


const ideaSchema = new Schema<IdeaInterface>({
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
    default: () => new Date()
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic', 
    required: true
  }
});


const Idea = mongoose.model<IdeaInterface>('Idea', ideaSchema)

export {Idea }