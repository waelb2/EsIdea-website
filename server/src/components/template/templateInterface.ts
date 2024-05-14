import { Document } from "mongoose";

/**
 * Interface representing a template document.
 */
export interface TemplateInterface extends Document {
    /** The name of the template. */
    templateName: string;
    /** The description of the template. */
    templateDescription: string;
}
