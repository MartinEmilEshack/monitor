const CheckState = require('./CheckStateModel');
const protocols = require('./protocols');

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
		this.authentication = checkAuth ? checkJSON.authentication : null;
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
	 * @param  {Object} checkState
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
			auth: this.authentication ?
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
};

module.exports = Check;