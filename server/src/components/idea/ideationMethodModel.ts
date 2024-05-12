import mongoose, {Schema} from "mongoose";
import { IdeationMethodInterface } from "./ideationMethodInterface";


const ideationMethodSchema = new Schema<IdeationMethodInterface>({
    methodName : {
        type : String,
        required: [true, "Method name is required"]
    },
    description : String 

})

const IdeationMethod = mongoose.model<IdeationMethodInterface>('IdeationMethod', ideationMethodSchema)


export {IdeationMethod};