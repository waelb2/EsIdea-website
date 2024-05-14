import mongoose, { Schema } from "mongoose"
import { publicProjectRequestInterface } from "./publicProjectRequestInterface"

// Define the schema for the public project request
const publicProjectRequestSchema = new Schema<publicProjectRequestInterface>({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', 
        required: true
    }
})

// Create the model from the schema
const publicProjectRequest = mongoose.model<publicProjectRequestInterface>('publicProjectRequest', publicProjectRequestSchema)

// Validation schema for creating a public project request
const createPublicProjectRequestValidationSchema = {
  projectId: {
    notEmpty: {
      errorMessage: "Must provide the id of the project"
    }
  }
}

// Export the model and validation schema
export { publicProjectRequest, createPublicProjectRequestValidationSchema }