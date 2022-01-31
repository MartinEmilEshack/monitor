const express = require('express');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const checkRoutes = require('./routes/checkRoutes');
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API 
const limiter = rateLimit({
	max: 150,
	windowMs: 60 * 60 * 1000,
	message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '15kb' }));
app.use(express.raw());

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(express.static(__dirname + '/public'));

// User Routes
app.use('/users', userRoutes);

// Check Routes
app.use('/checks', checkRoutes);

// handle undefined Routes
app.use('*', (req, res, next) => {
	const err = new AppError(404, 'fail', 'undefined route');
	next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;