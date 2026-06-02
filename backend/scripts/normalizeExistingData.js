const db = require("../config/db");
const { toTitleCase, normalizeRegNo } = require("../utils/formatters");

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => (err ? reject(err) : resolve(result)));
  });

const normalizeRows = async ({ table, columns }) => {
  const rows = await query(`SELECT id, ${columns.join(", ")} FROM ${table}`);

  for (const row of rows) {
    const sets = [];
    const params = [];

    for (const column of columns) {
      const value = row[column];
      const normalized = column === "reg_no" ? normalizeRegNo(value) : toTitleCase(value);

      if (value !== normalized) {
        sets.push(`${column} = ?`);
        params.push(normalized);
      }
    }

    if (sets.length === 0) continue;

    params.push(row.id);
    await query(`UPDATE ${table} SET ${sets.join(", ")} WHERE id = ?`, params);
    console.log(`Normalized ${table} row ${row.id}`);
  }
};

const run = async () => {
  try {
    await normalizeRows({ table: "departments", columns: ["name"] });
    await normalizeRows({ table: "sections", columns: ["section_name"] });
    await normalizeRows({ table: "employees", columns: ["name"] });
    await normalizeRows({ table: "vehicles", columns: ["reg_no", "vehicle_type", "driver_name"] });
    await normalizeRows({ table: "diesel_allocations", columns: ["authorized_by", "remarks", "change_reason"] });

    console.log("Existing data normalized successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to normalize existing data:", err);
    process.exit(1);
  }
};

run();
