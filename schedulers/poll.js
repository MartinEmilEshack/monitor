const { from, Observable } = require("rxjs");
const net = require('net');
const http = require('http');
const https = require('https');
const { Check, CheckModel } = require("../models/Check");
const { response } = require("./response");
const { Document } = require("mongoose");

const toPoll = [];

/** @param  {Observable<number>} clockwork */
const pollTask = (clockwork) => {
	clockwork.subscribe(startPing);
};

/** @param  {number} clock */
const startPing = (clock) => {
	if (clock <= 3) { if (clock === 0) recoverLongShutdown(); return; }
	try {
		CheckModel.find().$where(`this.lastUpdate <= ${Date.now()} - this.interval && this.active`)
			.populate('checkStateId', "pollCount downCount status outages downtime uptime")
			.populate('userId', 'name email')
			.then(checks => {
				if (!checks || !checks.length) return;
				CheckModel.updateMany({}, [
					{ $set: { lastUpdate: { $add: ['$lastUpdate', '$interval'] } } }
				]).$where(`this.lastUpdate <= ${Date.now()} - this.interval && this.active`)
					.then(b => console.log(b.nModified, clock));
				from(checks).subscribe(sendRequest);
			});
	} catch (err) { console.error(err.name, err.message); }
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
 * @param  {Document<Check>} checkDoc
 */
const sendRequest = (checkDoc) => {
	const check = Check.fromDocument(checkDoc);
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