const db = require('../config/db');

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
    SELECT d.id, d.name, d.status, e.name as incharge_name 
    FROM departments d
    LEFT JOIN employees e ON d.incharge_id = e.id
    WHERE d.status = 'active'
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

  // 1. Validate SAP ID (Must be 7 digits)
  if (!/^\d{7}$/.test(sapId)) {
    return res.status(400).json({ message: "SAP ID must be exactly 7 digits." });
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

    db.query(insertSql, [name, sapId, password, role, deptId, sectionId, contact], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Employee added successfully", id: result.insertId });
    });
  });
};

// // Get All Sections
// exports.getSections = (req, res) => {
//   const sql = `
//     SELECT s.*, d.name as dept_name
//     FROM sections s
//     LEFT JOIN departments d ON s.dept_id = d.id
//   `;
  
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Get All Sections
// exports.getSections = (req, res) => {
//   const sql = `
//     SELECT s.*, d.name as dept_name
//     FROM sections s
//     LEFT JOIN departments d ON s.dept_id = d.id
//   `;
  
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Add Section
// exports.addSection = (req, res) => {
//   const { section_name, dept_id } = req.body;

//   if (!section_name) return res.status(400).json({ message: "Section name is required" });

//   const sql = "INSERT INTO sections (section_name, dept_id) VALUES (?, ?)";
  
//   db.query(sql, [section_name, dept_id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Section added successfully", id: result.insertId });
//   });
// };

// // Get All Sections
// exports.getSections = (req, res) => {
//   const sql = `
//     SELECT s.*, d.name as dept_name
//     FROM sections s
//     LEFT JOIN departments d ON s.dept_id = d.id
//   `;
  
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Add Section
// exports.addSection = (req, res) => {
//   const { section_name, dept_id } = req.body;

//   if (!section_name) return res.status(400).json({ message: "Section name is required" });

//   const sql = "INSERT INTO sections (section_name, dept_id) VALUES (?, ?)";
  
//   db.query(sql, [section_name, dept_id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Section added successfully", id: result.insertId });
//   });
// };

// // Get All Sections
// exports.getSections = (req, res) => {
//   const sql = `
//     SELECT s.*, d.name as dept_name
//     FROM sections s
//     LEFT JOIN departments d ON s.dept_id = d.id
//   `;
  
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Add Section
// exports.addSection = (req, res) => {
//   const { section_name, dept_id } = req.body;

//   if (!section_name) return res.status(400).json({ message: "Section name is required" });

//   const sql = "INSERT INTO sections (section_name, dept_id) VALUES (?, ?)";
  
//   db.query(sql, [section_name, dept_id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Section added successfully", id: result.insertId });
//   });
// };

// // Update Section Status
// // Get All Sections
// exports.getSections = (req, res) => {
//   const sql = `
//     SELECT s.*, d.name as dept_name
//     FROM sections s
//     LEFT JOIN departments d ON s.dept_id = d.id
//   `;
  
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// // Add Section
// exports.addSection = (req, res) => {
//   const { section_name, dept_id } = req.body;

//   if (!section_name) return res.status(400).json({ message: "Section name is required" });

//   const sql = "INSERT INTO sections (section_name, dept_id) VALUES (?, ?)";
  
//   db.query(sql, [section_name, dept_id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Section added successfully", id: result.insertId });
//   });
// };
// // Get All Sections
// exports.getSections = (req, res) => {
//   const sql = `
//     SELECT s.*, d.name as dept_name
//     FROM sections s
//     LEFT JOIN departments d ON s.dept_id = d.id
//   `;
  
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };
// // Add Section
// exports.addSection = (req, res) => {
//   const { section_name, dept_id } = req.body;

//   if (!section_name) return res.status(400).json({ message: "Section name is required" });

//   const sql = "INSERT INTO sections (section_name, dept_id) VALUES (?, ?)";
  
//   db.query(sql, [section_name, dept_id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Section added successfully", id: result.insertId });
//   });
// };

// // Update Section Status
// exports.updateSectionStatus = (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;
  
//   const sql = "UPDATE sections SET status = ? WHERE id = ?";
//   db.query(sql, [status, id], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "Status updated", status });
//   });
// };



// --- DEPARTMENTS ---

// Get Departments (Used to populate dropdowns)
exports.getDepartments = (req, res) => {
  const sql = `
    SELECT d.id, d.name, d.status, e.name as incharge_name 
    FROM departments d
    LEFT JOIN employees e ON d.incharge_id = e.id
    WHERE d.status = 'active'
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

  if (!section_name || !dept_id) {
    return res.status(400).json({ message: "Section Name and Department are required" });
  }

  const sql = "INSERT INTO sections (section_name, dept_id) VALUES (?, ?)";
  
  db.query(sql, [section_name, dept_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Section added successfully", id: result.insertId });
  });
};

// Update Section Status
exports.updateSectionStatus = (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  
  const sql = "UPDATE sections SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Status updated", status });
  });
};