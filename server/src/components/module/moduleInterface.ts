import { Document } from "mongoose";


export interface ModuleInterface extends Document {
    moduleName : string, 
    description  : {
        title : string,
        field : string,
        credit : number, 
        coef : number,
        edition: string ,
        courseHours : string,
        tdHours : string,
        tpHours : String 
    }
}

