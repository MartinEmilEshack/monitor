const mongoose = require('mongoose');
const { CheckState, CheckStateModel } = require('./CheckState');
const protocols = require('./protocols');
const { User } = require('./User');

class Check {
	name = '';
	webhook = '';
	interval = 1000 * 60 * 10;
	/** @type {string[]} */
	tags = [];
	assert = { statusCode: 0 };
	/** @type {'HTTP'|'HTTPS'|'TCP'} */
	protocol = 'HTTP';
	threshold = 1;
	lastUpdate = 0;

	url = '';
	port = 80;
	path = '';
	httpHeaders = {};
	timeout = 1000 * 5;
	/** @type {{ username: string, password: string }} */
	authentication = { username: null, password: null };
	ignoreSSL = false;

	/** @type {CheckState} */
	state = null;
	user = null;

	/** @param  {Check} checkJSON */
	constructor(checkJSON) {
		const port = parseInt(checkJSON.port);
		const timeout = parseInt(checkJSON.timeout);
		const interval = parseInt(checkJSON.interval);
		const threshold = parseInt(checkJSON.threshold);
		const statusCode = parseInt(checkJSON.assert.statusCode);
		const statusCodeValid = statusCode !== NaN && statusCode > 99 && statusCode < 600;
		const checkAuth = checkJSON.authentication && checkJSON.authentication.username.length > 0;

		this.name = checkJSON.name;
		this.webhook = checkJSON.webhook;
		this.interval = interval !== NaN && interval >= 1 ? 1000 * 60 * interval : 1000 * 60 * 10; // >= 1min default 10min
		this.tags = checkJSON.tags;
		this.assert.statusCode = statusCodeValid ? statusCode : 0;
		this.protocol = protocols.hasOwnProperty(checkJSON.protocol) ? checkJSON.protocol : 'HTTP';
		this.lastUpdate = Date.now();
		this.threshold = threshold !== NaN ? threshold : 1; // 1 allowed request fails

		this.url = checkJSON.url;
		this.port = port !== NaN ? port : 80;
		this.path = checkJSON.path;
		this.httpHeaders = checkJSON.httpHeaders;
		this.timeout = timeout !== NaN && timeout >= 1 ? 1000 * timeout : 1000 * 5; // >= 1sec default 5sec
		this.authentication = checkAuth ? checkJSON.authentication : { username: '', password: '' };
		this.ignoreSSL = checkJSON.ignoreSSL === 'true';
	}

	/**
	 * Adds current state of the check
	 * @param  {CheckState} checkState
	 */
	setState(checkState) {
		this.state = checkState;
	}

	/**
	 * Adds user data to the check
	 * @param  {User} user
	 */
	setUser(user) {
		this.user = user;
	}

	getRequestOptions() {
		return {
			method: 'GET',
			hostname: this.url,
			port: this.port,
			path: this.path,
			headers: this.httpHeaders,
			timeout: this.timeout,
			auth: this.authentication.username.length && this.authentication.password.length ?
				`${this.authentication.username}:${this.authentication.password}` : null,
			rejectUnauthorized: !this.ignoreSSL,
		};
	}

	toJSON() {
		return JSON.stringify({
			name: this.name,
			url: this.url,
			protocol: this.protocol,
			path: this.path,
			port: this.port,
			webhook: this.webhook,
			timeout: this.timeout,
			interval: this.interval,
			threshold: this.threshold,
			ignoreSSL: this.ignoreSSL,
			tags: this.tags,
			httpHeaders: this.httpHeaders,
			assert: this.assert,
			authentication: this.authentication,
			lastUpdate: this.lastUpdate,
		});
	};

	static getModelSchema() {
		return {
			userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', immutable: true },
			name: { type: String, trim: true, required: [true, "Please add a name for the check"] },
			url: { type: String, trim: true, required: [true, "Please add a url for the check"] },
			protocol: {
				type: String, trim: true, enum: Object.keys(protocols),
				default: 'HTTP', uppercase: true
			},
			path: {
				type: String, trim: true,
				set: path => path.startsWith('/') ? path : `/${path}`,
			},
			port: {
				type: Number, default: 80,
				get: port => Math.round(port),
				set: port => Math.round(port),
			},
			webhook: { type: String, trim: true },
			interval: {
				type: Number, default: 1000 * 60 * 10,
				get: interval => Math.round(interval),
				set: interval => 1000 * 60 * Math.round(interval),
				validate: {
					validator: interval => interval >= 1,
					message: 'Interval is too small must be at least 1min'
				}
			},
			timeout: {
				type: Number, default: 1000 * 5,
				get: timeout => Math.round(timeout),
				set: timeout => 1000 * Math.round(timeout),
				validate: {
					validator: function (timeout) { return timeout >= 1 && timeout <= this.interval * 60; },
					message: 'Timeout is too small or greater than interval'
				}
			},
			threshold: {
				type: Number, default: 1,
				get: threshold => Math.round(threshold),
				set: threshold => Math.round(threshold),
				validate: {
					validator: threshold => threshold >= 1,
					message: 'Less than one error! That does not make any sense'
				}
			},
			authentication: {
				// TODO: authentication.password should be encrypted some how
				type: new mongoose.Schema({
					username: { type: String, trim: true, default: '' },
					password: { type: String, trim: true, default: '' },
				}, { _id: false }),
				default: {}
			},
			httpHeaders: {
				type: new mongoose.Schema({
					key: { type: String, trim: true, lowercase: true },
					value: { type: String, trim: true }
				}, { _id: false }),
				default: {}
			},
			assert: {
				type: {
					statusCode: {
						type: Number, default: 0,
						get: statusCode => Math.round(statusCode),
						set: statusCode => Math.round(statusCode),
						validate: {
							validator: statusCode =>
								(statusCode >= 100 && statusCode <= 500) || statusCode === 0,
							message: 'Status code invalid'
						}
					},
				}, default: {}
			},
			tags: [String],
			ignoreSSL: { type: Boolean, default: false, set: ig => ig === 'true' },
			lastUpdate: { type: Number, default: 0 },
			active: { type: Boolean, default: true },
			checkStateId: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckState', immutable: true }
		};
	};
}

/** @type {mongoose.Schema<Check, mongoose.Model<Check>>} */
const checkSchema = new mongoose.Schema(Check.getModelSchema());

/** @type {mongoose.Model<Check>} */
const CheckModel = mongoose.model('Check', checkSchema, 'checks');

module.exports = { Check, CheckModel };