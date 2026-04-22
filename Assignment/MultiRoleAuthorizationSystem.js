const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.json());

app.use(
  session({
    secret: 'auth-secret',
    resave: false,
    saveUninitialized: false
  })
);

const users = [
  { id: 1, username: 'user1', role: 'user' },
  { id: 2, username: 'moderator1', role: 'moderator' },
  { id: 3, username: 'admin1', role: 'admin' }
];
const posts = [];

const roleLevel = {
  user: 1,
  moderator: 2,
  admin: 3
};

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: 'Authentication required.'
    });
  }
  next();
};

const requireRole = (role) => {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user || roleLevel[user.role] < roleLevel[role]) {
      return res.status(403).json({
        message: `Access denied. ${role} role or higher required.`
      });
    }

    next();
  };
};

const isOwnerOrModerator = (req, res, next) => {
  const post = posts.find((item) => item.id === Number(req.params.id));

  if (!post) {
    return res.status(404).json({
      message: 'Post not found.'
    });
  }

  req.post = post;

  if (
    post.userId === req.session.user.id ||
    ['moderator', 'admin'].includes(req.session.user.role)
  ) {
    return next();
  }

  return res.status(403).json({
    message: 'You are not allowed to modify this post.'
  });
};

app.post('/login', (req, res) => {
  const { username } = req.body;
  const user = users.find((item) => item.username === username);

  if (!user) {
    return res.status(404).json({
      message: 'User not found.'
    });
  }

  req.session.user = user;
  return res.status(200).json({
    message: 'Login successful.',
    user
  });
});

app.post('/posts', isAuthenticated, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: 'Title and content are required.'
    });
  }

  const post = {
    id: posts.length + 1,
    title,
    content,
    userId: req.session.user.id,
    createdBy: req.session.user.username
  };

  posts.push(post);

  return res.status(201).json({
    message: 'Post created successfully.',
    post
  });
});

app.put('/posts/:id', isAuthenticated, isOwnerOrModerator, (req, res) => {
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({
      message: 'Provide title or content to update.'
    });
  }

  if (title) {
    req.post.title = title;
  }
  if (content) {
    req.post.content = content;
  }

  return res.status(200).json({
    message: 'Post updated successfully.',
    post: req.post
  });
});

app.delete('/posts/:id', isAuthenticated, requireRole('moderator'), (req, res) => {
  const postIndex = posts.findIndex((item) => item.id === Number(req.params.id));

  if (postIndex === -1) {
    return res.status(404).json({
      message: 'Post not found.'
    });
  }

  const deletedPost = posts.splice(postIndex, 1)[0];

  return res.status(200).json({
    message: 'Post deleted successfully.',
    post: deletedPost
  });
});

app.get('/users', isAuthenticated, requireRole('admin'), (req, res) => {
  return res.status(200).json({
    message: 'User management access granted.',
    users
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Problem 3 server running on port ${PORT}`);
});
