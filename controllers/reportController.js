const base = require('./baseController');
const { CheckStateModel } = require("../models/CheckState");

/**
 * Returns a request handler that gets all the user's reports from DB
 * @async
 * @returns {express.RequestHandler} RequestHandler
 */
exports.getAllCheckStates = async (req, res, next) => {
	try {
		const checkStates = await CheckStateModel
			.find({ userId: req.user._id }, '-userId -checkId');
		res.status(200).json({
			status: 'success', results: checkStates.length, data: { reports: checkStates }
		});
	} catch (error) { next(error); }
};

/**
 * Returns a request handler that gets a specific Check from DB
 * @async
 * @returns {express.RequestHandler} RequestHandler
 */
exports.getCheckState = base.getOne(CheckStateModel);