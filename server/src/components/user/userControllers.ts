import { Request, Response} from "express"
import { validationResult } from "express-validator"
import mongoose, { isObjectIdOrHexString } from "mongoose"
import cloudinary from "../../config/cloudConfig"
import fs from "fs"
import multer from "multer"
import { feedback } from "../feedback/feedbackModel"
import { Project } from "../project/projectModels"
import { publicProjectRequest } from "../publicProjectRequest/publicProjectRequestModel"
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

const createPublicProjectRequest = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if(!errResult.isEmpty())
      return res.status(400).send({ errors: errResult.array() })

  const { projectId } = req.body
  
  if (!isObjectIdOrHexString(projectId)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const objectId = new mongoose.Types.ObjectId(projectId)

  try {
    const project = await Project.findById(objectId);
    if (!project) {
      return res.status(404).send({ error: "The project of the publication request is not found" });
    }
    const ppr = new publicProjectRequest({ projectId })
    await ppr.save()
    return res.status(201).send(ppr)
  } catch (error) {
    console.log(error)
    return res.sendStatus( 400)
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

const addFavouriteProject = async (req: Request, res: Response) => {
  const errResult = validationResult(req)
  if(!errResult.isEmpty())
      return res.status(400).send({ errors: errResult.array() })

  const { userId, projectId } = req.body
  
  if (!isObjectIdOrHexString(userId) || !isObjectIdOrHexString(projectId)) {
    return res
      .status(400)
      .send({ error: 'Bad id must be 24 character hex string' })
  }
  const userObjectId = new mongoose.Types.ObjectId(userId)
  const projectObjectId = new mongoose.Types.ObjectId(projectId)

  try {
      const user = await User.findById(userObjectId)
      if (!user) {
        return res.status(404).send({ error: 'User not found' })
      }
      for(const projectObj of user.projects) {
        console.log("got in !!!\n") 
        if (projectObjectId.equals(new mongoose.Types.ObjectId(projectObj.project.toString()))) {
          user.projects[user.projects.indexOf(projectObj)].isFav = true
          await user.save()
          return res.status(200).send({ msg: 'Project added to favourites' })
        }
      }
      return res.status(400).send({ error: 'The user is not a member of the given project' })
  } catch (error) {
      console.log(error)
      return res.sendStatus(400)
  }
}

export {
  upload,
  modifyProfilePicture,
  createFeedback,
  createPublicProjectRequest,
  getUser,
  addFavouriteProject
}