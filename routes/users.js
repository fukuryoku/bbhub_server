const express = require("express");
const router = express.Router({ mergeParams: true });

// const {getUser, deleteUser, updateUser} = require("../handlers/user");
const {updateUser, upateUsersProgress} = require("../handlers/user");

// prefix - /api/profile
router
.route('/:id/progress')
.put(upateUsersProgress)

  // .delete(deleteProduct)
  // .get(getUser)
router
  .route("/:id")
  .put(updateUser)

  ;

module.exports = router;
