import { Document } from "mongoose"
import { ProjectInterface } from "../project/projectInterface"

/**
 * Interface representing a request for a public project.
 */
export interface publicProjectRequestInterface extends Document {
    /** The ID of the project being requested. */
    projectId: ProjectInterface
}