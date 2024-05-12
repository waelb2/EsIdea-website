import { Document } from "mongoose";


export interface TemplateInterface extends Document {
    templateName : string, 
    templateDescription: string,
}


