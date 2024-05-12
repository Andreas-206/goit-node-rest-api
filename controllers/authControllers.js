import User from '../schemas/user.js'

import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
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
}

export const login = async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })

	if (!user) {
		throw HttpError(401, 'Email or password is wrong')
	}
	const passwordCompare = await bcrypt.compare(password, user.password)
	if (!passwordCompare) {
		throw HttpError(401, 'Email or password is wrong')
	}

	const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
		expiresIn: '23h',
	})
	await User.findOneAndUpdate(user._id, { token })

	res.status(200).json({
		token,
		user: {
			email,
			subscription: user.subscription,
		},
	})
}

export const current = async (req, res) => {
	const { email, subscription } = req.user

	res.json({ email, subscription })
}

export const logout = async (req, res) => {
	const { _id } = req.user
	await User.findByIdAndUpdate(_id, { token: '' })

	res.status(204).end()
}
