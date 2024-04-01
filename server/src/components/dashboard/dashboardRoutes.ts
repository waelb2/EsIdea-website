import express, { Router } from "express";
import { dashboard } from "./dashboardControllers";
import {isLoggedIn,requireAuth} from "../auth/authMiddleware"; 

const router: Router = express.Router();

router.get('/',isLoggedIn,dashboard);

export = router;
