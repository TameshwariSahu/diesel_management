const express = require('express');
const router = express.Router();
const { getDepartments, getVehicles, addVehicle } = require('../controllers/masterController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/departments', verifyToken, getDepartments);
router.get('/vehicles', verifyToken, getVehicles);
router.post('/vehicles', verifyToken, isAdmin, addVehicle);

module.exports = router;