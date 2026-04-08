const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = 'super-secret-demo-key';
const otpStore = new Map();

app.use(express.json());

function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  const tokenParts = authHeader.split(' ');
  const token = tokenParts[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function verifyOtp(req, res, next) {
  const otpCode = req.headers['x-otp-code'];
  const savedOtp = otpStore.get(req.user.userId);

  if (!otpCode) {
    return res.status(401).json({ message: 'OTP is missing' });
  }

  if (!savedOtp) {
    return res.status(401).json({ message: 'OTP not generated' });
  }

  if (savedOtp.code !== otpCode) {
    return res.status(401).json({ message: 'Wrong OTP' });
  }

  if (Date.now() > savedOtp.expiresAt) {
    otpStore.delete(req.user.userId);
    return res.status(401).json({ message: 'OTP expired' });
  }

  otpStore.delete(req.user.userId);
  next();
}

function requireMultiFactorAuth(req, res, next) {
  authenticateJwt(req, res, function () {
    verifyOtp(req, res, next);
  });
}

app.post('/login', function (req, res) {
  const userId = req.body.userId || 'user-101';
  const role = req.body.role || 'admin';
  const token = jwt.sign({ userId: userId, role: role }, JWT_SECRET, {
    expiresIn: '15m'
  });

  res.json({
    message: 'Login successful',
    token: token
  });
});

app.post('/otp', authenticateJwt, function (req, res) {
  const otpCode = '654321';

  otpStore.set(req.user.userId, {
    code: otpCode,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  res.json({
    message: 'OTP generated',
    otpCode: otpCode,
    expiresIn: '5 minutes'
  });
});

app.post('/sensitive/transfer', requireMultiFactorAuth, function (req, res) {
  res.json({
    message: 'Sensitive work done',
    user: req.user.userId,
    amount: req.body.amount || 0
  });
});

const PORT = 3002;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 2 server running on http://localhost:' + PORT);
  });
}

module.exports = {
  app,
  authenticateJwt,
  verifyOtp,
  requireMultiFactorAuth
};
