const db = require("../config/db");
const { toTitleCase } = require("../utils/formatters");

exports.createAllocation = (req, res) => {
  const {
    allocation_date,
    vehicle_id,
    section_id,
    opening_reading,
    closing_reading,
    authorized_by,
    remarks
  } = req.body;

  const user = req.user;
  const openingReading = Number(opening_reading);
  const closingReading = Number(closing_reading);

  if (!Number.isFinite(openingReading) || !Number.isFinite(closingReading)) {
    return res.status(400).json({ message: "Opening and closing readings must be valid numbers." });
  }

  if (closingReading <= openingReading) {
    return res.status(400).json({ message: "Closing reading must be greater than opening reading." });
  }

const sql = `
  INSERT INTO diesel_allocations 
    (allocation_date, vehicle_id, department_id, section_id, opening_reading, closing_reading, authorized_by, remarks, status, modified_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
`;

const params = [
  allocation_date,
  vehicle_id,
  user.department_id,
  section_id || null,
  openingReading,
  closingReading,
  toTitleCase(authorized_by || 'N/A'),
  remarks ? toTitleCase(remarks) : null,
  user.name || null
];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("❌ Allocation Insert Error:", err);
      return res.status(500).json({
        message: "Allocation insert failed",
        sqlMessage: err.sqlMessage
      });
    }
    return res.json({
      message: "Allocation submitted successfully (Pending Approval)",
      id: result.insertId
    });
  });
};

exports.getAllocations = (req, res) => {
  const { role, department_id } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = 5; 
  const offset = (page - 1) * limit;

  let sql = "SELECT da.*, v.reg_no, v.vehicle_type FROM diesel_allocations da JOIN vehicles v ON da.vehicle_id = v.id";
  let countSql = "SELECT COUNT(*) as total FROM diesel_allocations da";
  let params = [];
  let countParams = [];

  if (role !== "admin") {
    sql += " WHERE da.department_id = ?";
    countSql += " WHERE da.department_id = ?";
    params = [department_id];
    countParams = [department_id];
  }

  sql += " ORDER BY da.allocation_date DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(countSql, countParams, (err2, countRes) => {
      if (err2) return res.status(500).json({ error: err2.message });

      const total = countRes[0].total;
      res.json({
        data: results,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    });
  });
};

exports.updateStatus = (req, res) => {
  const { status, change_reason } = req.body;
  const { id } = req.params;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.query(
    'UPDATE diesel_allocations SET status=?, change_reason=?, modified_by=?, modified_date=NOW() WHERE id=?',
    [status, change_reason ? toTitleCase(change_reason) : null, req.user.name || null, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'Status updated successfully' });
    }
  );
};
