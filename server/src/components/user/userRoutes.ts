import { profile } from "console"
import express, {Request , Response} from "express"
import { body, checkSchema, validationResult } from "express-validator"
import mongoose, { isObjectIdOrHexString } from "mongoose"
import { User, userIdValidationSchema } from "./userModels"
import { modifyProfilePicture, upload } from "./userControllers"

const router =  express.Router()


router.get("/users",(req: Request, res:Response)=> {}
)

router.patch("/settings/profile/password",
  // Use bahaa's auth forget password handler
)

router.patch("/settings/profile/picture", upload.single('profilePicture'), checkSchema(userIdValidationSchema),
  (req: Request, res: Response) => modifyProfilePicture(req, res, req.file)
)



export default router 