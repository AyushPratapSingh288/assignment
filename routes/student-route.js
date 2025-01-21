const express = require('express');
const { verifyToken } = require('../middleware/jwt-middleware');
const { viewSlots } = require('../controllers/student-controller');
const router = express.Router();
router.get('/slots/:professorId', verifyToken, viewSlots);
module.exports = router;