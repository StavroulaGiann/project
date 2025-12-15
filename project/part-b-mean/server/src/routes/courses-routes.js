const router = require("express").Router();

router.get("/", (req, res) => {
  console.log("GET /api/courses hit");
  res.json([]);
});

module.exports = router;

