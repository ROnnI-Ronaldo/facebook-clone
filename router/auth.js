const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const { check, validationResult } = require("express-validator");

const auth = require("../middlewares/auth");

//@router   GET /api/auth
//@desc     get logged in user
//@access   private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "Invalid user" });
    }

    return res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

//@router   POST /api/auth
//@desc     login user
//@access   public
router.post(
  "/",
  [
    check("email", "Please enter email").not().isEmpty(),
    check("password", "Please enter password").not().isEmpty(),
  ],
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ msg: "Unauthorized user" });
      }

      const userPassword = await bcrypt.compare(password, user.password);
      if (!userPassword) {
        return res.status(401).json({ msg: "Unauthorized user" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw error;

          return res.json(token);
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
