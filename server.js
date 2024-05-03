import mongoose from 'mongoose'
import { app } from './app.js'

const uri = process.env.DB_URI
const port = process.env.PORT || 8080

async function run() {
	try {
		await mongoose.connect(uri)
		console.log('Database connection successful')

		app.listen(port, () => {
			console.log(`Server is running. Use our API on port: ${port}`)
		})
	} catch (error) {
		console.log(error.message)
		process.exit(1)
	}
}

run()
