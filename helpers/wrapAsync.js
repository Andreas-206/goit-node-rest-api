function wrapAsync(controller) {
	return async function wrappedFunction(req, res, next) {
		try {
			await controller(req, res, next)
		} catch (error) {
			next(error)
		}
	}
}

export default wrapAsync
