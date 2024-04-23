import { profile } from "console"
import express, {Request , Response} from "express"
import { body, validationResult } from "express-validator"
import mongoose, { isObjectIdOrHexString } from "mongoose"
import { User } from "./userModels"
import multer from "multer"
import cloudinary from "cloudinary"
const router =  express.Router()


router.get("/users",(req: Request, res:Response)=>{
})

router.patch("/user/settings/changepassword",
    [   body("id")
            .notEmpty().withMessage("Must provide the id of the user"),
        body("oldPassword")
            .notEmpty().withMessage("Must provide the old password of the user"),
        body("newPassword")
            .notEmpty().withMessage("Must provide the new password of the user")
    ],
    async (req: Request, res: Response) => {
        const errResult = validationResult(req);
        if(!errResult.isEmpty())
            return res.status(400).send({ errors: errResult.array() });
    
        const userId: string = req.body.id,
            oldPass: string = req.body.oldPassword,
            newPass: string = req.body.newPassword;
    
        if ( ! isObjectIdOrHexString(userId))
            return res.status(400).send({error: "Bad id: must be 24 character hex string"});
    
        const objectId = new mongoose.Types.ObjectId(userId);
        
        try {
            const user = await User.findById(objectId);
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            if ( user.password === oldPass ) {
                user.password = newPass;
                await user.save();
                console.log(user);
                return res.status(200).send({ msg: "Password updated successfully" });
            }
            return res.status(400).send({ error: "Wrong old password" });
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }  
    }
)

const upload = multer({ dest: 'uploads/' });

router.patch("/user/settings/changepdp",
    upload.single('profilePicture'),
    body("id")
        .notEmpty().withMessage("Must provide the id of the user")
    ,
    async (req: Request, res: Response) => {
        const errResult = validationResult(req);
        if(!errResult.isEmpty())
            return res.status(400).send({ errors: errResult.array() });
    
        const userId: string = req.body.id;

        if ( ! isObjectIdOrHexString(userId))
            return res.status(400).send({error: "Bad id: must be 24 character hex string"});
    
        const objectId = new mongoose.Types.ObjectId(userId);
        
        try {
            const user = await User.findById(objectId);
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }
            const image = req.file;
            const result = await cloudinary;
            // Obtain the image from client side ?? multer ??
            // Upload the image to the cloud using the api(check with wael)
            // Obtain the url of the image in the cloud :
            const ppUrl: string = ""; 
            user.profilePicUrl = ppUrl;
            await user.save();
            console.log(user);
            return res.status(200).send({ msg: "User profile picture updated successfully" });
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }  
    }
)

export default router 