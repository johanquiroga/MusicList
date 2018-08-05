const Artist = require('../../models/artist');
const appConfig = require('../../config.js');
const Discogs = require('disconnect').Client;
const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/user');

const router = express.Router();

mongoose.Promise = global.Promise;

// configure Discogs
const discogsClient = new Discogs('MusicList-quirogacj/0.1', {
  consumerKey: appConfig.discogs.key,
  consumerSecret: appConfig.discogs.secret,
});
const discogsDB = discogsClient.database();

// Check if artist exists and if not, save it
const saveArtist = async (artistInfo) => {
  let errors = false;
  const artistQuery = await Artist.findOne({ discogsId: artistInfo.id });
  if (!artistQuery) {
    const artistInfoModified = { ...artistInfo, discogsId: artistInfo.id };
    const newArtist = new Artist(artistInfoModified);
    await newArtist.save((error) => {
      if (error) {
        errors = true;
      }
    });
  }

  if (errors) {
    return false;
  }

  return true;
};

router.post('/add', async (req, res) => {
  // Make sure a user's actually logged in
  if (!req.user) {
    return res.json({ error: 'User not logged in' });
  }

  // Get a single artist from Discogs
  const discogsGetArtist = artistId => new Promise((resolve) => {
    discogsDB.getArtist(artistId, (err, data) => {
      resolve(data);
    });
  });

  const artistId = parseInt(req.body.id, 10);
  let result;

  try {
    // Get album info from discogs API
    const artistInfo = await discogsGetArtist(artistId);

    // Save it to the MusicList DB if it's not already there
    const artistSaved = await saveArtist(artistInfo);
    if (!artistSaved) {
      return res.json({ error: 'There was a problem saving the artist to the database.' });
    }

    // Find the user we want to save to
    const foundUser = await User.findOne({ email: req.user.email });

    // Sanity check: is the artist already added ?
    const artistIndex = foundUser.artists.indexOf(artistInfo.id);
    if (artistIndex < 0) {
      foundUser.artists.push(artistInfo.id);
    }

    foundUser.save((error) => {
      if (error) {
        result = res.json({ error: 'Artist could not be saved. Please try again.' });
      } else {
        result = res.json({ user: foundUser });
      }
    });
  } catch (err) {
    result = res.json({ error: 'There was an error saving the artist to the database. Please try again.' });
  }

  return result;
});

// POST to /populate
router.post('/populate', (req, res, next) => {
  // Get album data from array
  Artist.find({
    discogsId: { $in: req.body },
  }, (err, artists) => {
    if (err) {
      return res.json({ error: err.message });
    }

    return res.json({ artists });
  });
});

// POST to search
router.post('/search', async (req, res) => {
  await discogsDB.search(req.body, (err, data) => {
    if (err) {
      const error = new Error(err);
      return res.json({ error });
    }
    return res.json(data);
  });
});

module.exports = router;
