const { from, Observable } = require("rxjs");
const net = require('net');
const http = require('http');
const https = require('https');
const { Check } = require("../models/Check");
const { response } = require("./response");

const toPoll = [];

/** @param  {Observable<number>} clockwork */
const pollTask = (clockwork) => {
	clockwork.subscribe(startPing);
};

/** @param  {number} clock */
const startPing = (clock) => {
	// TODO: get all checks with Date.now() > check.lastUpdate + check.interval
	// TODO: get CheckStates for all checks queried
	// TODO: bulk update lastUpdate = check.lastUpdate + check.interval for all queried checks
	// TODO: from({ check, checkState }[])
	const scheduledChecks = from(toPoll);
	scheduledChecks.subscribe(sendRequest);
};

/**
 * It sends a new response to the response Subject to query for DB update
 * the response consists of the check and a positive response-time to indicate uptime
 * 
 * @param  {Check} check
 * @param  {number} sendTime
 */
const aliveResponse = (check, sendTime) => {
	response.next({ check, sendTime, responseTime: Date.now() - sendTime });
};

/**
 * It sends a new response to the response Subject to query for DB update
 * the response consists of the check and a negative response-time to indicate downtime
 * 
 * @param  {Check} check
 * @param  {number} sendTime
 */
const deadResponse = (check, sendTime) => {
	response.next({ check, sendTime, responseTime: sendTime - Date.now() });
};

/**
 * @param  {Check} check
 */
const sendRequest = (check) => {
	try {
		if (check.protocol === 'TCP') {
			const check = new net.Socket();
			const sendTime = Date.now();
			check.connect(check.port, check.url, () => aliveResponse(check, sendTime))
				.on('error', () => deadResponse(check, sendTime)).end();
		} else {
			const http_s = check.protocol === 'HTTPS' ? https : http;
			const sendTime = Date.now();
			const request = http_s.request(check.getRequestOptions(), (res) => {
				if (check.assert.statusCode === 0 || (
					res.statusCode !== undefined &&
					res.statusCode === check.assert.statusCode
				)) aliveResponse(check, sendTime);
				else deadResponse(check, sendTime);
			});
			request.on('socket', () => setTimeout(() => request.destroy(), check.timeout - 500)); // 500ms safe margin
			request.on('error', (err) => deadResponse(check, sendTime)).end();
		}
	} catch (err) {
		console.error('Error requesting a check:');
		console.error(err.name, err.message);
	}
};

module.exports = { toPoll, pollTask };