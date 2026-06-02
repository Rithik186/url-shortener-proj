const mongoose = require('mongoose');
const tls = require('tls');

const connectDB = async () => {
  try {
    // Fix for Node.js 22+ OpenSSL 3 compatibility with MongoDB Atlas
    const originalCreateSecureContext = tls.createSecureContext;
    tls.createSecureContext = function (options) {
      if (options) {
        options.secureProtocol = 'TLSv1_2_method';
      }
      return originalCreateSecureContext.call(this, options);
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      tlsInsecure: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
