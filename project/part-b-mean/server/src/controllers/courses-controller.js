const Course = require("../models/Course");

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const { title, category, description, level, format, durationWeeks, language, videoTitle, videoUrl } =
      req.body || {};

    if (!title || !category) {
      return res.status(400).json({ message: "title and category are required" });
    }

    const created = await Course.create({
      title,
      category,
      description,
      level,
      format,
      durationWeeks,
      language,
      videoTitle,
      videoUrl,
    });

    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};
