import HttpError from '../helpers/HttpError.js'
// import {
// 	listContacts,
// 	addContact,
// 	getContactById,
// 	removeContact,
// 	updateContactById,
// } from '../services/contactsServices.js'
import Contact from '../schemas/contactModel.js'

export const getAllContacts = async (req, res, next) => {
	const result = await Contact.find()
	res.json(result)
}

export const getOneContact = async (req, res, next) => {
	const { id } = req.params
	const result = await Contact.findOne(id)
	if (!result) throw HttpError(404)

	res.json(result)
}

export const deleteContact = async (req, res, next) => {
	const { id } = req.params
	const result = await Contact.findByIdAndDelete(id)
	if (!result) throw HttpError(404)

	res.json(result)
}

export const createContact = async (req, res, next) => {
	const { name, email, phone } = req.body
	const result = await Contact.create(name, email, phone)
	res.status(201).json(result)
}

export const updateContact = async (req, res, next) => {
	if (Object.keys(req.body).length === 0)
		throw HttpError(400, 'Body must have at least one field')

	const { id } = req.params
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })

	if (!result) throw HttpError(404)

	res.json(result)
}

export const updateStatusContact = async (req, res, next) => {
	const { id } = req.params
	const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
	if (!result) throw HttpError(404)

	res.json(result)
}
