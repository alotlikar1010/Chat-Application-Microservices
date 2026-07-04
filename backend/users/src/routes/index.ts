import express from 'express'
import { LoginUser } from '../controllers/users.js';

const userRoutes = express.Router()

userRoutes.post("/login", LoginUser)

export default userRoutes



