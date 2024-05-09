import express from 'express'
import { register } from '../controllers/authControllers.js'
import validateBody from '../helpers/validateBody.js'
import { registerSchema } from '../schemas/user.js'

const authRouter = express.Router()

authRouter.post('/users/register', validateBody(registerSchema), register)

export default authRouter
