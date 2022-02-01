const { interval, filter } = require('rxjs');
const { CheckModel } = require("../models/Check");

// 5000 * 12 = 60sec
const RECOVERY_TIME = 3;
const ticker = interval(5000);

// recover missing poll request intervals after this server shutdown
const recoverTime = ticker.pipe(filter(tick => tick <= RECOVERY_TIME));
const clockwork = ticker.pipe(filter(tick => tick > RECOVERY_TIME));

/**
 * At first update all active checks then do nothing
 * @async
 */
const recoverLongShutdown = async (tick) => {
	if (tick > 0) return;
	CheckModel.find().$where(`this.active`).then(checks =>
		checks.forEach(check => {
			const missingIntervals = Math.round((Date.now() - check.lastUpdate) / check.interval) * 60000;
			check.lastUpdate = check.lastUpdate + missingIntervals;
			check.save();
		})
	);
};

recoverTime.subscribe(recoverLongShutdown);

module.exports = clockwork;