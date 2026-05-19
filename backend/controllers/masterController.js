const db = require('../config/db');

// Get All Departments
exports.getDepartments = (req, res) => {
  db.query('SELECT * FROM departments WHERE status = "active"', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get All Vehicles
exports.getVehicles = (req, res) => {
  db.query(`
    SELECT v.*, d.dept_name 
    FROM vehicles v 
    LEFT JOIN departments d ON v.department_id = d.id 
    WHERE v.status = "active"
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Add New Vehicle
exports.addVehicle = (req, res) => {
  const { reg_no, vehicle_type, department_id, driver_name, tank_capacity } = req.body;
  db.query(
    'INSERT INTO vehicles (reg_no, vehicle_type, department_id, driver_name, tank_capacity) VALUES (?, ?, ?, ?, ?)',
    [reg_no, vehicle_type, department_id, driver_name, tank_capacity],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Vehicle added successfully", id: result.insertId });
    }
  );
};