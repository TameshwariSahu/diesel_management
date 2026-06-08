//  const db = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.login = (req, res) => {
//   const { sapId, password } = req.body; 

//   const cleanSapId = parseInt(sapId, 10); 

//   const sql = "SELECT * FROM employees WHERE sap_id = ?";

//   db.query(sql, [cleanSapId], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     console.log("Found user:", results.length > 0 ? results[0].name : "None");

//     if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

//     const user = results[0];
// if (user.password === password) {
//   const token = jwt.sign(
//     {
//       id: user.id,
//       role: user.role,
//       department_id: user.dept_id,
//       username: user.name
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: '8h' }
//   );
//   return res.json({
//     token,
//     user: {
//       id: user.id,
//       name: user.name,
//       role: user.role,
//       department_id: user.dept_id,
//       sap_id: user.sap_id
//     }
//   });
// } else {
//   return res.status(401).json({ message: "Invalid credentials" });
// }
//   });
// };

const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { sapId, password, expectedRole } = req.body; 

  const cleanSapId = String(sapId || "").trim();

  if (!/^\d{8}$/.test(cleanSapId)) {
    return res.status(400).json({ message: "SAP ID must be exactly 8 digits." });
  }

  const sql = "SELECT * FROM employees WHERE sap_id = ?";

  db.query(sql, [cleanSapId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];

    const storedPassword = user.password || '';
    const isHashedPassword = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');
    const passwordMatches = isHashedPassword
      ? bcrypt.compareSync(password, storedPassword)
      : storedPassword === password;

    if (passwordMatches) {
      if (expectedRole && user.role !== expectedRole) {
        return res.status(403).json({
          message: expectedRole === "admin"
            ? "These credentials are not allowed for admin login."
            : "These credentials are not allowed for department login."
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          department_id: user.dept_id, // ✅ FIXED: Changed to user.dept_id
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      
      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          department_id: user.dept_id, // ✅ FIXED: Changed to user.dept_id
          sap_id: user.sap_id
        }
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
};
