const express = require("express");
const router = express.Router({ mergeParams: true });

const {createLesson, getLesson, getMyLessons, deleteLesson, updateLesson} = require("../handlers/lessons");

//
// prefix - /api/users/:id/ecourses/:ecourse_id/lessons/
router.route("/").post(createLesson);
router.route("/").get(getMyLessons);

// prefix - /api/users/:id/ecourses/:ecourse_id/lessons/
router
  .route("/:lesson_id")
  .get(getLesson)
  .delete(deleteLesson)
  .put(updateLesson);

module.exports = router;
