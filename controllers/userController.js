const { UserModel } = require('../models/User');
const base = require('./baseController');

/**
 * Returns a request handler that deletes a User from DB  
 * @returns {express.RequestHandler} RequestHandler
 */
exports.deleteMe = async (req, res, next) => {
	try {
		await UserModel.findByIdAndUpdate(req.user.id, { active: false });
		res.status(204).json({ status: 'success', data: null });
	} catch (error) { next(error); }
};

exports.getAllUsers = base.getAll(UserModel);
exports.getUser = base.getOne(UserModel);

// Don't update password on this 
exports.updateUser = base.updateOne(UserModel);
exports.deleteUser = base.deleteOne(UserModel);