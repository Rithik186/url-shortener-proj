const express = require('express');
const { shortenUrl, getUserUrls, deleteUrl, getUrlStats, updateUrl, deleteUrlsBulk } = require('../Controller/urlController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public stats page route
router.route('/stats/:shortCode').get(getUrlStats);

// All URL management routes require authentication
router.route('/shorten').post(protect, shortenUrl);
router.route('/').get(protect, getUserUrls);
router.route('/bulk-delete').post(protect, deleteUrlsBulk);
router.route('/:id')
  .delete(protect, deleteUrl)
  .put(protect, updateUrl);

module.exports = router;
