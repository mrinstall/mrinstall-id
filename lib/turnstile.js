const https = require('https');
const querystring = require('querystring');
const debug = require('debug')('idm:turnstile');

const turnstile_secret_key = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAADnnuJOkeDP1qGamaEZPftimAXQ';

exports.verifyToken = function (token) {
  return new Promise((resolve) => {
    if (!token) {
      debug('No Turnstile token provided');
      resolve(false);
      return;
    }

    const post_data = querystring.stringify({
      secret: turnstile_secret_key,
      response: token
    });

    const options = {
      hostname: 'challenges.cloudflare.com',
      port: 443,
      path: '/turnstile/v0/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed_data = JSON.parse(data);
          if (parsed_data.success) {
            resolve(true);
          } else {
            debug('Turnstile verification failed: ', parsed_data);
            resolve(false);
          }
        } catch (e) {
          debug('Error parsing Turnstile response: ', e);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      debug('Error during Turnstile request: ', e);
      resolve(false);
    });

    req.write(post_data);
    req.end();
  });
};
