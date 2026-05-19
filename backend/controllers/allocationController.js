const db = require('../config/db');

exports.createAllocation = (req, res) => {
  const { allocation_date, vehicle_reg_no, opening_balance, allocated_diesel, closing_balance, authorized_by, remarks } = req.body;
  
  const user = req.user;

  db.query(
    `INSERT INTO diesel_allocations 
    (allocation_date, vehicle_reg_no, opening_balance, allocated_diesel, closing_balance, 
     authorized_by, remarks, status, modified_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', ?)`,
    [allocation_date, vehicle_reg_no, opening_balance, allocated_diesel, closing_balance, 
     authorized_by, remarks, user.username],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Allocation submitted successfully (Pending Approval)", id: result.insertId });
    }
  );
};

exports.getAllocations = (req, res) => {
  const { role, department_id } = req.user;

  let query = 'SELECT * FROM diesel_allocations ORDER BY allocation_date DESC';
  let params = [];

  if (role === 'department') {
    query = `
      SELECT da.* FROM diesel_allocations da 
      JOIN vehicles v ON da.vehicle_reg_no = v.reg_no 
      WHERE v.department_id = ? 
      ORDER BY da.allocation_date DESC`;
    params = [department_id];
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};