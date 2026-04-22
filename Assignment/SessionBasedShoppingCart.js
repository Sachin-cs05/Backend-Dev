const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.json());

app.use(
  session({
    secret: 'cart-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

const initCart = (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
};

function calculateTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

app.use(initCart);

app.post('/cart/add', (req, res) => {
  const { productId, name, price, quantity = 1 } = req.body;

  if (!productId || !name || typeof price !== 'number' || quantity <= 0) {
    return res.status(400).json({
      message: 'productId, name, valid price, and quantity are required.'
    });
  }

  const existingItem = req.session.cart.find(
    (item) => item.productId === String(productId)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    req.session.cart.push({
      productId: String(productId),
      name,
      price,
      quantity
    });
  }

  return res.status(200).json({
    message: 'Item added to cart.',
    cart: req.session.cart,
    totalPrice: calculateTotal(req.session.cart)
  });
});

app.put('/cart/update/:productId', (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({
      message: 'Quantity must be a non-negative number.'
    });
  }

  const item = req.session.cart.find((cartItem) => cartItem.productId === productId);

  if (!item) {
    return res.status(404).json({
      message: 'Item not found in cart.'
    });
  }

  if (quantity === 0) {
    req.session.cart = req.session.cart.filter(
      (cartItem) => cartItem.productId !== productId
    );
  } else {
    item.quantity = quantity;
  }

  return res.status(200).json({
    message: 'Cart updated successfully.',
    cart: req.session.cart,
    totalPrice: calculateTotal(req.session.cart)
  });
});

app.delete('/cart/remove/:productId', (req, res) => {
  const { productId } = req.params;
  const initialLength = req.session.cart.length;

  req.session.cart = req.session.cart.filter(
    (item) => item.productId !== productId
  );

  if (req.session.cart.length === initialLength) {
    return res.status(404).json({
      message: 'Item not found in cart.'
    });
  }

  return res.status(200).json({
    message: 'Item removed from cart.',
    cart: req.session.cart,
    totalPrice: calculateTotal(req.session.cart)
  });
});

app.delete('/cart/clear', (req, res) => {
  req.session.cart = [];

  return res.status(200).json({
    message: 'Cart cleared successfully.',
    cart: req.session.cart,
    totalPrice: 0
  });
});

app.get('/cart', (req, res) => {
  return res.status(200).json({
    cart: req.session.cart,
    totalPrice: calculateTotal(req.session.cart)
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Problem 2 server running on port ${PORT}`);
});
