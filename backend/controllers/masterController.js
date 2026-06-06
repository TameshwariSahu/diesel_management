const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { toTitleCase, normalizeRegNo } = require('../utils/formatters');

const resolveEmployeeId = (employeeId, callback) => {
  if (!employeeId) return callback(null, null);

  if (!/^\d+$/.test(String(employeeId))) {
    return callback({ status: 400, message: "Incharge employee ID must be numeric." });
  }

  db.query("SELECT id FROM employees WHERE id = ?", [employeeId], (err, results) => {
    if (err) return callback({ status: 500, message: "Database error checking incharge." });
    if (results.length === 0) return callback({ status: 400, message: "Incharge employee ID not found." });

    callback(null, Number(employeeId));
  });
};

// exports.getDepartments = (req, res) => {
//   const sql = `
//     SELECT d.*, e.name as incharge_name 
//     FROM departments d
//     LEFT JOIN employees e ON d.incharge_id = e.id
//     WHERE d.status = 'active'
//   `;
  
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };
exports.getDepartments = (req, res) => {
  const sql = `
    SELECT d.id, d.name, d.contact, d.status, d.incharge_id, d.incharge_name as custom_incharge_name,
           COALESCE(d.incharge_name, e.name) as incharge_name
    FROM departments d
    LEFT JOIN employees e ON d.incharge_id = e.id
    ORDER BY d.name ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get All Users (For Dropdowns)
exports.getUsers = (req, res) => {
  const sql = "SELECT id, sap_id, name FROM employees WHERE status = 'active'";
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
exports.getVehicles = (req, res) => {
  try {
    if (req.query.all === 'true') {
      const allSql = `
        SELECT v.*, d.name as dept_name, s.section_name 
        FROM vehicles v
        LEFT JOIN departments d ON v.department_id = d.id
        LEFT JOIN sections s ON v.section_id = s.id
        ORDER BY v.id DESC
      `;

      return db.query(allSql, (err, results) => {
        if (err) {
          console.error("Vehicles SQL Error:", err);
          return res.status(500).json({ error: err.message });
        }

        return res.json(results);
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    // ✅ Debugging SQL
    console.log("Fetching vehicles for page:", page);

    const dataSql = `
      SELECT v.*, d.name as dept_name, s.section_name 
      FROM vehicles v
      LEFT JOIN departments d ON v.department_id = d.id
      LEFT JOIN sections s ON v.section_id = s.id
      ORDER BY v.id DESC LIMIT ? OFFSET ?
    `;
    
    const countSql = "SELECT COUNT(*) as total FROM vehicles";

    db.query(dataSql, [limit, offset], (err, results) => {
      if (err) {
        console.error("Vehicles SQL Error:", err);
        return res.status(500).json({ error: err.message });
      }

      db.query(countSql, (err2, countRes) => {
        if (err2) {
          console.error("Count SQL Error:", err2);
          return res.status(500).json({ error: err2.message });
        }

        res.json({
          data: results,
          totalPages: Math.ceil(countRes[0].total / limit),
          currentPage: page
        });
      });
    });
  } catch (e) {
    console.error("General Vehicles Error:", e);
    return res.status(500).json({ error: e.message });
  }
};
exports.addVehicle = (req, res) => {
  const { reg_no, vehicle_type, department_id, section_id, driver_name, tank_capacity, status } = req.body;
  const cleanRegNo = normalizeRegNo(reg_no);

  const regNoRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
  if (!regNoRegex.test(cleanRegNo)) {
    return res.status(400).json({ message: "Invalid Vehicle Registration No format." });
  }
  const checkSql = "SELECT id FROM vehicles WHERE UPPER(reg_no) = ?";
  
  db.query(checkSql, [cleanRegNo], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error checking vehicle" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Vehicle with this Registration No already exists!" });
    }

    const insertSql = `
      INSERT INTO vehicles (reg_no, vehicle_type, department_id, section_id, driver_name, tank_capacity, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [
      cleanRegNo,
      toTitleCase(vehicle_type),
      department_id,
      section_id || null,
      toTitleCase(driver_name),
      tank_capacity,
      status || 'active'
    ], (err, result) => {
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

exports.updateEmployeeStatus = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: "Invalid employee status." });
  }

  const sql = "UPDATE employees SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Employee Status Update Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res.json({ message: "Employee status updated successfully", status });
  });
};
exports.addDepartment = (req, res) => {
  const { dept_name, contact, incharge_id, incharge_name, status } = req.body;
  const cleanDeptName = toTitleCase(dept_name);
  const cleanInchargeName = toTitleCase(incharge_name);

  if (!cleanDeptName) {
    return res.status(400).json({ message: "Department name is required." });
  }

  if (contact && !/^\d{10}$/.test(contact)) {
    return res.status(400).json({ message: "Contact number must be exactly 10 digits." });
  }

  const checkSql = "SELECT id FROM departments WHERE LOWER(name) = LOWER(?)";

  db.query(checkSql, [cleanDeptName], (err, existing) => {
    if (err) {
      console.error("Department Check Error:", err);
      return res.status(500).json({ message: "Database error checking department" });
    }

    if (existing.length > 0) {
      return res.status(400).json({ message: "Department already exists." });
    }

    const sql = `
      INSERT INTO departments (name, contact, incharge_id, incharge_name, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
      cleanDeptName,
      contact || null,
      incharge_id || null,
      cleanInchargeName || null,
      status || 'active'
    ];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Department Insert Error:", err);
        return res.status(500).json({ message: "Error adding department" });
      }
      res.json({ message: "Department added successfully", id: result.insertId });
    });
  });
};

exports.updateDepartment = (req, res) => {
  const { dept_name, contact, incharge_name } = req.body;
  const { id } = req.params;
  const cleanDeptName = toTitleCase(dept_name);
  const cleanInchargeName = toTitleCase(incharge_name);

  if (!cleanDeptName) {
    return res.status(400).json({ message: "Department name is required." });
  }

  if (contact && !/^\d{10}$/.test(contact)) {
    return res.status(400).json({ message: "Contact number must be exactly 10 digits." });
  }

  const checkSql = "SELECT id FROM departments WHERE LOWER(name) = LOWER(?) AND id <> ?";

  db.query(checkSql, [cleanDeptName, id], (err, existing) => {
    if (err) {
      console.error("Department Update Check Error:", err);
      return res.status(500).json({ message: "Database error checking department" });
    }

    if (existing.length > 0) {
      return res.status(400).json({ message: "Department already exists." });
    }

    const sql = "UPDATE departments SET name = ?, contact = ?, incharge_id = NULL, incharge_name = ? WHERE id = ?";

    db.query(sql, [cleanDeptName, contact || null, cleanInchargeName || null, id], (err, result) => {
      if (err) {
        console.error("Department Update Error:", err);
        return res.status(500).json({ message: "Error updating department" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Department not found." });
      }

      res.json({ message: "Department updated successfully" });
    });
  });
};
// exports.addDepartment = (req, res) => {
//   const { dept_name, section_name, incharge_name, contact, status } = req.body;

//   if (contact && !/^\d{10}$/.test(contact)) {
//     return res.status(400).json({ message: "Contact number must be exactly 10 digits." });
//   }

//   const sql = `
//     INSERT INTO departments (dept_name, section_name, incharge_name, contact, status)
//     VALUES (?, ?, ?, ?, ?)
//   `;

//   const params = [
//     dept_name,
//     section_name || null,
//     incharge_name || null,
//     contact || null,
//     status || 'active'
//   ];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       console.error("Department Insert Error:", err);
//       return res.status(500).json({ message: "Error adding department" });
//     }
//     res.json({ message: "Department added successfully", id: result.insertId });
//   });
// };

// Get All Employees (With Dept & Section Name)
exports.getEmployees = (req, res) => {
  const sql = `
    SELECT e.*, d.name as dept_name, s.section_name
    FROM employees e
    LEFT JOIN departments d ON e.dept_id = d.id
    LEFT JOIN sections s ON e.section_id = s.id
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add New Employee
exports.addEmployee = (req, res) => {
  const { name, sapId, password, role, deptId, sectionId, contact } = req.body;
  const cleanName = toTitleCase(name);

  // 1. Validate SAP ID (Must be 8 digits)
  if (!/^\d{8}$/.test(sapId)) {
    return res.status(400).json({ message: "SAP ID must be exactly 8 digits." });
  }

  if (contact && !/^\d{10}$/.test(contact)) {
    return res.status(400).json({ message: "Contact number must be exactly 10 digits." });
  }

  // 2. Check if SAP ID already exists
  const checkSql = "SELECT id FROM employees WHERE sap_id = ?";
  db.query(checkSql, [sapId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: "SAP ID already exists." });
    }

    // 3. Insert Employee
    const insertSql = `
      INSERT INTO employees (name, sap_id, password, role, dept_id, section_id, contact)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(insertSql, [cleanName, sapId, hashedPassword, role, deptId, sectionId || null, contact], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Employee added successfully", id: result.insertId });
    });
  });
};

exports.updateEmployee = (req, res) => {
  const { name, sapId, password, role, deptId, sectionId, contact } = req.body;
  const { id } = req.params;
  const cleanName = toTitleCase(name);

  if (!cleanName) {
    return res.status(400).json({ message: "Employee name is required." });
  }

  if (!/^\d{8}$/.test(sapId)) {
    return res.status(400).json({ message: "SAP ID must be exactly 8 digits." });
  }

  if (!['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: "Invalid employee role." });
  }

  if (contact && !/^\d{10}$/.test(contact)) {
    return res.status(400).json({ message: "Contact number must be exactly 10 digits." });
  }

  const checkSql = "SELECT id FROM employees WHERE sap_id = ? AND id <> ?";

  db.query(checkSql, [sapId, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(400).json({ message: "SAP ID already exists." });
    }

    const params = [cleanName, sapId, role, deptId || null, sectionId || null, contact || null];
    let updateSql = `
      UPDATE employees
      SET name = ?, sap_id = ?, role = ?, dept_id = ?, section_id = ?, contact = ?
    `;

    if (password) {
      updateSql += ", password = ?";
      params.push(bcrypt.hashSync(password, 10));
    }

    updateSql += " WHERE id = ?";
    params.push(id);

    db.query(updateSql, params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found." });
      }

      res.json({ message: "Employee updated successfully" });
    });
  });
};


// --- DEPARTMENTS ---

// Get Departments (Used to populate dropdowns)
exports.getDepartments = (req, res) => {
  const sql = `
    SELECT d.id, d.name, d.contact, d.status, d.incharge_id, d.incharge_name as custom_incharge_name,
           COALESCE(d.incharge_name, e.name) as incharge_name
    FROM departments d
    LEFT JOIN employees e ON d.incharge_id = e.id
    ORDER BY d.name ASC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// --- SECTIONS ---

// Get All Sections (With Department Name for the table)
exports.getSections = (req, res) => {
  const sql = `
    SELECT s.*, d.name as dept_name
    FROM sections s
    LEFT JOIN departments d ON s.dept_id = d.id
    ORDER BY s.id DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add New Section
exports.addSection = (req, res) => {
  const { section_name, dept_id } = req.body;
  const cleanSectionName = toTitleCase(section_name);

  if (!section_name || !dept_id) {
    return res.status(400).json({ message: "Section Name and Department are required" });
  }

  const sql = "INSERT INTO sections (section_name, dept_id) VALUES (?, ?)";
  
  db.query(sql, [cleanSectionName, dept_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Section added successfully", id: result.insertId });
  });
};

// Update Section Status
exports.updateSectionStatus = (req, res) => {
  res.status(400).json({ message: "Sections do not have a status column in the current database schema." });
};
