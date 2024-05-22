import nodemailer from 'nodemailer'
import dotenv from 'dotenv/config'

const transporter = nodemailer.createTransport({
	host: 'sandbox.smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USERNAME,
		pass: process.env.MAILTRAP_PASSWORD,
	},
})

// const message = {
// 	to: 'kovandolek@gmail.com',
// 	from: 'puma_real@ukr.net',
// 	subject: 'Hello',
// 	text: 'Hello World!',
// 	html: '<p>Hello World!</p>',
// }

transporter.sendMail(message).then(console.log).catch(console.error)
