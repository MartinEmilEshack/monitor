const Check = require("../models/CheckModel");

/**
 * POST the event to a webhook when server is down
 * @param {Check} check
 */
const webhook = (check) => {
	console.log('user notified by webhook', check);
};

module.exports = webhook;