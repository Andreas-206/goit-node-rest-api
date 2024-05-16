import User from '../models/user.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (user) {
			throw HttpError(409, 'Email in use')
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const newUser = await User.create({ ...req.body, password: hashPassword })
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
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })

		if (!user) {
			throw HttpError(401, 'Email or password is wrong')
		}

		const passwordCompare = await bcrypt.compare(password, user.password)

		if (!passwordCompare) {
			throw HttpError(401, 'Email or password is wrong')
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '23h',
		})
		await User.findByIdAndUpdate(user._id, { token })

		res.status(200).json({
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		})
	} catch (error) {
		next(error)
	}
}

export const current = async (req, res) => {
	const { email, subscription } = req.user

	res.json({ email, subscription })
}

export const logout = async (req, res, next) => {
	const { _id } = req.user
	try {
		await User.findByIdAndUpdate(_id, { token: '' })

		res.status(204).end()
	} catch (error) {
		next(error)
	}
}

export const updateSubscription = async (req, res, next) => {
	const { id } = req.params
	const { subscription } = req.body

	try {
		const user = await User.findByIdAndUpdate(id, { subscription })

		if (!user) {
			throw HttpError(404)
		}

		if (subscription === user.subscription) {
			throw HttpError(409, 'User already has this subscription')
		}

		res.json({ message: 'Subscription updated successfully' })
	} catch (error) {
		next(error)
	}
}
