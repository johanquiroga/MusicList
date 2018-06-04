const express = require('express');
const passport = require('passport');
const User = require('../../models/user');

const router = express.Router();

// POST to /register
router.post('/register', (req, res) => {
  // Create a user object to save, using values from incoming JSON
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });

  // Save, via Passport's "register" method, the user
  User.register(newUser, req.body.password, (err, user) => {
    // If there's a problem, send back a JSON object with the error
    if (err) {
      return res.json({ error: err });
    }
    // Otherwise, send back a JSON object with the new user's info
    return res.json({ user });
  });
});

// POST to /login
router.post('/login', (req, res) => {
  passport.authenticate('local')(req, res, () => {
    // If logged in, we should have user info to send back
    if (req.user) {
      return res.json({ user: req.user });
    }

    // Otherwise return an error
    return res.json({ error: 'There was an error loggin in' });
  });
});

// POST to /logout
router.post('/logout', (req, res) => {
  req.logout();
  return res.json({ user: req.user });
});

module.exports = router;