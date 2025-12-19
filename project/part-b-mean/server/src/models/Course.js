const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    level: { type: String, default: "beginner", trim: true },
    format: { type: String, default: "video", trim: true },
    durationWeeks: { type: Number, default: 4 },
    language: { type: String, default: "en", trim: true },

    videoTitle: { type: String, default: "", trim: true },
    videoUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
