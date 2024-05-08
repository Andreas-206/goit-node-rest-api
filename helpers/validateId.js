import HttpError from './HttpError.js'
import mongoose from 'mongoose'

export default function validateId(req, res, next) {
	const { id } = req.params
	if (!mongoose.isValidObjectId(id)) {
		next(HttpError(400, 'Invalid id'))
	}
	next()
}
