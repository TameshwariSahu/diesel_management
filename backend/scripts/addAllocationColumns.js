const db = require("../config/db");

const columns = [
  {
    name: "authorized_by",
    sql: "ALTER TABLE diesel_allocations ADD COLUMN authorized_by varchar(100) DEFAULT NULL AFTER closing_reading"
  },
  {
    name: "remarks",
    sql: "ALTER TABLE diesel_allocations ADD COLUMN remarks text DEFAULT NULL AFTER authorized_by"
  },
  {
    name: "change_reason",
    sql: "ALTER TABLE diesel_allocations ADD COLUMN change_reason text DEFAULT NULL AFTER status"
  },
  {
    name: "modified_by",
    sql: "ALTER TABLE diesel_allocations ADD COLUMN modified_by varchar(100) DEFAULT NULL AFTER change_reason"
  },
  {
    name: "modified_date",
    sql: "ALTER TABLE diesel_allocations ADD COLUMN modified_date timestamp NULL DEFAULT NULL AFTER modified_by"
  }
];

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => (err ? reject(err) : resolve(result)));
  });

const run = async () => {
  try {
    const [databaseRow] = await query("SELECT DATABASE() AS dbName");
    const dbName = databaseRow.dbName;

    for (const column of columns) {
      const existing = await query(
        `
          SELECT COLUMN_NAME
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = ?
            AND TABLE_NAME = 'diesel_allocations'
            AND COLUMN_NAME = ?
        `,
        [dbName, column.name]
      );

      if (existing.length > 0) {
        console.log(`Column ${column.name} already exists, skipping`);
        continue;
      }

      await query(column.sql);
      console.log(`Added column ${column.name}`);
    }

    console.log("Allocation columns are ready.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to add allocation columns:", err);
    process.exit(1);
  }
};

run();
