const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'cart-secret',
    resave: false,
    saveUninitialized: true
  })
);

function readGuestCart(req) {
  const guestCart = req.cookies.guestCart;

  if (!guestCart) {
    return [];
  }

  try {
    return JSON.parse(guestCart);
  } catch (err) {
    return [];
  }
}

function saveGuestCart(res, cart) {
  res.cookie('guestCart', JSON.stringify(cart), {
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

app.get('/', function (req, res) {
  res.send(`
    <h2>Cart System</h2>
    <p>Use POST /add-to-cart with {"item":"Book"}</p>
    <p>Use POST /login to login</p>
    <p>Use GET /cart to see cart data</p>
  `);
});

app.post('/add-to-cart', function (req, res) {
  const item = req.body.item;

  if (!item) {
    return res.json({ message: 'Item is required' });
  }

  if (req.session.user) {
    req.session.cart = req.session.cart || [];
    req.session.cart.push(item);
    return res.json({
      message: 'Item added in user cart',
      cart: req.session.cart
    });
  }

  const guestCart = readGuestCart(req);
  guestCart.push(item);
  saveGuestCart(res, guestCart);

  res.json({
    message: 'Item added in guest cart',
    cart: guestCart
  });
});

app.post('/login', function (req, res) {
  const username = req.body.username || 'demoUser';
  const guestCart = readGuestCart(req);

  req.session.user = {
    username: username
  };

  req.session.cart = req.session.cart || [];

  for (let i = 0; i < guestCart.length; i++) {
    req.session.cart.push(guestCart[i]);
  }

  res.clearCookie('guestCart');

  res.json({
    message: 'Login successful and cart migrated',
    cart: req.session.cart
  });
});

app.get('/cart', function (req, res) {
  if (req.session.user) {
    return res.json({
      type: 'authenticated',
      user: req.session.user.username,
      cart: req.session.cart || []
    });
  }

  res.json({
    type: 'anonymous',
    cart: readGuestCart(req)
  });
});

const PORT = 4005;

if (require.main === module) {
  app.listen(PORT, function () {
    console.log('Exercise 5 running on http://localhost:' + PORT);
  });
}

module.exports = app;
