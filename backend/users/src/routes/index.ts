import express from 'express'
import { LoginUser, myProfile, verifyOTP } from '../controllers/users.js';
import { isAuth } from '../middleware/isAuth.js';

const userRoutes = express.Router()

userRoutes.post("/login", LoginUser);
userRoutes.post("/verify", verifyOTP);
userRoutes.get("/me", isAuth, myProfile);

export default userRoutes



