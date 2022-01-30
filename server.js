const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./monitor');
const clockwork = require('./schedulers/clockwork');
const { pollTask } = require('./schedulers/poll');
const { updateStateTask } = require('./schedulers/response');

// Error handeling
process.on('uncaughtException', err => {
	console.error('UNCAUGHT EXCEPTION!!!');
	console.error(err.name, err.message);
	console.error('shutting down...');
	process.exit(1);
});

process.on('unhandledRejection', err => {
	console.error('UNHANDLED REJECTION!!!');
	console.error(err.name, err.message);
	console.error('shutting down...');
	server.close(() => process.exit(1));
});

dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connect the database
mongoose.connect(database, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
}).then(con => {
	console.info('Database connected successfully');
	// Start the server
	const port = process.env.PORT;
	app.listen(port, () => {
		console.log(`Application is running on port ${port}`);
		pollTask(clockwork);
		updateStateTask(clockwork);
	});
}).catch(err => {
	console.error('Error connecting to the database');
	console.error(err.name, err.message);
	console.error('shutting down...');
	process.exit(1);
});
