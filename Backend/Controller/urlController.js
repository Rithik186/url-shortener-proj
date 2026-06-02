const Url = require('../Models/Url');
const crypto = require('crypto');

// Utility to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

// @desc    Shorten a URL
// @route   POST /api/urls/shorten
// @access  Private
exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    const userId = req.user._id;

    if (!originalUrl) {
      return res.status(400).json({ success: false, message: 'Please provide a URL' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid URL format' });
    }

    let shortCode;

    // Check if custom alias is provided
    if (customAlias) {
      // Validate custom alias format (alphanumeric and dashes/underscores)
      const aliasRegex = /^[a-zA-Z0-9_-]+$/;
      if (!aliasRegex.test(customAlias)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Custom alias can only contain letters, numbers, hyphens, and underscores' 
        });
      }

      // Check if custom alias is already in use
      const existingAlias = await Url.findOne({ shortCode: customAlias });
      if (existingAlias) {
        return res.status(400).json({ success: false, message: 'Custom alias is already in use' });
      }
      shortCode = customAlias;
    } else {
      // Generate a unique 6-character short code
      let isUnique = false;
      while (!isUnique) {
        shortCode = crypto.randomBytes(3).toString('hex');
        const existing = await Url.findOne({ shortCode });
        if (!existing) {
          isUnique = true;
        }
      }
    }

    // Parse expiry date if provided
    let parsedExpiry = null;
    if (expiresAt) {
      parsedExpiry = new Date(expiresAt);
      if (isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid expiration date format' });
      }
      if (parsedExpiry < new Date()) {
        return res.status(400).json({ success: false, message: 'Expiration date must be in the future' });
      }
    }

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      user: userId,
      expiresAt: parsedExpiry,
    });

    res.status(201).json({
      success: true,
      url: newUrl,
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all URLs for a user
// @route   GET /api/urls
// @access  Private
exports.getUserUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, urls });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete a URL
// @route   DELETE /api/urls/:id
// @access  Private
exports.deleteUrl = async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    // Make sure user owns the URL
    if (url.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await Url.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'URL deleted' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Redirect short code to original URL
// @route   GET /:shortCode
// @access  Public
exports.redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).send(`
        <html>
          <head><title>URL Not Found</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>404 - Link Not Found</h1>
            <p>The shortened link you are trying to access does not exist.</p>
            <a href="/">Go to Sniplink</a>
          </body>
        </html>
      `);
    }

    // Check if expired
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.status(410).send(`
        <html>
          <head><title>Link Expired</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1>Link Expired</h1>
            <p>This shortened link has expired and is no longer available.</p>
            <a href="/">Go to Sniplink</a>
          </body>
        </html>
      `);
    }

    // Increment clicks and record visit timestamp
    url.clicks += 1;
    url.visits.push({ timestamp: new Date() });
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
