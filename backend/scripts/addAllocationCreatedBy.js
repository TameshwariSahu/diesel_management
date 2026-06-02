const db = require("../config/db");

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => (err ? reject(err) : resolve(result)));
  });

const run = async () => {
  try {
    const [databaseRow] = await query("SELECT DATABASE() AS dbName");
    const dbName = databaseRow.dbName;

    const existing = await query(
      `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
          AND TABLE_NAME = 'diesel_allocations'
          AND COLUMN_NAME = 'created_by'
      `,
      [dbName]
    );

    if (existing.length > 0) {
      console.log("Column created_by already exists, skipping");
      process.exit(0);
    }

    await query("ALTER TABLE diesel_allocations ADD COLUMN created_by int DEFAULT NULL AFTER section_id");
    console.log("Added diesel_allocations.created_by");
    process.exit(0);
  } catch (err) {
    console.error("Failed to add diesel_allocations.created_by:", err);
    process.exit(1);
  }
};

run();
