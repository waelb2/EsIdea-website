import mongoose , { Schema } from "mongoose";
import { publicProjectRequestInterface } from "./publicProjectRequestInterface";

const publicProjectRequestSchema = new Schema<publicProjectRequestInterface>({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', 
        required: true
    }
});


const publicProjectRequest = mongoose.model<publicProjectRequestInterface>('publicProjectRequest', publicProjectRequestSchema)

const createPublicProjectRequestValidationSchema = {
  projectId: {
    notEmpty: {
      errorMessage: "Must provide the id of the project"
    }
  }
}

export { publicProjectRequest, createPublicProjectRequestValidationSchema }