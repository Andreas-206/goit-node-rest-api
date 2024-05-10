import express from 'express'
import { register, login } from '../controllers/authControllers.js'
import validateBody from '../helpers/validateBody.js'
import registerSchema from '../schemas/user.js'
import loginSchema from '../schemas/user.js'

const authRouter = express.Router()

authRouter.post('/register', validateBody(registerSchema), register)
authRouter.post('/login', validateBody(loginSchema), login)

export default authRouter
