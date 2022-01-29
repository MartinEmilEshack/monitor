const Check = require("../models/CheckModel");

/** 
 * Used for debugging, Logs the check to the console when server is down
 * @param {Check} check 
 */
const logger = (check) => {
	console.log('user notified by logging', check);
};

module.exports = logger;