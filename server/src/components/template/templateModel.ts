import mongoose, { Schema } from 'mongoose'
import { TemplateInterface } from './templateInterface'

const templateSchema = new Schema<TemplateInterface>({
  templateName: {
    type: String,
    required: [true, 'Template name is required']
  },
  templateDescription: String
})

const Template = mongoose.model<TemplateInterface>('Template', templateSchema)

export default Template
