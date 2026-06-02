const express = require('express');
const router = express.Router();
const { 
  getDepartments, 
  getVehicles,
  getUsers, 
  addVehicle, 
  addDepartment,
  updateDepartment,
  getEmployees,
  addEmployee,
  updateEmployee,
  getSections,
  addSection,
  updateSectionStatus,
  updateDepartmentStatus, 
  updateVehicleStatus,
  updateEmployeeStatus
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

// UPDATE Routes
router.put('/departments/:id', verifyToken, isAdmin, updateDepartment);
router.put('/employees/:id', verifyToken, isAdmin, updateEmployee);
router.put('/departments/:id/status', verifyToken, isAdmin, updateDepartmentStatus);
router.put('/vehicles/:id/status', verifyToken, isAdmin, updateVehicleStatus);
router.put('/employees/:id/status', verifyToken, isAdmin, updateEmployeeStatus);
router.put('/sections/:id/status', verifyToken, isAdmin, updateSectionStatus);

module.exports = router;
