const express = require("express");
const { loginMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginMiddleware, (req, res) => {
  res
    .status(200)
    .json({ message: "Login successful", token: res.locals.token });
});

module.exports = router;
