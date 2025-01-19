const express = require('express');
const { verifyToken } = require('../config/jwt-config');
const { addSlots } = require('../controllers/slot-controller');
const router = express.Router();
router.post('/slots', verifyToken, addSlots);
module.exports = router;