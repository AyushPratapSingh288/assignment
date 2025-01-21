const express = require('express');
const { verifyToken } = require('../middleware/jwt-middleware');
const { bookAppointment } = require('../controllers/appoinment-controller');
const router = express.Router();

router.post('/book/:time/:professorId',verifyToken, bookAppointment);
module.exports = router;