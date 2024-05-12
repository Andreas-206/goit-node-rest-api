import HttpError from '../helpers/HttpError.js'
import Contact from '../schemas/contactModel.js'

export const getAllContacts = async (req, res) => {
	const { _id: owner } = req.user
	const { page = 1, limit = 20 } = req.query
	const skip = (page - 1) * limit
	const result = await Contact.find({ owner }, '-createdAt', {
		skip,
		limit,
	}).populate('owner', 'subscription email')
	res.json(result)
}

export const getOneContact = async (req, res) => {
	const { id: _id } = req.params
	const { id: owner } = req.user
	const result = await Contact.findOne({ _id, owner })
	if (!result) {
		throw HttpError(404)
	}
	res.json(result)
}

export const deleteContact = async (req, res) => {
	const { id: _id } = req.params
	const { _id: owner } = req.user
	const result = await Contact.findOneAndDelete({ _id, owner })
	if (!result) {
		throw HttpError(404)
	}
	res.json(result)
}

export const createContact = async (req, res) => {
	const { _id: owner } = req.user
	const result = await Contact.create({ ...req.body, owner })
	res.status(201).json(result)
}

export const updateContact = async (req, res) => {
	const { id: _id } = req.params
	const { _id: owner } = req.user
	const result = await Contact.findOneAndUpdate({ _id, owner }, req.body, {
		new: true,
	})
	if (!result) {
		throw HttpError(404)
	}
	res.json(result)
}

export const updateStatusContact = async (req, res) => {
	const { id: _id } = req.params
	const { _id: owner } = req.user
	const result = await Contact.findOneAndUpdate({ _id, owner }, req.body, {
		new: true,
	})
	if (!result) {
		throw HttpError(404)
	}
	res.json(result)
}
