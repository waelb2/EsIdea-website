import { profile } from "console"
import express, {Request , Response} from "express"
import { User } from "./userModels"
const router =  express.Router()


router.get("/users", async (req: Request, res:Response)=>{
    try {
        const users = await User.find({});
        return res.status(200).send(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
})


export default router 