// https://ciphertrick.com/2017/09/19/two-factor-authentication-nodejs-stateless-application/
// OTP - one-time password
// TOTP (Time-Based OTP) - OTPs generated via software and hardware token
// 2fa - two-factor authentication

const express = require('express');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const path = require('path');
const { v4 } = require('uuid');
const cors = require('cors');
// implement session!

const PORT = 5000;
const HOST = '0.0.0.0';

const USER = {
  firstName: 'Jon',
  lastName: 'Doe',
  email: 'jon.doe@gmail.com',
  password: '1a2s3d',
};

const app = express();

app.use(cors()); // only for example
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  // 2fa is not enabled by the user
  if (!USER.authentication || !USER.authentication.secret) {
    // check credentials
    if (req.body.email === USER.email && req.body.password === USER.password) {
      return res.send('Success');
    }
    return res.status(400).send('Invald email or password');
  }
  // 2fa is enabled
  if (req.body.email !== USER.email || req.body.password !== USER.password) {
    return res.status(400).send('Invald email or password');
  }
  // check if OTP is passed, if not then ask for OTP
  if (!req.headers['x-otp']) {
    return res.status(206).send('Please enter OTP to continue');
  }
  // validate OTP
  const verified = speakeasy.totp.verify({
    secret: USER.authentication.secret,
    encoding: 'base32',
    token: req.headers['x-otp'],
  });
  if (verified) {
    return res.send('Success');
  }
  return res.status(400).send('Invalid OTP');
});

// setup 2fa for logged in user
app.post('/auth/setup', (req, res) => {
  const secret = speakeasy.generateSecret({ length: 10 });
  qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
    // save to logged in user.
    USER.authentication = {
      secret: '',
      tempSecret: secret.base32,
      dataURL: dataUrl,
      otpURL: secret.otpauth_url,
    };
    return res.json({
      message: 'Verify OTP',
      tempSecret: secret.base32,
      dataURL: dataUrl,
      otpURL: secret.otpauth_url,
    });
  });
});

// before enabling TOTP based 2fa
// it's important to verify, so that we don't end up locking the user.
app.post('/auth/verify', (req, res) => {
  const verified = speakeasy.totp.verify({
    secret: USER.authentication.tempSecret, // secret of the logged in user
    encoding: 'base32',
    token: req.body.token,
  });
  if (verified) {
    USER.authentication.secret = USER.authentication.tempSecret; // set secret, confirm 2fa
    return res.send('Two-factor auth enabled');
  }
  return res.status(400).send('Invalid token, verification failed');
});

// get 2fa details
app.get('/auth/setup', (req, res) => { res.json(USER.authentication); });

// disable 2fa
app.delete('/auth/setup', (req, res) => {
  delete USER.authentication;
  res.send('Success');
});

app.listen({ port: PORT, host: HOST }, (error) => {
  if (error) throw error;
  console.info(`Server ready at http://${HOST}:${PORT}`);
});
