const Check = require('../models/CheckModel');
const { toPoll } = require('../schedulers/poll');
const base = require('./baseController');

// exports.getAllUsers = base.getAll(User);

exports.getAllUsers = (req, res, next) => {
	res.json({ checks: 'ok' });
};

exports.newCheck = (req, res, next) => {
	const check = new Check(req.body);
	toPoll.push(check);
};