const express = require('express');
const { sendContactMessage } = require('../Controller/contactController');

const router = express.Router();

router.post('/', sendContactMessage);

module.exports = router;
