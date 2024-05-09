import user from '../schemas/user.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'

export const register = async (req, res, next) => {
	const { email, password } = req.body
	const userExist = await user.findOne({ email })
	if (userExist) {
		next(HttpError(409, 'Email in use'))
	}

	const hashPassword = await bcrypt.hash(password, 10)
	try {
		const newUser = await user.create({ email, password: hashPassword })

		console.log(newUser)
		res.status(201).send('Register new User.')
	} catch (error) {
		next(error)
	}
}
