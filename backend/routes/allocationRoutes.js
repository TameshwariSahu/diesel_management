const express = require('express');
const router = express.Router();

const {
  createAllocation,
  getAllocations,
  updateStatus
} = require('../controllers/allocationController');

const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', verifyToken, createAllocation);

router.get('/', verifyToken, getAllocations);

router.put('/:id/status', verifyToken, isAdmin, updateStatus);

module.exports = router;