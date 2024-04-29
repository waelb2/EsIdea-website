import express, { Router } from "express";

import { login_get, login_post,auth ,authenticate, authenticateCallback,failure, logout,addPassword,updatePassword,forgetPassword,resetPassword} from "./authController";
import { authorize, verifyToken } from "./authMiddleware";
import { UserRole } from "../user/userModels";

const router: Router = express.Router();


//////////////////////////////// oauth /////////////////////////////////

router.get('/google', authenticate);
router.get('/logout', logout);
 router.get('/failure', failure);
router.get('/google/callback', authenticateCallback, 
// (req, res) => {
    // res.redirect('/dashboard');
// }
);

//////////////////////////////// oauth /////////////////////////////////


// localhost:3000/auth/google 


//////////////////////////////// login ///////////////////////////////

router.get("/",auth);
router.get('/login',verifyToken,authorize([UserRole.ADMIN]),login_get);
router.post('/login',login_post);
router.post('/addPassword',addPassword); 
router.post('/updatePassword',updatePassword);
router.patch('/resetPassword/:token',resetPassword);
router.post('/forgetPassword',forgetPassword);

//////////////////////////////// login ///////////////////////////////

/////////////////////////////////////////////////////////////////

export = router;