import jwt from 'jsonwebtoken'
import User from '../schemas/user.js'
import HttpError from '../helpers/HttpError.js'

const authorization = async (req, res, next) => {
	const { authorization = '' } = req.headers
	const [bearer, token] = authorization.split(' ')

	if (bearer !== 'Bearer') {
		next(HttpError(401))
	}

	const { JWT_SECRET } = process.env

	try {
		const { id } = jwt.verify(token, JWT_SECRET)
		const user = await User.findById(id)

		if (!user || !user.token || user.token !== token) {
			next(HttpError(401))
		}

		req.user = user

		next()
	} catch (error) {
		next(HttpError(401))
	}
}

export default authorization
