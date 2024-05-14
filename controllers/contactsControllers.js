import HttpError from '../helpers/HttpError.js'
import Contact from '../schemas/contactModel.js'

export const getAllContacts = async (req, res, next) => {
	try {
		const { _id: owner } = req.user
		const { page = 1, limit = 20 } = req.query
		const skip = (page - 1) * limit

		const result = await Contact.find({ owner }, '-createdAt', { skip, limit })
		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const getOneContact = async (req, res, next) => {
	const { id: _id } = req.params
	const { id: owner } = req.user
	try {
		const result = await Contact.findOne({ _id, owner })
		if (!result) {
			throw HttpError(404)
		}

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const deleteContact = async (req, res, next) => {
	const { id: _id } = req.params
	const { _id: owner } = req.user
	try {
		const result = await Contact.findOneAndDelete({ _id, owner })
		if (!result) {
			throw HttpError(404)
		}

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const createContact = async (req, res, next) => {
	const { _id: owner } = req.user
	try {
		const result = await Contact.create({ ...req.body, owner })
		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const updateContact = async (req, res, next) => {
	const { id: _id } = req.params
	const { _id: owner } = req.user
	try {
		const result = await Contact.findOneAndUpdate({ _id, owner }, req.body, {
			new: true,
		})
		if (!result) {
			throw HttpError(404)
		}

		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const updateStatusContact = async (req, res, next) => {
	const { id: _id } = req.params
	const { _id: owner } = req.user
	try {
		const result = await Contact.findOneAndUpdate({ _id, owner }, req.body, {
			new: true,
		})
		if (!result) {
			throw HttpError(404)
		}

		res.json(result)
	} catch (error) {
		next(error)
	}
}
