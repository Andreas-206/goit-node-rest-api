import User from '../models/user.js'
import HttpError from '../helpers/HttpError.js'
import mail from '../helpers/sendEmail.js'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import fs from 'node:fs/promises'
import Jimp from 'jimp'
import gravatar from 'gravatar'

export const register = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (user) {
			throw HttpError(409, 'Email in use')
		}

		const avatarURL = gravatar.url(email)
		const hashPassword = await bcrypt.hash(password, 10)
		const verifyToken = crypto.randomUUID()
		const newUser = await User.create({
			...req.body,
			password: hashPassword,
			avatarURL,
			verifyToken,
		})

		mail.sendMail({
			to: email,
			from: 'petro@gmail.com',
			subject: 'Welcome to Phone book!',
			html: `To confirm your email please click on the <a href="http://localhost:8080/users/verify/${verifyToken}">link</a>`,
			text: `To confirm your email please open the link http://localhost:8080/users/verify/${verifyToken}`,
		})

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

export const verify = async (req, res, next) => {
	const { token } = req.params
	try {
		const user = await User.findOneAndUpdate(
			{ verifyToken: token },
			{ verify: true, verifyToken: '' },
			{ new: true }
		)

		if (!user) {
			throw HttpError(404, 'User not found')
		}

		res.status(200).send({ message: 'Verification successful' })
	} catch (error) {
		next(error)
	}
}

export const resendVerifyEmail = async (req, res, next) => {
	const { email } = req.body
	try {
		const user = await User.findOne({ email })
		if (!user) {
			throw HttpError(401, 'Email not found')
		}

		if (user.verify) {
			throw HttpError(401, 'Email already verify')
		}

		const verifyEmail = {
			to: email,
			subject: 'Verify email',
			html: `<a target="_blank" href="http://localhost:8080/users/verify/${user.verificationCode}">Click verify email</a>`,
		}
		await mail(verifyEmail)
		res.json({ message: 'Verification email sent' })
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

		if (!user.verify) {
			throw HttpError(401, 'Email not verify')
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

export const addAvatar = async (req, res, next) => {
	try {
		if (!req.file) {
			throw HttpError(400, 'Avatar not uploaded')
		}

		const { _id } = req.user
		const { path: filePath, filename } = req.file

		const image = await Jimp.read(filePath)
		image.resize(250, 250).write(filePath)

		const resultDir = `public/avatars/${filename}`
		await fs.rename(filePath, resultDir)

		const avatarURL = `/avatars/${filename}`
		await User.findByIdAndUpdate(_id, { avatarURL })

		res.json({ avatarURL })
	} catch (error) {
		next(error)
	}
}
