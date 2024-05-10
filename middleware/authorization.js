import jwt from 'jsonwebtoken'
import User from '../schemas/user.js'

function authorization(req, res, next) {
	const authorizationHeader = req.headers.authorization

	if (typeof authorizationHeader === 'undefined') {
		return res.status(401).send({ message: 'Invalid token' })
	}

	const [bearer, token] = authorizationHeader.split(' ', 2)

	if (bearer !== 'Bearer') {
		return res.status(401).send({ message: 'Invalid token' })
	}

	jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
		if (err) {
			return res.status(401).send({ message: 'Invalid token' })
		}
		try {
			const user = await User.findById(decode.id)

			if (user === null) {
				return res.status(401).send({ message: 'Invalid token' })
			}

			if (user.token !== token) {
				return res.status(401).send({ message: 'Invalid token' })
			}

			console.log({ decode })

			req.user = user

			next()
		} catch (error) {
			next(error)
		}
	})
}

export default authorization
