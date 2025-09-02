const express = require("express");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const User = require("../modules/User.js");
require("dotenv").config();

const router = express.Router();

// Initialize Firebase using env vars instead of JSON
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'), // 🔥 important for multiline
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
  }),
});


// Google Signup/Login Route
router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { uid, name, email } = decoded;

    // check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // create new user
      user = new User({
        name: name || "Google User",
        email,
        DOB: null
      });
      await user.save();
    }

    // create JWT for your app
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
