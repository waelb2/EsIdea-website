import express from "express"
import { createProject } from "./projectControllers";

const router = express.Router();


router.post('/create-project', createProject)


export default router ;