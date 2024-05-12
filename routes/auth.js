import express from 'express'
import {
	register,
	login,
	logout,
	current,
} from '../controllers/authControllers.js'
import validateBody from '../helpers/validateBody.js'
import registerSchema from '../schemas/user.js'
import loginSchema from '../schemas/user.js'
import authorization from '../middleware/authorization.js'

const authRouter = express.Router()

authRouter.post('/register', validateBody(registerSchema), register)
authRouter.post('/login', validateBody(loginSchema), login)
authRouter.post('/logout', authorization, logout)
authRouter.get('/current', authorization, current)

export default authRouter
