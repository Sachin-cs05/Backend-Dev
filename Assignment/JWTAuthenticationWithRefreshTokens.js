const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const ACCESS_SECRET = 'access-secret';
const REFRESH_SECRET = 'refresh-secret';

const users = [
  { id: 1, username: 'john', password: 'password123', role: 'user' }
];
const refreshTokens = new Set();

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  refreshTokens.add(token);
  return token;
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (item) => item.username === username && item.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials.'
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return res.status(200).json({
    message: 'Login successful.',
    accessToken,
    refreshToken
  });
});

app.post('/token/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token is required.'
    });
  }

  if (!refreshTokens.has(refreshToken)) {
    return res.status(403).json({
      message: 'Invalid refresh token.'
    });
  }

  try {
    const user = jwt.verify(refreshToken, REFRESH_SECRET);
    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken
    });
  } catch (error) {
    refreshTokens.delete(refreshToken);
    return res.status(403).json({
      message: 'Refresh token expired or invalid.'
    });
  }
});

app.post('/logout', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      message: 'Refresh token is required.'
    });
  }

  refreshTokens.delete(refreshToken);

  return res.status(200).json({
    message: 'Logged out successfully.'
  });
});

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access token missing.'
    });
  }

  jwt.verify(token, ACCESS_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({
        message: 'Invalid or expired access token.'
      });
    }

    req.user = user;
    next();
  });
}

app.get('/protected', authenticateAccessToken, (req, res) => {
  return res.status(200).json({
    message: 'Protected data accessed successfully.',
    user: req.user
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Problem 4 server running on port ${PORT}`);
});
