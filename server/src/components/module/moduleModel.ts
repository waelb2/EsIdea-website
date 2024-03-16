import mongoose , {Schema, mongo} from "mongoose";
import { ModuleInterface } from "./moduleInterface";


const moduleSchema = new Schema<ModuleInterface>({
    moduleName :{
        type : String, 
        required : [true, "Module name is required"]
    }, 
    description  : {
        title : String,
        field : String,
        credit : Number, 
        coef : Number,
        edition: String ,
        courseHours : String,
        tdHours : String,
        tpHours : String 
    }
})


export const Module = mongoose.model<ModuleInterface>('Module', moduleSchema)
