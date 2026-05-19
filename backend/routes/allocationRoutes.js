const express = require('express');
const router = express.Router();
const { createAllocation, getAllocations } = require('../controllers/allocationController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, createAllocation);
router.get('/', verifyToken, getAllocations);

module.exports = router;