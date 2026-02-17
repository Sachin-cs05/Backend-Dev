const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// sample post list, abhi memory me hai simple
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

app.get('/', function (req, res) {
  // copy banaya so original array ka order direct touch na ho
  const sortedPosts = posts.slice();

  sortedPosts.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  let totalViews = 0;
  for (let i = 0; i < posts.length; i++) {
    totalViews = totalViews + posts[i].views;
  }

  res.render('blog_home', {
    title: 'My Awesome Blog',
    posts: sortedPosts,
    totalPosts: posts.length,
    totalViews: totalViews
  });
});

app.get('/post/:id', function (req, res) {
  const postId = parseInt(req.params.id);
  let foundPost = null;

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      foundPost = posts[i];
      break;
    }
  }

  if (!foundPost) {
    return res.status(404).render('post_not_found', {
      title: '404 - Post Not Found'
    });
  }

  foundPost.views = foundPost.views + 1;

  // related ka basic logic, same tag ho to le lo
  const relatedPosts = [];
  for (let i = 0; i < posts.length; i++) {
    const onePost = posts[i];

    if (onePost.id === foundPost.id) {
      continue;
    }

    let sameTag = false;
    for (let j = 0; j < onePost.tags.length; j++) {
      if (foundPost.tags.includes(onePost.tags[j])) {
        sameTag = true;
        break;
      }
    }

    if (sameTag) {
      relatedPosts.push(onePost);
    }

    if (relatedPosts.length === 3) {
      break;
    }
  }

  res.render('post_single', {
    title: foundPost.title,
    post: foundPost,
    relatedPosts: relatedPosts
  });
});

app.get('/create', function (req, res) {
  res.render('post_create', {
    title: 'Create New Post'
  });
});

app.post('/create', function (req, res) {
  const title = req.body.title;
  const author = req.body.author;
  const content = req.body.content;
  const excerpt = req.body.excerpt;
  const tags = req.body.tags;

  const errors = [];

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

  if (errors.length > 0) {
    return res.render('post_create', {
      title: 'Create New Post',
      errors: errors,
      formData: {
        title: title,
        author: author,
        content: content,
        excerpt: excerpt,
        tags: tags
      }
    });
  }

  let maxId = 0;
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id > maxId) {
      maxId = posts[i].id;
    }
  }

  let tagList = [];
  if (tags && tags.trim() !== '') {
    const rawTags = tags.split(',');
    for (let i = 0; i < rawTags.length; i++) {
      const oneTag = rawTags[i].trim();
      if (oneTag !== '') {
        tagList.push(oneTag);
      }
    }
  }

  const newPost = {
    id: maxId + 1,
    title: title.trim(),
    author: author.trim(),
    date: new Date().toISOString().split('T')[0],
    content: content.trim(),
    excerpt: excerpt.trim(),
    tags: tagList,
    views: 0
  };

  posts.push(newPost);
  res.redirect('/post/' + newPost.id);
});

app.get('/edit/:id', function (req, res) {
  const postId = parseInt(req.params.id);
  let foundPost = null;

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      foundPost = posts[i];
      break;
    }
  }

  if (!foundPost) {
    return res.status(404).render('post_not_found', {
      title: '404 - Post Not Found'
    });
  }

  res.render('post_edit', {
    title: 'Edit: ' + foundPost.title,
    post: foundPost
  });
});

app.post('/edit/:id', function (req, res) {
  const postId = parseInt(req.params.id);
  let foundPost = null;

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      foundPost = posts[i];
      break;
    }
  }

  if (!foundPost) {
    return res.status(404).render('post_not_found', {
      title: '404 - Post Not Found'
    });
  }

  const title = req.body.title;
  const author = req.body.author;
  const content = req.body.content;
  const excerpt = req.body.excerpt;
  const tags = req.body.tags;

  const errors = [];

  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  if (!author || author.trim() === '') {
    errors.push('Author is required');
  }
  if (!content || content.trim() === '') {
    errors.push('Content is required');
  }
  if (!excerpt || excerpt.trim() === '') {
    errors.push('Excerpt is required');
  }

  if (errors.length > 0) {
    return res.render('post_edit', {
      title: 'Edit: ' + foundPost.title,
      post: foundPost,
      errors: errors
    });
  }

  let tagList = [];
  if (tags && tags.trim() !== '') {
    const rawTags = tags.split(',');
    for (let i = 0; i < rawTags.length; i++) {
      const oneTag = rawTags[i].trim();
      if (oneTag !== '') {
        tagList.push(oneTag);
      }
    }
  }

  foundPost.title = title.trim();
  foundPost.author = author.trim();
  foundPost.content = content.trim();
  foundPost.excerpt = excerpt.trim();
  foundPost.tags = tagList;

  res.redirect('/post/' + foundPost.id);
});

app.post('/delete/:id', function (req, res) {
  const postId = parseInt(req.params.id);
  let removeIndex = -1;

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      removeIndex = i;
      break;
    }
  }

  if (removeIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  posts.splice(removeIndex, 1);
  res.redirect('/');
});

app.get('/api/posts', function (req, res) {
  res.json(posts);
});

app.get('/api/posts/:id', function (req, res) {
  const postId = parseInt(req.params.id);
  let foundPost = null;

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].id === postId) {
      foundPost = posts[i];
      break;
    }
  }

  if (!foundPost) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(foundPost);
});

app.get('/search', function (req, res) {
  const query = req.query.q || '';
  const q = String(query).toLowerCase();
  const searchResults = [];

  for (let i = 0; i < posts.length; i++) {
    const onePost = posts[i];
    const inTitle = onePost.title.toLowerCase().includes(q);
    const inContent = onePost.content.toLowerCase().includes(q);
    const inAuthor = onePost.author.toLowerCase().includes(q);

    if (inTitle || inContent || inAuthor) {
      searchResults.push(onePost);
    }
  }

  res.render('blog_search', {
    title: 'Search Results for "' + query + '"',
    query: query,
    results: searchResults,
    count: searchResults.length
  });
});

app.use(function (req, res) {
  res.status(404).render('blog_404', {
    title: '404 - Page Not Found'
  });
});

const PORT = 3005;
app.listen(PORT, function () {
  console.log('Blog server running on http://localhost:' + PORT);
  console.log('Routes: /, /post/:id, /create, /edit/:id, /search, /api/posts');
});

module.exports = app;
