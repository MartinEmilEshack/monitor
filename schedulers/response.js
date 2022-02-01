const { Observable, Subject, map, buffer, bufferWhen, filter } = require("rxjs");
const { Check } = require("../models/Check");
const { CheckStateModel } = require("../models/CheckState");
const alert = require("./alert");

/** @type {Subject<{check: Check, sendTime: number, responseTime: number}>} */
const response = new Subject();

/** @param  {Observable<number>} clockwork */
const updateStateTask = (clockwork) => {
	response.pipe(
		map(prepareState),
		buffer(clockwork),
		filter(arr => arr.length !== 0)
	).subscribe(bulkUpdateState);
};

/** @param  {{check: Check, sendTime: number, responseTime: number}} checkResponse */
const prepareState = ({ check, sendTime, responseTime }) => {
	check.state.pollCount++;
	if (responseTime > 0) {
		check.state.status = 'up';
		check.state.uptime += (sendTime - check.lastUpdate);
		if (check.state.downCount !== 0) {
			check.state.downCount = 0;
			alert.next(check);
		}
		check.state.downCount = 0;
	} else {
		check.state.downCount++;
		check.state.outages++;
		check.state.status = 'down';
		check.state.downtime += (sendTime - check.lastUpdate);
		if (check.state.downCount === check.threshold) alert.next(check);
	}
	// if (check.protocol === 'TCP')
	// 	console.log(`TCP ping ${responseTime}`);
	// else console.log(`HTTP/S ping ${responseTime}`);

	const updateOne = {
		filter: { _id: check.state._id },
		update: {
			$set: { ...check.state },
			$push: {
				history: {
					timeStamp: sendTime,
					responseTime: Math.abs(responseTime),
					state: check.state.status
				}
			},
		},
	};
	// the extra curly brackets are important
	return { updateOne };
};

/** @param  {{filter: Object, update: Object}[]} updateOnes */
const bulkUpdateState = (updateOnes) => {
	CheckStateModel.collection.bulkWrite(updateOnes).then()
		.catch(err => console.error(err.name, err.message));
};

module.exports = { response, updateStateTask };