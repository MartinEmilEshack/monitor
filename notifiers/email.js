const { Check } = require("../models/Check");
const nodemailer = require('nodemailer');

/**
 * Emails the check to the user when server is down
 * @param {Check} check
 */
const email = async (check) => {
	// mailing example with url to see the mail sent
	let testAccount = await nodemailer.createTestAccount();
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: process.env.MAIL_SERVER,
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // should use process.env.MAIL_SERVER_USER
			pass: testAccount.pass, // should use process.env.MAIL_SERVER_PASS
		},
	});

	let info = await transporter.sendMail({
		from: '"Monitor" <no-reply@monitor.com>',
		to: check.user.email,
		subject: `Server is ${check.state.status.toUpperCase()}`,
		html:
			`<div>
				<h1>Check status of ${check.name}</h1>
				<h2>Hello ${check.user.name}</h2>
				<h3>
					We are informing you that your check ${check.name} is 
					currently ${check.state.status.toUpperCase()}.
				</h3>
				<a href='http://localhost:3000/reports/${check.state._id}'>Full Report..</a>
			</div>`,
	});

	console.log(`User ${check.user.name} notified by email`, info.messageId);
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = email;
