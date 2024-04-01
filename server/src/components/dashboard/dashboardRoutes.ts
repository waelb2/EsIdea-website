import express, { Router } from "express";
import { profile, isLoggedIn } from "./dashboardControllers";

const router: Router = express.Router();

router.get('/profile',isLoggedIn,profile);

export = router;
