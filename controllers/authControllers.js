import User from '../schemas/user.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email })
	if (user) {
		HttpError(409, 'Email in use')
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
		HttpError(401, 'Email or password is wrong')
	}

	const passwordCompare = await bcrypt.compare(password, user.password)

	if (!passwordCompare) {
		HttpError(401, 'Email or password is wrong')
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: '23h',
	})
	await User.findOneAndUpdate(user._id, { token })

	res.status(200).json({
		token,
		user: {
			email: user.email,
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
	await User.findById(_id, { token: '' })

	res.status(204).end()
}

export const updateSubscription = async (req, res) => {
	const { id } = req.user
	const { subscription } = req.body

	const user = await User.findByIdAndUpdate(id, { subscription })

	if (!user) {
		HttpError(404)
	}

	if (subscription === user.subscription) {
		HttpError(409, 'User already has this subscription')
	}

	res.json({ message: 'Subscription updated successfully' })
}
