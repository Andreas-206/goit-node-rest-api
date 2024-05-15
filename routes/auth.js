import express from 'express'
import {
	register,
	login,
	logout,
	current,
	updateSubscription,
	addAvatar,
} from '../controllers/authControllers.js'
import validateBody from '../helpers/validateBody.js'
import validateId from '../helpers/validateId.js'
import {
	registerSchema,
	loginSchema,
	updateSubscriptionSchema,
} from '../schemas/usersSchemas.js'
import authorization from '../middleware/authorization.js'

const authRouter = express.Router()

authRouter.post('/register', validateBody(registerSchema), register)
authRouter.post('/login', validateBody(loginSchema), login)
authRouter.post('/logout', authorization, logout)
authRouter.get('/current', authorization, current)
authRouter.patch(
	'/:id/subscription',
	authorization,
	validateId,
	validateBody(updateSubscriptionSchema),
	updateSubscription
)
authRouter.patch('/avatars', authorization, addAvatar)

export default authRouter
