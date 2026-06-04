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
    (allocation_date, vehicle_id, department_id, section_id, created_by, opening_reading, closing_reading, authorized_by, remarks, status, modified_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
`;

const params = [
  allocation_date,
  vehicle_id,
  user.department_id,
  section_id || null,
  user.id || null,
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
  const requestedLimit = parseInt(req.query.limit);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 5;
  const offset = (page - 1) * limit;

  const { departmentId, status } = req.query;
  let sql = `
    SELECT da.*, v.reg_no, v.vehicle_type, d.name as department_name, e.name as requested_by_name
    FROM diesel_allocations da
    JOIN vehicles v ON da.vehicle_id = v.id
    LEFT JOIN departments d ON da.department_id = d.id
    LEFT JOIN employees e ON da.created_by = e.id
  `;
  let countSql = "SELECT COUNT(*) as total FROM diesel_allocations da";
  let params = [];
  let countParams = [];
  const where = [];

  if (role !== "admin") {
    where.push("da.department_id = ?");
    params.push(department_id);
    countParams.push(department_id);
  } else if (departmentId && departmentId !== 'all') {
    where.push("da.department_id = ?");
    params.push(departmentId);
    countParams.push(departmentId);
  }

  if (status && status !== 'all') {
    where.push("da.status = ?");
    params.push(status);
    countParams.push(status);
  }

  if (where.length > 0) {
    const whereSql = ` WHERE ${where.join(" AND ")}`;
    sql += whereSql;
    countSql += whereSql;
  }

  sql += " ORDER BY da.allocation_date DESC, da.id DESC LIMIT ? OFFSET ?";
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
