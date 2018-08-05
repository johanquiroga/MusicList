const appConfig = require('../../config.js');
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const mailgun = require('mailgun-js')({
  apiKey: appConfig.mailgun.apiKey,
  domain: appConfig.mailgun.domain,
});
const User = require('../../models/user');

const router = express.Router();

mongoose.Promise = global.Promise;

router.get('/checksession', (req, res) => {
  if (req.user) {
    return res.json({ user: req.user });
  }

  return res.json({});
});

// POST to /register
router.post('/register', async (req, res) => {
  // First check and make sure the email doesn't already exists
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();

  if (foundUser) {
    return res.json({ error: 'Email or username already exists' });
  }

  if (!foundUser) {
    // Create a user object to save, using values from incoming JSON
    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });

    // Save, via Passport's "register" method, the user
    return User.register(newUser, req.body.password, (err) => {
      // If there's a problem, send back a JSON object with the error
      if (err) {
        return res.json({ error: err });
      }

      return passport.authenticate('local')(req, res, () => {
        if (req.user) {
          return res.json({ user: req.user });
        }

        return res.json({ error: 'There was an error registering the user' });
      });
    });
  }

  return res.json({ error: 'There was an error registering the user' });
});

// POST to /login
router.post('/login', async (req, res) => {
  // look up the user by their email
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();

  // If they exist, they'll have a username, so add that to our body
  if (foundUser) { req.body.username = foundUser.username; }

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

router.post('/savepassword', async (req, res) => {
  let result;
  try {
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();

    if (foundUser) {
      foundUser.setPassword(req.body.password, (err) => {
        if (err) {
          result = res.json({ error: 'Password could not be saved. Please try again' });
        } else {
          foundUser.save((error) => {
            if (error) {
              result = res.json({ error: 'Password could not be saved. Please try again.' });
            } else {
              result = res.json({ success: true });
            }
          });
        }
      });
    } else {
      result = res.json({ error: 'Reset hash nor found in database' });
    }
  } catch (e) {
    result = res.json({ error: 'There was an error connecting to the database' });
  }

  return result;
});

// POST to saveresethash
router.post('/saveresethash', async (req, res) => {
  let result;
  try {
    // check and make sure the email exists
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();

    // If the user exists, save their password hash
    const timeInMs = Date.now();
    const hashString = `${req.body.email}${timeInMs}`;
    const { secret } = appConfig.crypto;
    const hash = crypto.createHmac('sha256', secret)
      .update(hashString)
      .digest('hex');
    foundUser.passwordReset = hash;

    foundUser.save((err) => {
      if (err) {
        result = res.json({ error: 'Something went wrong while attempting to reset your password. Please try again.' });
      }

      const emailData = {
        from: `johanquiroga <postmaster@${appConfig.mailgun.domain}>`,
        to: foundUser.email,
        subject: 'Reset your password',
        text: `A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: https://musiclist.com/account/change-password/${foundUser.passwordReset} ... if you didn't make this request, feel free to ignore it!`,
        html: `<p>A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: <a href="https://musiclist.com/account/change-password/${foundUser.passwordReset}&quot; target="_blank">https://musiclist.com/account/change-password/${foundUser.passwordReset}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
      };

      mailgun.messages().send(emailData, (error, body) => {
        if (error || !body) {
          result = res.json({ error: 'Something went wrong while attempting to send the email. Please try again.' });
        } else {
          result = res.json({ success: true });
        }
      });
    });
  } catch (err) {
    // if the user doesn't exist, error out
    result = res.json({ error: 'Something went wrong while attempting to reset your password. Please try again.' });
  }
  return result;
});

module.exports = router;
