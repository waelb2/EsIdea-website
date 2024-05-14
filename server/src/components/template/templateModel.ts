import mongoose, { Schema } from 'mongoose'
import { TemplateInterface } from './templateInterface'

// Define the schema for the template
const templateSchema = new Schema<TemplateInterface>({
    /** The name of the template. */
    templateName: {
        type: String,
        required: [true, 'Template name is required']
    },
    /** The description of the template. */
    templateDescription: String
})

// Create the model from the schema
const Template = mongoose.model<TemplateInterface>('Template', templateSchema)

export default Template
