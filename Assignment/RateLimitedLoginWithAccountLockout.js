const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const users = [];

const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 60 * 1000;
const LOCK_MS = 30 * 60 * 1000;

function checkLoginAttempts(email) {
  const attempt = loginAttempts.get(email);

  if (!attempt) {
    return { allowed: true };
  }

  if (attempt.lockUntil && attempt.lockUntil > Date.now()) {
    return {
      allowed: false,
      message: 'Account is locked. Try again later.',
      lockUntil: attempt.lockUntil
    };
  }

  if (attempt.firstAttemptAt && Date.now() - attempt.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(email);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(email) {
  const now = Date.now();
  const existingAttempt = loginAttempts.get(email);

  if (!existingAttempt || now - existingAttempt.firstAttemptAt > WINDOW_MS) {
    loginAttempts.set(email, {
      count: 1,
      firstAttemptAt: now,
      lockUntil: null
    });
    return;
  }

  existingAttempt.count += 1;

  if (existingAttempt.count >= MAX_ATTEMPTS) {
    existingAttempt.lockUntil = now + LOCK_MS;
  }

  loginAttempts.set(email, existingAttempt);
}

function clearAttempts(email) {
  loginAttempts.delete(email);
}

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const attemptStatus = checkLoginAttempts(email);
    if (!attemptStatus.allowed) {
      return res.status(429).json({
        message: attemptStatus.message,
        lockUntil: new Date(attemptStatus.lockUntil).toISOString()
      });
    }

    const user = users.find((item) => item.email === email);

    if (!user) {
      recordFailedAttempt(email);
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      recordFailedAttempt(email);
      const updatedAttempt = loginAttempts.get(email);

      return res.status(401).json({
        message:
          updatedAttempt && updatedAttempt.lockUntil
            ? 'Too many failed attempts. Account locked for 30 minutes.'
            : 'Invalid email or password.'
      });
    }

    clearAttempts(email);

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error.'
    });
  }
});

async function startServer() {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  users.push({
    id: 1,
    email: 'john@example.com',
    password: hashedPassword
  });

  const PORT = process.env.PORT || 3006;
  app.listen(PORT, () => {
    console.log(`Problem 6 server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start Problem 6 server:', error.message);
});
