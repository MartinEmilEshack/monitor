const { Observable, Subject, map, buffer } = require("rxjs");
const Check = require("../models/CheckModel");
const CheckState = require("../models/CheckStateModel");
const alert = require("./alert");

/** @type {Subject<{check: Check, sendTime: number, responseTime: number}>} */
const response = new Subject();

/** @param  {Observable<number>} clockwork */
const updateStateTask = (clockwork) => {
	response.pipe(map(prepareState), buffer(clockwork)).subscribe(bulkUpdateState);
};

/** @param  {{check: Check, sendTime: number, responseTime: number}} checkResponse */
const prepareState = ({ check, sendTime, responseTime }) => {
	check.setState(new CheckState());
	check.state.pollCount++;
	if (responseTime > 0) {
		check.state.downCount = 0;
		check.state.status = 'up';
		check.state.uptime += (sendTime - check.lastUpdate);
	} else {
		check.state.downCount++;
		check.state.outages++;
		check.state.status = 'down';
		check.state.downtime += (sendTime - check.lastUpdate);
	}
	check.lastUpdate = sendTime;
	if (check.state.downtime >= check.threshold) alert.next(check);

	if (check.protocol === 'TCP')
		console.log(`TCP ping ${responseTime}`);
	else console.log(`HTTP/S ping ${responseTime}`);
	return { check, sendTime, responseTime: Math.abs(responseTime) };
};

/** @param  {{check: Check, sendTime: number, responseTime: number}[]} responses */
const bulkUpdateState = (responses) => {
	console.log(responses.length);
};

module.exports = { response, updateStateTask };