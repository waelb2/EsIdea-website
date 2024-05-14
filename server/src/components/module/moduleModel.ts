// Importing mongoose and necessary types
import mongoose, { Schema } from 'mongoose'
// Importing the ModuleInterface defined in moduleInterface.ts
import { ModuleInterface } from './moduleInterface'

// Defining the module schema using Mongoose's Schema class
const moduleSchema = new Schema<ModuleInterface>({
  // Defining moduleName field with type String and required constraint
  moduleName: {
    type: String,
    required: [true, 'Module name is required']
  },
  // Defining description field with sub-fields
  description: {
    title: String, // Title of the module description
    field: String, // Field of study the module belongs to
    credit: mongoose.Schema.Types.Number, // Number of credits associated with the module
    coef: mongoose.Schema.Types.Number, // Coefficient of the module
    edition: String, // Edition of the module
    courseHours: String, // Total course hours of the module
    tdHours: String, // Total tutorial hours of the module
    tpHours: String // Total practical hours of the module
  }
})

// Creating and exporting the Module model based on the defined schema
export const Module = mongoose.model<ModuleInterface>('Module', moduleSchema)
