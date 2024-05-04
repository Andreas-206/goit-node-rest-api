import HttpError from '../helpers/HttpError.js'
import Contact from '../schemas/contactModel.js'

export const getAllContacts = async (req, res, next) => {
	try {
		const result = await Contact.find()
		res.json(result)
	} catch (error) {
		next({})
	}
}

export const getOneContact = async (req, res, next) => {
	const { id } = req.params
	try {
		const result = await Contact.findById(id)
		if (!result) throw HttpError(404)

		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}

export const deleteContact = async (req, res, next) => {
	const { id } = req.params
	try {
		const result = await Contact.findByIdAndDelete(id)
		if (!result) throw HttpError(404)
		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}

export const createContact = async (req, res, next) => {
	try {
		const result = await Contact.create(req.body)
		res.status(201).json(result)
	} catch (error) {
		next({})
	}
}

export const updateContact = async (req, res, next) => {
	const { id } = req.params
	try {
		if (Object.keys(req.body).length === 0)
			throw HttpError(400, 'Body must have at least one field')
		const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })

		if (!result) throw HttpError(404)

		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}

export const updateStatusContact = async (req, res, next) => {
	const { id } = req.params
	try {
		const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
		if (!result) throw HttpError(404)

		res.json(result)
	} catch (error) {
		next(error.status ? error : {})
	}
}
