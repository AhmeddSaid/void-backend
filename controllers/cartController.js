const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");

// @desc    Get user cart

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
    if (cartItems) cart.cartItems = cartItems;
    
    try {
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (saveError) {
        console.error("SYNC CART SAVE ERROR:", saveError);
        res.status(500);
        throw new Error("Failed to save cart: " + saveError.message);
    }
  } else {
    // Create new cart
    const newCart = await Cart.create({
      user: req.user._id,
      cartItems: cartItems
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


// @desc    Update guest cart (Captured email)
// @route   POST /api/cart/guest
// @access  Public
const updateGuestCart = asyncHandler(async (req, res) => {
  const { email, cartItems } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  // 1. Try to find a cart for this guest email
  let cart = await Cart.findOne({ guestEmail: email });

  if (cart) {
    // Update existing guest cart
    cart.cartItems = cartItems;
    // Reset notification flags if they come back and update it
    cart.isAbandonedEmailSent = false;
    
    // If they logged in meanwhile, link it? (Optional, but let's keep it simple)
    await cart.save();
    res.json(cart);
  } else {
    // Create new guest cart
    const newCart = await Cart.create({
      guestEmail: email,
      cartItems: cartItems
    });
    res.status(201).json(newCart);
  }
});

module.exports = {
  getCart,
  syncCart,
  clearCart,
  updateGuestCart
};
