const { Check } = require("../models/Check");
const http = require('http');

/**
 * POST the event to a webhook when server is down
 * @param {Check} check
 */
const webhook = async (check) => {
	if (check.webhook === "") return;
	const webhookUrl = new URL(check.webhook);
	http.request({
		method: 'POST',
		hostname: webhookUrl.hostname,
		port: webhookUrl.port,
		path: webhookUrl.pathname,
		headers: { 'Content-Type': 'application/json' }
	}, (res) => console.log(`User ${check.user.name} notified by webhoook`, res.statusCode))
		.on('error', () => { })
		.write(JSON.stringify({ checkName: check.name, status: check.state.status }))
		.end();
};

module.exports = webhook;