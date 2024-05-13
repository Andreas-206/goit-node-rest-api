import mongoose from 'mongoose'
import Joi from 'joi'

const userSchema = new mongoose.Schema(
	{
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		token: {
			type: String,
			default: null,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
)

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

export const registerSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).trim().required(),
	password: Joi.string().trim().required().min(6),
})

export const loginSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).trim().required(),
	password: Joi.string().trim().required().min(6),
})

export const updateSubscriptionSchema = Joi.object({
	subscription: Joi.string()
		.valid('starter', 'pro', 'business')
		.only()
		.required(),
})

export default mongoose.model('User', userSchema)
