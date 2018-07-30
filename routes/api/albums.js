const appConfig = require('../../config.js');
const Discogs = require('disconnect').Client;
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

mongoose.Promise = global.Promise;

// configure Discogs
const discogsClient = new Discogs('MusicList-quirogacj/0.1', {
  consumerKey: appConfig.discogs.key,
  consumerSecret: appConfig.discogs.secret,
});
const discogsDB = discogsClient.database();

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