import { Document } from "mongoose";


export interface IdeationMethodInterface {
    methodName : string, 
    description:string,
}

export const IdeationMethodNames: readonly string[] = [ "brainstorming", "brainwriting" ];