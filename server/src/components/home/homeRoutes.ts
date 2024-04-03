import express, { Router } from "express";


const router: Router = express.Router();

router.get('/profile',(req,res)=>{
     res.send(req.query);
});

export = router;
