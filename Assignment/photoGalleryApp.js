const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hardcoded gallery data, abhi file/db se nahi
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

app.get('/', function (req, res) {
  res.render('gallery_home', {
    title: 'Photo Gallery',
    galleries: galleries
  });
});

app.get('/gallery/:id', function (req, res) {
  const galleryId = parseInt(req.params.id);
  let foundGallery = null;

  for (let i = 0; i < galleries.length; i++) {
    if (galleries[i].id === galleryId) {
      foundGallery = galleries[i];
      break;
    }
  }

  if (!foundGallery) {
    return res.status(404).render('gallery_404', {
      title: 'Gallery Not Found'
    });
  }

  res.render('gallery_view', {
    title: foundGallery.name + ' Gallery',
    gallery: foundGallery,
    allGalleries: galleries
  });
});

app.get('/gallery/:galleryId/image/:imageId', function (req, res) {
  const galleryId = parseInt(req.params.galleryId);
  const imageId = parseInt(req.params.imageId);

  let foundGallery = null;
  for (let i = 0; i < galleries.length; i++) {
    if (galleries[i].id === galleryId) {
      foundGallery = galleries[i];
      break;
    }
  }

  if (!foundGallery) {
    return res.status(404).json({ error: 'Gallery not found' });
  }

  let foundImage = null;
  for (let j = 0; j < foundGallery.images.length; j++) {
    if (foundGallery.images[j].id === imageId) {
      foundImage = foundGallery.images[j];
      break;
    }
  }

  if (!foundImage) {
    return res.status(404).json({ error: 'Image not found' });
  }

  res.render('image_detail', {
    title: foundImage.title,
    gallery: foundGallery,
    image: foundImage,
    allGalleries: galleries
  });
});

app.get('/api/galleries', function (req, res) {
  res.json(galleries);
});

app.get('/api/galleries/:id', function (req, res) {
  const galleryId = parseInt(req.params.id);
  let foundGallery = null;

  for (let i = 0; i < galleries.length; i++) {
    if (galleries[i].id === galleryId) {
      foundGallery = galleries[i];
      break;
    }
  }

  if (!foundGallery) {
    return res.status(404).json({ error: 'Gallery not found' });
  }

  res.json(foundGallery);
});

const PORT = 3004;
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Gallery Home: http://localhost:' + PORT + '/');
  console.log('View Gallery 1: http://localhost:' + PORT + '/gallery/1');
  console.log('Note: public/images folder me images daalna');
});

module.exports = app;
