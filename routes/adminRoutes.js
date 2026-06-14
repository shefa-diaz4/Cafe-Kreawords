const express = require('express');
const router = express.Router();
const { login, getAllData } = require('../controllers/adminController');

router.post('/login', login);
router.get('/data', getAllData);

module.exports = router;
