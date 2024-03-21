import express, { Router } from "express";

import { login_get, login_post,auth ,authenticate, authenticateCallback, logout,addPassword,updatePassword} from "./authController";

const router: Router = express.Router();


//////////////////////////////// oauth /////////////////////////////////

router.get('/google', authenticate);
router.get('/logout', logout);
router.get('/google/callback', authenticateCallback, (req, res) => {
    res.redirect('/dashboard/profile');
});

//////////////////////////////// oauth /////////////////////////////////

//////////////////////////////// login ///////////////////////////////

router.get("/",auth);
router.get('/login',login_get);
router.post('/login',login_post);
router.post('/addPassword',addPassword);
router.post('/updatePassword',updatePassword);

//////////////////////////////// login ///////////////////////////////

/////////////////////////////////////////////////////////////////

export = router;
