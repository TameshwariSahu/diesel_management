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
          AND TABLE_NAME = 'departments'
          AND COLUMN_NAME = 'incharge_name'
      `,
      [dbName]
    );

    if (existing.length > 0) {
      console.log("Column incharge_name already exists, skipping");
      process.exit(0);
    }

    await query("ALTER TABLE departments ADD COLUMN incharge_name varchar(100) DEFAULT NULL AFTER incharge_id");
    console.log("Added departments.incharge_name");
    process.exit(0);
  } catch (err) {
    console.error("Failed to add departments.incharge_name:", err);
    process.exit(1);
  }
};

run();
