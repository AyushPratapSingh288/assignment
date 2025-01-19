const express = require('express');
const { verifyToken } = require('../config/jwt-config');
const { bookAppointment } = require('../controllers/appoinment-controller');
const router = express.Router();
router.post('/book', verifyToken, bookAppointment);
module.exports = router;