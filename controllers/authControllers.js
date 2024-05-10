import user from '../schemas/user.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res, next) => {
	const { email, password } = req.body
	const userExist = await user.findOne({ email })
	if (userExist !== null) {
		return res.status(409).send({ message: 'User already registered' })
	}

	const hashPassword = await bcrypt.hash(password, 10)
	try {
		await user.create({ email, password: hashPassword })

		res.status(201).send('Register new User.')
	} catch (error) {
		next(error)
	}
}

export const login = async (req, res, next) => {
	const { email, password } = req.body

	try {
		const userExist = await user.findOne({ email })

		if (userExist === null) {
			console.log('Email')
			return res.status(401).send({ message: 'Email or password is incorrect' })
		}

		const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
			expiresIn: '23h',
		})
		await user.findOneAndUpdate(userExist._id, { token })

		const isMatch = await bcrypt.compare(password, userExist.password)

		if (isMatch === false) {
			console.log('Password')
			return res.status(401).send({ message: 'Email or password is incorrect' })
		}

		res.status(200).send(token)
	} catch (error) {
		next(error)
	}
}

// export const login = async (req, res, next) => {
// 	const { email, password } = req.body

// 	const emailInLowerCase = email.toLowerCase()

// 	try {
// 		const userExist = await User.findOne({ email: emailInLowerCase })

// 		if (userExist === null) {
// 			console.log('Email')
// 			return res.status(401).send({ message: 'Email or password is incorrect' })
// 		}

// 		const isMatch = await bcrypt.compare(password, userExist.password)

// 		if (isMatch === false) {
// 			console.log('Password')
// 			return res.status(401).send({ message: 'Email or password is incorrect' })
// 		}

// 		res.send({ token: 'TOKEN' })
// 	} catch (error) {
// 		next(error)
// 	}
// }
