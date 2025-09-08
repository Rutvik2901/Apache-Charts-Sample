const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UserController');

router.get('/years', usersController.getYears);
router.get('/stats', usersController.getStatsByYear);

module.exports = router;
