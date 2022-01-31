const AppError = require('../utils/appError');
const APIFeatures = require('../utils/ApiFeatures');
const { Model } = require('mongoose');
const express = require('express');

/**
 * Returns a request handler that deletes a Model in DB 
 * @param {Model} Model 
 * @returns {express.RequestHandler} RequestHandler
 */
exports.deleteOne = Model => async (req, res, next) => {
	try {
		const doc = await Model.findByIdAndDelete(req.params.id);
		if (!doc) return next(
			new AppError(404, 'fail', 'No document found with that id'),
			req, res, next
		);
		res.status(204).json({ status: 'success', data: null });
	} catch (error) { next(error); }
};

/**
 * Returns a request handler that updatesOne Model in DB 
 * @param {Model} Model 
 * @returns {express.RequestHandler} RequestHandler
 */
exports.updateOne = Model => async (req, res, next) => {
	try {
		const doc = await Model.findByIdAndUpdate(
			req.params.id, req.body, { new: true, runValidators: true, strict: 'throw' }
		);
		if (!doc) return next(
			new AppError(404, 'fail', 'No document found with that id'),
			req, res, next
		);
		res.status(200).json({
			status: 'success', data: { [doc.collection.modelName]: doc }
		});
	} catch (error) { next(error); }
};

/**
 * Returns a request handler that createsOne Model in DB 
 * @param {Model} Model
 * @returns {express.RequestHandler} RequestHandler
 */
exports.createOne = Model => async (req, res, next) => {
	try {
		const doc = await Model.create(req.body);
		res.status(201).json({
			status: 'success', data: { [doc.collection.modelName]: doc }
		});
	} catch (error) { next(error); }
};

/**
 * Returns a request handler that getOne Model from DB 
 * @param {Model} Model 
 * @returns {express.RequestHandler} RequestHandler
 */
exports.getOne = Model => async (req, res, next) => {
	try {
		const doc = await Model.findById(req.params.id);
		if (!doc) return next(
			new AppError(404, 'fail', 'No document found with that id'),
			req, res, next
		);
		res.status(200).json({
			status: 'success', data: { [doc.collection.modelName]: doc }
		});
	} catch (error) { next(error); }
};

/**
 * Returns a request handler that getAll entries of a Model from DB 
 * @param {Model} Model 
 * @returns {express.RequestHandler} RequestHandler
 */
exports.getAll = Model => async (req, res, next) => {
	try {
		const features = new APIFeatures(Model.find(), req.query).sort().paginate();
		const doc = await features.query;
		res.status(200).json({
			status: 'success', results: doc.length, data: { [doc.collection.collectionName]: doc }
		});
	} catch (error) { next(error); }
};