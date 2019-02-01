const express = require("express");
const router = express.Router();
const { signup, signin, forgot, reset } = require("../handlers/auth");


router.post("/signup", signup);
router.post("/signin", signin);

router.post("/forgot", forgot);
router.post("/reset", reset);



module.exports = router;
