import HttpError from '../helpers/HttpError.js'
import Contact from '../schemas/contactModel.js'

export const getAllContacts = async (req, res, next) => {
	const { _id: owner } = req.user
	const { page = 1, limit = 10 } = req.query
	const skip = (page - 1) * limit
	try {
		const result = await Contact.find({ owner }, '-createdAt', {
			skip,
			limit,
		}).populate('owner', 'email subscription')
		res.json(result)
	} catch (error) {
		next({})
	}
}

export const getOneContact = async (req, res, next) => {
	const { id } = req.params
	const { _id: owner } = req.user
	try {
		const result = await Contact.findById({ _id, owner })
		if (!result) throw HttpError(404)

		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}

export const deleteContact = async (req, res, next) => {
	const { id } = req.params
	const { _id: owner } = req.user
	try {
		const result = await Contact.findByIdAndDelete({ _id, owner })
		if (!result) throw HttpError(404)
		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}

export const createContact = async (req, res, next) => {
	const { _id: owner } = req.user
	try {
		const result = await Contact.create({ ...req.body, owner })
		res.status(201).json(result)
	} catch (error) {
		next({})
	}
}

export const updateContact = async (req, res, next) => {
	const { id } = req.params
	const { _id: owner } = req.user
	try {
		if (Object.keys(req.body).length === 0)
			throw HttpError(400, 'Body must have at least one field')
		const result = await Contact.findByIdAndUpdate({ _id, owner }, req.body, {
			new: true,
		})

		if (!result) throw HttpError(404)

		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}

export const updateStatusContact = async (req, res, next) => {
	const { id } = req.params
	const { _id: owner } = req.user
	try {
		const result = await Contact.findByIdAndUpdate({ _id, owner }, req.body, {
			new: true,
		})
		if (!result) throw HttpError(404)

		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}
