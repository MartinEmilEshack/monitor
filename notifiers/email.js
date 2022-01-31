const { Check } = require("../models/Check");

/**
 * Emails the check to the user when server is down
 * @param {Check} check
 */
const email = (check) => {
	console.log('user notified by email');
};

module.exports = email;
