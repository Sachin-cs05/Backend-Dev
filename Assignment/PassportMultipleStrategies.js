const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.use(
  session({
    secret: 'passport-secret',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

const JWT_SECRET = 'jwt-secret';

const users = [
  { id: 1, username: 'alice', password: 'alice123', email: 'alice@example.com' },
  { id: 2, username: 'bob', password: 'bob123', email: 'bob@example.com' }
];

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((item) => item.id === id);
  done(null, user || false);
});

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const user = users.find((item) => item.username === username);

        if (!user) {
          return done(null, false, { message: 'User not found.' });
        }

        if (user.password !== password) {
          return done(null, false, { message: 'Invalid password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    (payload, done) => {
      const user = users.find((item) => item.id === payload.id);

      if (!user) {
        return done(null, false, { message: 'Invalid token user.' });
      }

      return done(null, user);
    }
  )
);

app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        message: info.message || 'Authentication failed.'
      });
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.status(200).json({
        message: 'Session login successful.',
        authMethod: 'session',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    });
  })(req, res, next);
});

app.post('/auth/api-login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        message: info.message || 'Authentication failed.'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'API login successful.',
      authMethod: 'jwt',
      token
    });
  })(req, res, next);
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      message: 'Session authentication required.'
    });
  }

  return res.status(200).json({
    message: 'Welcome to the dashboard.',
    user: req.user
  });
});

app.get(
  '/api/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.status(200).json({
      message: 'Profile fetched successfully.',
      user: req.user
    });
  }
);

app.get('/auth/methods', (req, res) => {
  return res.status(200).json({
    availableMethods: ['session', 'jwt'],
    routes: {
      sessionLogin: '/auth/login',
      apiLogin: '/auth/api-login'
    }
  });
});

app.use((error, req, res, next) => {
  return res.status(500).json({
    message: error.message || 'Internal server error.'
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Problem 5 server running on port ${PORT}`);
});
