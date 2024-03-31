import { Document } from "mongoose";


export interface ModuleInterface extends Document {
    moduleName : string, 
    description  : {
        Title : string,
        field : string,
        credit : number, 
        coef : number,
        edition: string ,
        courseHours : number,
        tdHours : number,
        tpHours : number | undefined 
    }
}

