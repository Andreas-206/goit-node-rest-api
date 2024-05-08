import mongoose from 'mongoose'
import { app } from './app.js'
import 'dotenv/config'

const uri = process.env.DB_URI
const port = process.env.PORT || 8080

mongoose
	.connect(uri)
	.then(() => {
		app.listen(port, () => {
			console.log('Database connection successful')
		})
	})
	.catch(error => {
		console.log(error.message)
		process.exit(1)
	})
