
const { User, validateLogin, validateUser} = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Get all users (tested-works)
router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      return res.send(users);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

  //register new user (tested-works)
  router.post("/register", async (req, res) => {
    try {
      const { error } = validateUser(req.body);
      if (error) return res.status(400).send(error.details[0].message);
      let user = await User.findOne({ email: req.body.email });
      if (user)
        return res.status(400).send(`Email ${req.body.email} already claimed!`);
  
      const salt = await bcrypt.genSalt(10);
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt),
      });
  
      await user.save();
      const token = user.generateAuthToken();
      return res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send({
          name: user.name,
          email: user.email,
        });
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

  // POST a valid login attempt (tested-worked)
// when a user logs in, a new JWT token is generated and sent if their email/password credentials are correct
router.post("/login", async (req, res) => {
    try {
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      let user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send(`Invalid email or password.`);
  
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(400).send("Invalid email or password.");
  
      const token = user.generateAuthToken();
      return res.send(token);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });

  module.exports = router;