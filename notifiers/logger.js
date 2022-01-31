const { Check } = require("../models/Check");

/** 
 * Used for debugging, Logs the check to the console when server is down
 * @param {Check} check 
 */
const logger = (check) => {
	console.log('user notified by logging');
};

module.exports = logger;