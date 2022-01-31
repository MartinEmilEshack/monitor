const express = require('express');
const authController = require('../controllers/authController');
const checkController = require('../controllers/checkController');

/** @type {express.Router} */
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/', checkController.newCheck);
router.get('/', checkController.getAllChecks);

router.route('/:id')
	.get(checkController.getCheck)
	.patch(checkController.updateCheck)
	.delete(checkController.deleteCheck);

module.exports = router;