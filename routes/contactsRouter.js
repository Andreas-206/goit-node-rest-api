import express from 'express'
import {
	getAllContacts,
	getOneContact,
	deleteContact,
	createContact,
	updateContact,
	updateStatusContact,
} from '../controllers/contactsControllers.js'
import {
	createContactSchema,
	updateContactSchema,
	updateFavoriteSchema,
} from '../schemas/contactsSchemas.js'
import validateBody from '../helpers/validateBody.js'
import validateId from '../helpers/validateId.js'

const contactsRouter = express.Router()

contactsRouter.get('/', getAllContacts)

contactsRouter.get('/:id', validateId, getOneContact)

contactsRouter.delete('/:id', validateId, deleteContact)

contactsRouter.post('/', validateBody(createContactSchema), createContact)

contactsRouter.put(
	'/:id',
	validateId,
	validateBody(updateContactSchema),
	updateContact
)

contactsRouter.patch(
	'/:id/favorite',
	validateId,
	validateBody(updateFavoriteSchema),
	updateStatusContact
)

export default contactsRouter
