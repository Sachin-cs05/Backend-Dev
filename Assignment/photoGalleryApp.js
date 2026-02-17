// Problem 5: Create a photo gallery using static files and EJS to display images dynamically

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample gallery data
const galleries = [
  {
    id: 1,
    name: 'Nature',
    description: 'Beautiful nature photographs',
    images: [
      { id: 1, title: 'Mountain View', src: '/images/mountain.jpg' },
      { id: 2, title: 'Forest Path', src: '/images/forest.jpg' },
      { id: 3, title: 'Ocean Sunset', src: '/images/sunset.jpg' }
    ]
  },
  {
    id: 2,
    name: 'Urban',
    description: 'City and urban landscapes',
    images: [
      { id: 1, title: 'City Skyline', src: '/images/skyline.jpg' },
      { id: 2, title: 'Street Art', src: '/images/street.jpg' },
      { id: 3, title: 'Night Lights', src: '/images/night.jpg' }
    ]
  },
  {
    id: 3,
    name: 'Animals',
    description: 'Wildlife and pets',
    images: [
      { id: 1, title: 'Lion Pride', src: '/images/lion.jpg' },
      { id: 2, title: 'Eagle Flight', src: '/images/eagle.jpg' },
      { id: 3, title: 'Puppy Love', src: '/images/puppy.jpg' }
    ]
  }
];

// Route: Display all galleries
app.get('/', (req, res) => {
  res.render('gallery_home', {
    title: 'Photo Gallery',
    galleries: galleries
  });
});

// Route: Display specific gallery
app.get('/gallery/:id', (req, res) => {
  const gallery = galleries.find(g => g.id === parseInt(req.params.id));
  
  if (!gallery) {
    return res.status(404).render('gallery_404', {
      title: 'Gallery Not Found'
    });
  }
  
  res.render('gallery_view', {
    title: `${gallery.name} Gallery`,
    gallery: gallery,
    allGalleries: galleries
  });
});

// Route: View single image
app.get('/gallery/:galleryId/image/:imageId', (req, res) => {
  const gallery = galleries.find(g => g.id === parseInt(req.params.galleryId));
  
  if (!gallery) {
    return res.status(404).json({ error: 'Gallery not found' });
  }
  
  const image = gallery.images.find(img => img.id === parseInt(req.params.imageId));
  
  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  res.render('image_detail', {
    title: image.title,
    gallery: gallery,
    image: image,
    allGalleries: galleries
  });
});

// Route: Gallery API (for AJAX)
app.get('/api/galleries', (req, res) => {
  res.json(galleries);
});

app.get('/api/galleries/:id', (req, res) => {
  const gallery = galleries.find(g => g.id === parseInt(req.params.id));
  
  if (!gallery) {
    return res.status(404).json({ error: 'Gallery not found' });
  }
  
  res.json(gallery);
});

// Start server
const PORT = 3004;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Gallery Home: http://localhost:${PORT}/`);
  console.log(`View Gallery 1: http://localhost:${PORT}/gallery/1`);
  console.log(`\nNote: Create an 'images' folder in the 'public' directory and add your images there.`);
  console.log(`Supported image formats: .jpg, .png, .gif, .webp`);
});

module.exports = app;
