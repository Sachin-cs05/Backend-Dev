// Problem 6: Build a simple blog with routes for listing posts, viewing individual posts, and creating new posts

const express = require('express');
const app = express();
const path = require('path');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sample blog posts data (in-memory)
let posts = [
  {
    id: 1,
    title: 'Getting Started with Node.js',
    author: 'John Doe',
    date: '2025-01-15',
    content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows developers to use JavaScript for server-side scripting. This is a great starting point for beginners.',
    excerpt: 'Learn the basics of Node.js and start your journey into server-side JavaScript development.',
    tags: ['Node.js', 'JavaScript', 'Backend'],
    views: 245
  },
  {
    id: 2,
    title: 'Express.js Tutorial for Beginners',
    author: 'Jane Smith',
    date: '2025-01-12',
    content: 'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. In this tutorial, we\'ll explore the fundamentals.',
    excerpt: 'Master Express.js and build powerful web applications with ease.',
    tags: ['Express', 'Web Framework', 'Tutorial'],
    views: 189
  },
  {
    id: 3,
    title: 'EJS Templating Engine Guide',
    author: 'Bob Johnson',
    date: '2025-01-10',
    content: 'EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. It is useful when you want to include some values to an HTML template.',
    excerpt: 'Discover how to use EJS for dynamic HTML generation in your Express applications.',
    tags: ['EJS', 'Templating', 'Frontend'],
    views: 156
  }
];

// Route: Homepage - Display all blog posts
app.get('/', (req, res) => {
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.render('blog_home', {
    title: 'My Awesome Blog',
    posts: sortedPosts,
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0)
  });
});

// Route: View individual post
app.get('/post/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).render('post_not_found', {
      title: '404 - Post Not Found'
    });
  }
  
  // Increment view count
  post.views++;
  
  // Get related posts (same tags)
  const relatedPosts = posts
    .filter(p => p.id !== post.id && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3);
  
  res.render('post_single', {
    title: post.title,
    post: post,
    relatedPosts: relatedPosts
  });
});

// Route: Create new post - Display form
app.get('/create', (req, res) => {
  res.render('post_create', {
    title: 'Create New Post'
  });
});

// Route: Handle form submission - Create new post
app.post('/create', (req, res) => {
  const { title, author, content, excerpt, tags } = req.body;
  const errors = [];

  // Validation
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!author || author.trim() === '') {
    errors.push('Author name is required');
  }
  
  if (!content || content.trim() === '') {
    errors.push('Post content is required');
  }
  
  if (!excerpt || excerpt.trim() === '') {
    errors.push('Excerpt is required');
  }

  // If there are errors, re-render the form with errors
  if (errors.length > 0) {
    return res.render('post_create', {
      title: 'Create New Post',
      errors: errors,
      formData: { title, author, content, excerpt, tags }
    });
  }

  // Create new post
  const newPost = {
    id: Math.max(...posts.map(p => p.id), 0) + 1,
    title: title.trim(),
    author: author.trim(),
    date: new Date().toISOString().split('T')[0],
    content: content.trim(),
    excerpt: excerpt.trim(),
    tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
    views: 0
  };

  posts.push(newPost);

  // Redirect to the new post
  res.redirect(`/post/${newPost.id}`);
});

// Route: Edit post - Display edit form
app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).render('post_not_found', {
      title: '404 - Post Not Found'
    });
  }
  
  res.render('post_edit', {
    title: `Edit: ${post.title}`,
    post: post
  });
});

// Route: Handle post update
app.post('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).render('post_not_found', {
      title: '404 - Post Not Found'
    });
  }
  
  const { title, author, content, excerpt, tags } = req.body;
  const errors = [];

  if (!title || title.trim() === '') errors.push('Title is required');
  if (!author || author.trim() === '') errors.push('Author is required');
  if (!content || content.trim() === '') errors.push('Content is required');
  if (!excerpt || excerpt.trim() === '') errors.push('Excerpt is required');

  if (errors.length > 0) {
    return res.render('post_edit', {
      title: `Edit: ${post.title}`,
      post: post,
      errors: errors
    });
  }

  // Update post
  post.title = title.trim();
  post.author = author.trim();
  post.content = content.trim();
  post.excerpt = excerpt.trim();
  post.tags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  res.redirect(`/post/${post.id}`);
});

// Route: Delete post
app.post('/delete/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  posts.splice(index, 1);
  res.redirect('/');
});

// Route: API - Get all posts as JSON
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Route: API - Get single post as JSON
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
});

// Route: Search posts
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  
  const searchResults = posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase()) ||
    post.author.toLowerCase().includes(query.toLowerCase())
  );
  
  res.render('blog_search', {
    title: `Search Results for "${query}"`,
    query: query,
    results: searchResults,
    count: searchResults.length
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('blog_404', {
    title: '404 - Page Not Found'
  });
});

// Start server
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Blog server running on http://localhost:${PORT}`);
  console.log(`
  Available routes:
  GET  /                  - View all posts
  GET  /post/:id          - View single post
  GET  /create            - Create new post form
  POST /create            - Submit new post
  GET  /edit/:id          - Edit post form
  POST /edit/:id          - Update post
  POST /delete/:id        - Delete post
  GET  /search?q=query    - Search posts
  GET  /api/posts         - Get all posts (JSON)
  GET  /api/posts/:id     - Get single post (JSON)
  `);
});

module.exports = app;
