const Enrollment = require("../models/Enrollment");

exports.createEnrollment = async (req, res, next) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ message: "userId and courseId are required" });
    }

    const created = await Enrollment.create({ userId, courseId });
    res.status(201).json(created);
  } catch (err) {
    // unique index conflict (duplicate enrollment)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already enrolled" });
    }
    next(err);
  }
};
