import { Request, Response} from "express"
import { validationResult } from "express-validator"
import mongoose, { isObjectIdOrHexString } from "mongoose"
import cloudinary from "../../config/cloudConfig"
import fs from "fs"
import multer from "multer"
import { feedback } from "../feedback/feedbackModel"
import { User } from './userModels'

const upload = multer({ dest: 'uploads/' })

const modifyProfilePicture = async (req: Request, res: Response, image: Express.Multer.File | undefined) => {
  const errResult = validationResult(req)
  if(!errResult.isEmpty())
      return res.status(400).send({ errors: errResult.array() })
  if (!image)
      return res
        .status(400)
        .send({ error: 'Must provide the new profile picture' })
  
  const userId: string = req.body.id
  
  if ( ! isObjectIdOrHexString(userId))
      return res.status(400).send({ error: "Bad id: must be 24 character hex string" })
  
  const objectId = new mongoose.Types.ObjectId(userId)
  
  try {
      const user = await User.findById(objectId)
      if (!user) {
      return res.status(404).send({ error: "User not found" })
      }
      const result = await cloudinary.uploader.upload(image.path, { public_id: userId })   
      const secure_url = result.secure_url
      user.profilePicUrl = secure_url
      await user.save()
      fs.unlink(image.path,
        err => {
          if (err) {
            console.log(err)
          }
        }
      )
      return res.status(200).send({ msg: 'User profile picture updated successfully' })
  } catch (error) {
      console.log(error)
      return res.sendStatus(500)
  }  
}

const createFeedback = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if(!errResult.isEmpty())
      return res.status(400).send({ errors: errResult.array() })

  const { created_by, description, title } = req.body
  
  if (!isObjectIdOrHexString(created_by)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(created_by)

  const fdb = { created_by, title, description }

  try {
      const user = await User.findById(objectId)
      if (!user) {
        return res.status(404).send({ error: 'User not found' })
      }
      const fb = new feedback(fdb)
      await fb.save()
      return res.status(201).send(fb)
  } catch (error) {
      console.log(error)
      return res.sendStatus(400)
  }
}



const getUser = async (req:Request
    , res:Response)=>{
    if(!req.isAuthenticated()){
       return  res.status(401).json({
            error: 'unauthorized'
        })
    }
    try{
        console.log(req.user)
    }catch(err){
        console.log(err)
        res.status(500).json({
            error : "Internal Server Error"
        })
    }
}



export {
  upload,
  modifyProfilePicture,
  createFeedback,
  getUser
}

