const fs = require('fs');

const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

exports.crypto = parsed.crypto;
exports.discogs = parsed.discogs;
exports.expressSession = parsed.expressSession;
exports.mailgun = parsed.mailgun;
exports.port = parsed.port;
