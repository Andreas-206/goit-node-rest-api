import multer from 'multer'
import path from 'node:path'

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log(path.resolve('tmp'))
		cb(null, path.resolve('tmp'))
	},
})

export default multer({ storage })
