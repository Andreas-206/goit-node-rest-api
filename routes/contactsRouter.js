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
import authorization from '../middleware/authorization.js'

const contactsRouter = express.Router()

contactsRouter.get('/', authorization, getAllContacts)

contactsRouter.get('/:id', authorization, validateId, getOneContact)

contactsRouter.delete('/:id', authorization, validateId, deleteContact)

contactsRouter.post(
	'/',
	authorization,
	validateBody(createContactSchema),
	createContact
)

contactsRouter.put(
	'/:id',
	authorization,
	validateId,
	validateBody(updateContactSchema),
	updateContact
)

contactsRouter.patch(
	'/:id/favorite',
	authorization,
	validateId,
	validateBody(updateFavoriteSchema),
	updateStatusContact
)

export default contactsRouter
