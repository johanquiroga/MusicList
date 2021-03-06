const Album = require('../../models/album');
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

// Check if album exists and if not, save it
const saveAlbum = async (albumInfo) => {
  let errors = false;
  const albumQuery = await Album.findOne({ discogsId: albumInfo.id });
  if (!albumQuery) {
    const albumInfoModified = { ...albumInfo, discogsId: albumInfo.id };
    const newAlbum = new Album(albumInfoModified);
    await newAlbum.save((error) => {
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

// Check each artist in an array to see if it exists and if not, save it
const saveArtists = async (artists) => {
  const formattedArtists = artists.map(artist => ({ ...artist, discogsId: artist.id }));

  try {
    const result = await new Promise((resolve) => {
      Artist.insertMany(
        formattedArtists,
        { ordered: false },
        (error) => {
          if (error && error.code !== 11000) {
            resolve(false);
          }

          resolve(true);
        },
      );
    });
    return result;
  } catch (error) {
    if (error.code !== 11000) {
      return false;
    }

    return true;
  }
};

router.post('/add', async (req, res) => {
  // Make sure a user's actually logged in
  if (!req.user) {
    return res.json({ error: 'User not logged in' });
  }

  // Wrap discogs API call in a promise so we can use async / await
  const discogsGetMaster = albumId => new Promise((resolve) => {
    discogsDB.getMaster(albumId, (err, data) => {
      resolve(data);
    });
  });

  // Get a single artist from Discogs
  const discogsGetArtist = artistId => new Promise((resolve) => {
    discogsDB.getArtist(artistId, (err, data) => {
      resolve(data);
    });
  });

  // Loop through artists and hit the Discogs API for each
  const getArtists = async (artists) => {
    const results = artists.map(artist => discogsGetArtist(artist.id));
    return Promise.all(results);
  };

  const albumId = parseInt(req.body.id, 10);
  let result;

  try {
    // Get album info from discogs API
    const albumInfo = await discogsGetMaster(albumId);

    // Save it to the MusicList DB if it's not already there
    const albumSaved = await saveAlbum(albumInfo);
    if (!albumSaved) {
      return res.json({ error: 'There was a problem saving the album to the database.' });
    }

    // Go through the album's artists and get their full info from Discogs
    const artistsInfo = await getArtists(albumInfo.artists);

    // Save the artists to the MusicList DB if they're not already there
    const artistsSaved = await saveArtists(artistsInfo);
    if (!artistsSaved) {
      return res.json({ error: 'There was a problem saving the artist to the database.' });
    }

    // Find the user we want to save to
    const foundUser = await User.findOne({ email: req.user.email });

    // Sanity check: is the album already added ?
    const albumIndex = foundUser.albums.indexOf(albumInfo.id);
    if (albumIndex < 0) {
      foundUser.albums.push(albumInfo.id);
    }

    // Sanity check: is the artist already added ?
    for (let i = 0; i < albumInfo.artists.length; i += 1) {
      const artistIndex = foundUser.artists.indexOf(albumInfo.artists[i].id);
      if (artistIndex < 0) {
        foundUser.artists.push(...albumInfo.artists.map(artist => artist.id));
      }
    }

    foundUser.save((error) => {
      if (error) {
        result = res.json({ error: 'Album could not be saved. Please try again.' });
      } else {
        result = res.json({ user: foundUser });
      }
    });
  } catch (err) {
    result = res.json({ error: 'There was an error saving the album to the database. Please try again.' });
  }

  return result;
});

// POST to /delete
router.post('/delete', (req, res, next) => {
  User.findOne({ username: req.user.username }, (err, foundUser) => {
    // Run filter against the array, returning only those that don't match the passed ID
    const newAlbums = foundUser.albums.filter(album => album !== req.body.albumId);
    foundUser.update({ $set: { albums: newAlbums } }, (error) => {
      if (error) {
        return res.json({ error: 'There was an error removing the album from user\'s profile.' });
      }
      return res.json({ albums: newAlbums });
    });
  });
});

// POST to /populate
router.post('/populate', (req, res, next) => {
  // Get album data from array
  Album.find({
    discogsId: { $in: req.body },
  }, (err, albums) => {
    if (err) {
      return res.json({ error: err.message });
    }

    return res.json({ albums });
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
