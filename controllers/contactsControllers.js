import HttpError from '../helpers/HttpError.js'
import wrapAsync from '../helpers/wrapAsync.js'
import {
	listContacts,
	addContact,
	getContactById,
	removeContact,
	updateContactById,
} from '../services/contactsServices.js'

export const getAllContacts = wrapAsync(async (req, res) => {
	const result = await listContacts()
	res.json(result)
})

export const getOneContact = wrapAsync(async (req, res) => {
	const { id } = req.params
	const result = await getContactById(id)
	if (!result) {
		throw HttpError(404)
	}

	res.json(result)
})

export const deleteContact = wrapAsync(async (req, res) => {
	const { id } = req.params
	const result = await removeContact(id)
	if (!result) {
		throw HttpError(404)

		res.json(result)
	}
})

export const createContact = wrapAsync(async (req, res) => {
	const result = await addContact(req.body)
	res.status(201).json(result)
})

export const updateContact = wrapAsync(async (req, res) => {
	const { id } = req.params
	const result = await updateContactById(id, req.body)
	if (!result) {
		throw HttpError(404)
	}

	res.json(result)
})
