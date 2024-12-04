const express = require('express');
const { addShare } = require('../controllers/shareController');
const router = express.Router();

router.post('/share', addShare);

module.exports = router;
