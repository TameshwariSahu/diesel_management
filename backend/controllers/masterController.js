const db = require('../config/db');

//Get All Departments
exports.getDepartments = (req, res) => {
  db.query('SELECT * FROM departments WHERE status = "active"', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Get All Users (For Dropdown)
exports.getUsers = (req, res) => {
  db.query('SELECT id, username, full_name FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getVehicles = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const dataSql = `
    SELECT v.*, d.dept_name 
    FROM vehicles v
    LEFT JOIN departments d ON v.department_id = d.id
    ORDER BY v.id DESC LIMIT ? OFFSET ?
  `;
  const countSql = "SELECT COUNT(*) as total FROM vehicles";

  db.query(dataSql, [limit, offset], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(countSql, (err2, countRes) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({
        data: results,
        totalPages: Math.ceil(countRes[0].total / limit),
        currentPage: page
      });
    });
  });
};
exports.addVehicle = (req, res) => {
  const { reg_no, vehicle_type, department_id, driver_name, tank_capacity, status } = req.body;

  const regNoRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
  if (!regNoRegex.test(reg_no)) {
    return res.status(400).json({ message: "Invalid Vehicle Registration No format." });
  }
  const checkSql = "SELECT id FROM vehicles WHERE reg_no = ?";
  
  db.query(checkSql, [reg_no], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error checking vehicle" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Vehicle with this Registration No already exists!" });
    }

    const insertSql = `
      INSERT INTO vehicles (reg_no, vehicle_type, department_id, driver_name, tank_capacity, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [reg_no, vehicle_type, department_id, driver_name, tank_capacity, status], (err, result) => {
      if (err) {
        console.error("Insert Vehicle Error:", err);
        return res.status(500).json({ message: "Error adding vehicle" });
      }
      res.json({ message: "Vehicle added successfully", id: result.insertId });
    });
  });
};

exports.updateDepartmentStatus = (req, res) => {
  const { status } = req.body; 
  const { id } = req.params;   

  const sql = "UPDATE departments SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Status Update Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Status updated", status });
  });
};

exports.updateVehicleStatus = (req, res) => {
  const { status } = req.body; // 'active' or 'inactive'
  const { id } = req.params;   // Vehicle ka ID

  const sql = "UPDATE vehicles SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Vehicle Status Update Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Vehicle status updated successfully" });
  });
};

exports.addDepartment = (req, res) => {
  const { dept_name, section_name, incharge_name, contact, status } = req.body;

  if (contact && !/^\d{10}$/.test(contact)) {
    return res.status(400).json({ message: "Contact number must be exactly 10 digits." });
  }

  const sql = `
    INSERT INTO departments (dept_name, section_name, incharge_name, contact, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    dept_name,
    section_name || null,
    incharge_name || null,
    contact || null,
    status || 'active'
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Department Insert Error:", err);
      return res.status(500).json({ message: "Error adding department" });
    }
    res.json({ message: "Department added successfully", id: result.insertId });
  });
};