import User from '../schemas/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
	const { email, password } = req.body
	const userExist = await User.findOne({ email })
	if (userExist !== null) {
		return res.status(409).send({ message: 'Email in use' })
	}

	const hashPassword = await bcrypt.hash(password, 10)
	try {
		const newUser = await User.create({ email, password: hashPassword })

		res.status(201).json({
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
			},
		})
	} catch (error) {
		next(error)
	}
}

export const login = async (req, res, next) => {
	const { email, password } = req.body

	try {
		const userExist = await User.findOne({ email })

		if (userExist === null) {
			console.log('Email')
			return res.status(401).send({ message: 'Email or password is incorrect' })
		}

		const isMatch = await bcrypt.compare(password, userExist.password)

		if (isMatch === false) {
			console.log('Password')
			return res.status(401).send({ message: 'Email or password is incorrect' })
		}

		const token = jwt.sign(
			{ id: userExist._id, name: userExist.name },
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		)
		await User.findOneAndUpdate(userExist._id, { token })

		res.status(200).json({
			token,
			user: {
				email: userExist.email,
				subscription: userExist.subscription,
			},
		})
	} catch (error) {
		next(error)
	}
}

export const logout = async (req, res, next) => {
	const { _id } = req.user

	try {
		await User.findByIdAndUpdate(_id, { token: null })

		res.status(204).end()
	} catch (error) {
		next(error)
	}
}

export const current = async (req, res, next) => {
	const { email, subscription } = req.user

	res.json({ email, subscription })
}
