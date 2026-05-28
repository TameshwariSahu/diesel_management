// backend/scripts/hashPasswords.js
const db = require("../config/db");
const bcrypt = require("bcryptjs");

db.query("SELECT id, password FROM users", async (err, users) => {
  if (err) {
    console.error("Fetch error:", err);
    process.exit(1);
  }

  for (const u of users) {
    // already hashed? (bcrypt hashes usually start with $2a$ or $2b$)
    if (u.password && (u.password.startsWith("$2a$") || u.password.startsWith("$2b$"))) {
      console.log(`User ${u.id} already hashed, skipping`);
      continue;
    }

    const hashed = await bcrypt.hash(u.password, 10);

    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashed, u.id],
        (e) => (e ? reject(e) : resolve())
      );
    });

    console.log(`Hashed password for user ${u.id}`);
  }

  console.log("✅ Done. All plain-text passwords converted to bcrypt hashes.");
  process.exit(0);
});