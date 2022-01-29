const express = require('express');
const checkController = require('../controllers/checkController');

const router = express.Router();

router.get('/', checkController.getAllUsers);

router.post('/', checkController.newCheck);

module.exports = router;