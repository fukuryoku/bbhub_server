const express = require("express");
const router = express.Router({ mergeParams: true });

const {createEcourse, getEcourse, deleteEcourse, updateEcourse, getMyEcourses} = require("../handlers/ecourses");

// prefix - /api/users/:id/ecourses
router.route("/").post(createEcourse);
router.route("/").get(getMyEcourses);

// prefix - /api/users/:id/ecourses/
router
  .route("/:ecourse_id")
  .get(getEcourse)
  .delete(deleteEcourse)
  .put(updateEcourse);

module.exports = router;
