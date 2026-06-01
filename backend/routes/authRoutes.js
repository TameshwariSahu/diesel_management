// const express = require('express');
// const router = express.Router();
// const { login } = require('../controllers/authController');

// router.post('/login', login);
// router.get('/verify', verifyToken, (req, res) => {
//   // If verifyToken middleware passes, we are good
//   res.json({ valid: true, user: req.user });
// });
// module.exports = router;
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
// ✅ ADD THIS LINE: Import the verifyToken middleware
const { verifyToken } = require('../middleware/auth'); 

router.post('/login', login);

router.get('/verify', verifyToken, (req, res) => {
  // If verifyToken middleware passes, we are good
  res.json({ valid: true, user: req.user });
});

module.exports = router;