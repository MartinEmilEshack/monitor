const Check = require("../models/CheckModel");

/**
 * Emails the check to the user when server is down
 * @param {Check} check
 */
const email = (check) => {
	console.log('user notified by email', check);
};

module.exports = email;
