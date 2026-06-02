const express = require('express');
const { shortenUrl, getUserUrls, deleteUrl } = require('../Controller/urlController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All URL management routes require authentication
router.route('/shorten').post(protect, shortenUrl);
router.route('/').get(protect, getUserUrls);
router.route('/:id').delete(protect, deleteUrl);

module.exports = router;
