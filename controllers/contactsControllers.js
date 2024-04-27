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
	}
	res.json(result)
})

export const createContact = wrapAsync(async (req, res) => {
	const result = await addContact(req.body)
	res.status(201).json(result)
})

export const updateContact = wrapAsync(async (req, res) => {
	const { id } = req.params
	const { name, email, phone } = req.body
	if (!name && !email && !phone) {
		return res
			.status(400)
			.json({ message: 'Body must have at least one field' })
	}
	const existingContact = await getContactById(id)
	const updatedContact = {
		id,
		name: name || existingContact.name,
		email: email || existingContact.email,
		phone: phone || existingContact.phone,
	}
	const result = await updateContactById(id, updatedContact)
	if (!result) {
		throw HttpError(404)
	}
	res.json(result)
})
