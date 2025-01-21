const express = require('express');
const { verifyToken } = require('../middleware/jwt-middleware');
const { addSlots } = require('../controllers/slot-controller');
const router = express.Router();
router.post('/:id', verifyToken, addSlots);
module.exports = router;