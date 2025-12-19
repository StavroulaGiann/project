const router = require("express").Router();
const c = require("../controllers/courses-controller");

router.get("/", c.getCourses);
router.post("/", c.createCourse);

module.exports = router;
