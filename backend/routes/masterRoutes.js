const express = require('express');
const router = express.Router();
const { 
  getDepartments, 
  getVehicles,
  getUsers, 
  addVehicle, 
  addDepartment,
  getEmployees,
  addEmployee,
  getSections,
  addSection,
  updateSectionStatus,
  updateDepartmentStatus, 
  updateVehicleStatus  
} = require('../controllers/masterController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// GET Routes
router.get('/departments', verifyToken, getDepartments);
router.get('/vehicles', verifyToken, getVehicles);
router.get('/users', verifyToken, getUsers); 
router.get('/employees', verifyToken, getEmployees);
router.get('/sections', verifyToken, getSections);


// POST Routes
router.post('/vehicles', verifyToken, isAdmin, addVehicle);
router.post('/departments', verifyToken, isAdmin, addDepartment);
router.post('/employees', verifyToken, isAdmin, addEmployee);
router.post('/sections', verifyToken, isAdmin, addSection);

// ✅ UPDATE STATUS ROUTES (Department & Vehicle)
router.put('/departments/:id/status', verifyToken, isAdmin, updateDepartmentStatus);
router.put('/vehicles/:id/status', verifyToken, isAdmin, updateVehicleStatus);
router.put('/sections/:id/status', verifyToken, isAdmin, updateSectionStatus);

module.exports = router;