// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-gateway
// US Government Users Restricted Rights - Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// See https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-10
/* jshint camelcase: false */
var jwt = require('jws');

// Reuse the SSL cert for https. Ideally, we should use a separate key/cert pair
// for JWT
var sslCerts = require('./../private/ssl_cert');

var payload = {
  iss: '123', // issuer - client id
  sub: 'bob', // subject
  aud: '/oauth/token', // audience
  exp: Date.now() + 10000, // expiration time
  iat: Date.now(), // issued at time
  scope: ['demo'] // a list of oAuth 2.0 scopes
};

var body = {
  header: { alg: 'RS256' },
  privateKey: sslCerts.privateKey,
  payload: payload
};

// Create a JWT assertion
var assertion = jwt.sign(body);

console.log(assertion);

var form = {
  grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  assertion: assertion
};

var port = process.env.PORT || 3001;
var request = require('request');
request.post({
  url: 'https://localhost:' + port + '/oauth/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  strictSSL: false,
  form: form
}, function(err, res, body) {
  console.log(err, body);
});

