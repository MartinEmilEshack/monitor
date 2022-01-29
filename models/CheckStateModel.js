class CheckState {
	// derived
	// responseTime = []; // (on report) avg of last 100 responseTimes from DB
	// availability = ''; // (on report) last 100 states

	pollCount = 0;
	downCount = 0;

	/** @type {'up' | 'down'} */
	status = 'down'; //The current status of the URL [last responseTime +ve/-ve]
	outages = 0; // The total number of URL downtimes
	downtime = 0; // The total time, in seconds, of the URL downtime [set accumulatively]
	uptime = 0; // The total time, in seconds, of the URL uptime [set accumulatively]

	/** @type {{state: 'up' | 'down', timeStamp: number, responseTime: number}[]} */
	history = [
		// { state: 'up/down', timeStamp: 0, responseTime: 0 }
	]; // Timestamped logs of the polling requests (sorted)
}

module.exports = CheckState;