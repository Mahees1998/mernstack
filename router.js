import express from "express";
import { registerUser, verifyUser,loginUser } from "./controller.js";

const router=express.Router();

router.post('/users/register',registerUser)
router.post('/users/verify', verifyUser)
router.post('/users/login',loginUser)
export default router