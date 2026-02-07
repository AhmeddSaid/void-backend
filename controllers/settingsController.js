const asyncHandler = require("express-async-handler");
const Settings = require("../models/settingsModel");

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();
  res.json(settings);
});

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSettings();

  if (settings) {
    if (req.body.marketing) {
        settings.marketing = { ...settings.marketing, ...req.body.marketing };
    }
    if (req.body.store) {
        settings.store = { ...settings.store, ...req.body.store };
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } else {
    res.status(404);
    throw new Error("Settings not found");
  }
});

module.exports = {
  getSettings,
  updateSettings,
};
