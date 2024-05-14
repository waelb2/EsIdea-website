// Importing Document interface from mongoose
import { Document } from "mongoose"

// Defining the interface for the Module document, extending the Document interface provided by mongoose
export interface ModuleInterface extends Document {
    moduleName: string // Name of the module
    description: { // Description of the module
        title: string // Title of the module description
        field: string // Field of study the module belongs to
        credit: number // Number of credits associated with the module
        coef: number // Coefficient of the module
        edition: string // Edition of the module
        courseHours: string // Total course hours of the module
        tdHours: string // Total tutorial hours of the module
        tpHours: String // Total practical hours of the module
    }
}