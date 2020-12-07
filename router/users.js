const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/Users");

//@router   POST api/users
//@desc     register new user
//@access   public
router.post(
  "/",
  [
    check("first_name", "Please enter first name").not().isEmpty(),
    check("surname", "Please enter surname").not().isEmpty(),
    check("email", "Please enter email").not().isEmpty(),
    check("password", "Please enter a password with min 8 characters")
      .not()
      .isEmpty()
      .isLength({ min: 8 }),
    check("date_of_birth", "Please enter date of birth").not().isEmpty(),
    check("garden", "Please enter garden").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const {
      first_name,
      surname,
      email,
      password,
      date_of_birth,
      garden,
    } = req.body;

    try {
      //see if user already exist
      let user = await User.findOne({ email });
      if (user) {
        return res.status(401).json({ error: "User already exist" });
      }

      user = new User({
        first_name,
        surname,
        email,
        password,
        date_of_birth,
        garden,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      const payload = {
        user: {
          id: user.id,
        },
      };
      console.log(process.env.JWT_SECRET, "hello");
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) {
            return res.status(500).json({ error: "Server error" });
          }

          res.json(token);
        }
      );

      await user.save();
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
