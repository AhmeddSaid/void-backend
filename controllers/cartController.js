const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // If no cart exists, return empty items instead of 404
    return res.json({ cartItems: [] });
  }

  res.json(cart);
});

// @desc    Sync/Update user cart
// @route   POST /api/cart
// @access  Private
const syncCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    // Update existing cart
    cart.cartItems = cartItems;
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } else {
    // Create new cart
    const newCart = await Cart.create({
      user: req.user._id,
      cartItems: cartItems,
    });
    res.status(201).json(newCart);
  }
});

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (cart) {
        cart.cartItems = [];
        await cart.save();
    }
    
    res.json({ message: "Cart cleared" });
});

module.exports = {
  getCart,
  syncCart,
  clearCart
};
