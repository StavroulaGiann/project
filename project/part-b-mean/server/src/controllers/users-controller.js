const User = require("../models/User");

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const created = await User.create({ name, email });
    res.status(201).json(created);
  } catch (err) {
    // duplicate email
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    next(err);
  }
};
