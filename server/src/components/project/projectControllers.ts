import { Request, Response } from "express";

const createProject = async (req: Request, res: Response)=>{
    res.send("Good job")
}




export {createProject}