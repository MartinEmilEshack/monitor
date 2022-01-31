const mongoose = require("mongoose");

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

	static getModelSchema() {
		return {
			userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', immutable: true },
			checkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Check', immutable: true },
			pollCount: { type: Number, default: 0 },
			downCount: { type: Number, default: 0 },
			status: { type: String, enum: ['up', 'down'], default: 'down', lowercase: true },
			outages: { type: Number, default: 0 },
			downtime: { type: Number, default: 0 },
			uptime: { type: Number, default: 0 },
			history: [new mongoose.Schema({
				state: { type: String, enum: ['up', 'down'], default: 'down', lowercase: true },
				timeStamp: { type: Number, default: 0 },
				responseTime: { type: Number, default: 0 }
			})]
		};
	}
}

/** @type {mongoose.Schema<CheckState, mongoose.Model<CheckState>>} */
const checkStateSchema = new mongoose.Schema(CheckState.getModelSchema());

/** @type {mongoose.Model<CheckState>} */
const CheckStateModel = mongoose.model('CheckState', checkStateSchema, 'checksState');

module.exports = { CheckState, CheckStateModel };