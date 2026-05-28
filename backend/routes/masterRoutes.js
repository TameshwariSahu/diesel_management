const express = require('express');
const router = express.Router();
const { 
  getDepartments, 
  getVehicles,
  getUsers, 
  addVehicle, 
  addDepartment,
  updateDepartmentStatus, 
  updateVehicleStatus  
} = require('../controllers/masterController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET Routes
router.get('/departments', verifyToken, getDepartments);
router.get('/vehicles', verifyToken, getVehicles);
router.get('/users', verifyToken, getUsers); // ✅ Yahan fix kiya

// POST Routes
router.post('/vehicles', verifyToken, isAdmin, addVehicle);
router.post('/departments', verifyToken, isAdmin, addDepartment);

// ✅ UPDATE STATUS ROUTES (Department & Vehicle)
router.put('/departments/:id/status', verifyToken, isAdmin, updateDepartmentStatus);
router.put('/vehicles/:id/status', verifyToken, isAdmin, updateVehicleStatus);

module.exports = router;