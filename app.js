import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import contactsRouter from './routes/contactsRouter.js'
import mongoose from 'mongoose'
import 'dotenv/config'

const DB_URI = process.env.DB_URI

async function run() {
	try {
		await mongoose.connect(DB_URI)

		console.log('DB connected')
	} catch (error) {
		console.log(error)
	}
}

run()

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((_, res) => {
	res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
	const { status = 500, message = 'Server error' } = err
	res.status(status).json({ message })
})

app.listen(8080, () => {
	console.log('Server is running. Use our API on port: 8080')
})
