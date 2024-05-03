import HttpError from './HttpError.js'
import mongoose from 'mongoose'

export default function validateId(req, res, next) {
	try {
		const { id } = req.params
		if (!mongoose.Types.ObjectId.isValid(id)) next(HttpError(400, 'Not found'))
	} catch (error) {
		next(error)
	}
}
