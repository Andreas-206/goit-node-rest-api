import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import contactsRouter from './routes/contactsRouter.js'
import mongoose from 'mongoose'
import 'dotenv/config'

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

const uri = process.env.DB_URI
const port = process.env.PORT

async function run() {
	try {
		await mongoose.connect(uri)
		await mongoose.connection.db.admin().command({ ping: 1 })
		console.log('Database connection successful')

		app.listen(port, () => {
			console.log(`Server is running. Use our API on port: ${port}`)
		})
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}

run()
