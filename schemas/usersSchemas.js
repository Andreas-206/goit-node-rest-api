import Joi from 'joi'

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

export const emailSchema = Joi.object({
	email: Joi.string().pattern(emailRegexp).trim().required(),
})
