const express = require('express');
const authController = require('../controllers/authController');
const reportController = require('../controllers/reportController');

/** @type {express.Router} */
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/', reportController.getAllCheckStates);
router.route('/:id').get(reportController.getCheckState);

module.exports = router;