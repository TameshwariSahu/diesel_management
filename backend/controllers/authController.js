const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { sapId, password } = req.body; 

  const sql = "SELECT * FROM employees WHERE sap_id = ?";

  db.query(sql, [sapId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];

    if (user.password === password) {
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, role: user.role, user: user });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
};