import express from 'express'
import { LoginUser, verifyOTP } from '../controllers/users.js';

const userRoutes = express.Router()

userRoutes.post("/login", LoginUser)
userRoutes.post("/verify", verifyOTP)

export default userRoutes



