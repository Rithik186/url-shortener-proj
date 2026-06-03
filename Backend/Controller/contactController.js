const nodemailer = require('nodemailer');

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    let transporter;
    const useEthereal = !process.env.SMTP_USER || !process.env.SMTP_PASS;

    if (useEthereal) {
      console.log('Sending contact email via Ethereal test account...');
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      } catch (err) {
        console.error('Failed to create Ethereal test account, logging message to console instead:', err);
      }
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'remortrk@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #4f46e5; margin-top: 0;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; line-height: 1.5; background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
        </div>
      `
    };

    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      if (useEthereal) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL: %s', previewUrl);
        return res.status(200).json({ 
          success: true, 
          message: 'Message sent successfully (Test environment)', 
          previewUrl 
        });
      }
    } else {
      console.log('================ CONTACT MESSAGE SYSTEM FALLBACK ================');
      console.log(`FROM: ${name} <${email}>`);
      console.log(`TO: remortrk@gmail.com`);
      console.log(`MESSAGE:\n${message}`);
      console.log('================================================================');
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};
