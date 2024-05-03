import Contact from '../schemas/contactModel.js'

export async function listContacts() {
	const contacts = await Contact.find()
	return contacts
}

export async function addContact(name, email, phone) {
	const newContact = await Contact.create({ name, email, phone })
	return newContact
}

export async function getContactById(contactId) {
	const contact = await Contact.findById(contactId)
	return contact
}

export async function removeContact(contactId) {
	const result = await Contact.findByIdAndDelete({ _id: contactId })
	return result
}

export async function updateContactById(contactId, newContact) {
	const result = await Contact.findByIdAndUpdate(
		{ _id: contactId },
		newContact,
		{ new: true }
	)

	return result
}
