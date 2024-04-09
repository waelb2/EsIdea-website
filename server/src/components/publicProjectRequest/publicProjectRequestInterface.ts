import { Document } from "mongoose";
import { ProjectInterface } from "../project/projectInterface";

export interface publicProjectRequestInterface extends Document {
    projectId : ProjectInterface
}