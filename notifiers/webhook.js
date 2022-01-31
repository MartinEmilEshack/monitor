const { Check } = require("../models/Check");

/**
 * POST the event to a webhook when server is down
 * @param {Check} check
 */
const webhook = (check) => {
	console.log('user notified by webhook');
};

module.exports = webhook;