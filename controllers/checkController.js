const { CheckModel } = require('../models/Check');
const { CheckStateModel } = require('../models/CheckState');
const base = require('./baseController');


/**
 * Returns a request handler that creates a new Check in DB
 * @async
 * @returns {express.RequestHandler} RequestHandler
 */
exports.newCheck = async (req, res, next) => {
	try {
		const tempCheck = await CheckModel.create({ userId: req.user._id, ...req.body });
		const checkState = await CheckStateModel.create({
			userId: req.user._id, checkId: tempCheck._id
		});
		const check = await CheckModel.findByIdAndUpdate(
			tempCheck._id, { checkStateId: checkState._id }, { new: true, strict: false },
		);
		res.status(201).json({ status: 'success', data: { check } });
	} catch (error) { next(error); }
};

/**
 * Returns a request handler that gets all the user's Checks from DB
 * @async
 * @returns {express.RequestHandler} RequestHandler
 */
exports.getAllChecks = async (req, res, next) => {
	try {
		const checks = await CheckModel.find({ userId: req.user._id }, '-userId -__v');
		res.status(200).json({ status: 'success', results: checks.length, data: { checks } });
	} catch (error) { next(error); }
};

/**
 * Returns a request handler that gets a specific Check from DB
 * @async
 * @returns {express.RequestHandler} RequestHandler
 */
exports.getCheck = base.getOne(CheckModel);

/**
 * Returns a request handler that updates a specific Check in DB
 * @async
 * @returns {express.RequestHandler} RequestHandler
 */
exports.updateCheck = base.updateOne(CheckModel);

/**
 * Returns a request handler that deletes a specific Check in DB
 * @async
 * @returns {express.RequestHandler} RequestHandler
 */
exports.deleteCheck = async (req, res, next) => {
	try {
		const check = await CheckModel.findByIdAndDelete(req.params.id);
		if (!check) return next(new AppError(
			404, 'fail', 'No document found with that id'), req, res, next
		);
		await CheckStateModel.findByIdAndDelete(check.checkStateId);
		res.status(204).json({ status: 'success', data: null });
	} catch (error) { next(error); }
};
