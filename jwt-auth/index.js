// Developers use JSON Web Tokens (JWT) to encrypted data, which is then stored on the client.
// JWTs have all the any information unlike regular tokens (API keys or OAuth access tokens),
// which are more like passwords. Thus, JWTs remove the need for a database to store user
// information.

// JWT is less secure than web sessions. This is because web sessions store the data on
// the server (usually in a database) and only store a session ID on the client. Despite JWT
// using encryption, anyone can break any encryption given enough time and processing power.

// JWTs eliminate the need for the server-side database or a store. All info is in this token,
// which has three parts: header, payload and signature. I'm always paranoid about security, so
// the stronger the algorithm, the better. RS512 will be good for most of the cases circa 2020.


const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { v4 } = require('uuid');
// passport & passport-local is optional


const USERS = []; // temp

const SECRET = v4();
const PORT = 5000;
const HOST = '0.0.0.0';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authorization 'Bearer 1e4g...'
const authenticate = (req, res, next) => {
  if (req.headers && req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {
    jsonwebtoken.verify(req.headers.Authorization.split(' ')[1], SECRET, (error, decoded) => {
      if (error) return res.status(401).send('Access is denied due to invalid credentials');
      req.user = decoded;
      return next();
    });
  } else {
    return res.status(401).send('Access is denied due to invalid credentials');
  }
};

app.get('/', (req, res) => { res.send('Home page'); });

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(item => item.username === username);
  if (user) {
    bcrypt.compare(password, user.password, (error, matched) => {
      if (!error && matched) {
        res.status(201).json({ token: jsonwebtoken.sign({ username }, SECRET, { expiresIn: '7d' }) });
      } else {
        res.status(401).send('Access is denied due to invalid credentials');
      }
    });
  } else {
    res.status(401).send('Access is denied due to invalid credentials');
  }
});

app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10, (error, hash) => {
    if (error) {
      res.status(500).send('The server encountered an internal error or misconfiguration abd was unable to complete your request');
    }
    USERS.push({
      username: req.body.username,
      password: hash,
    });
    res.status(201).send('Registered');
  });
});

app.get('/logout', (req, res) => { /* on client by deletetin the cookie */ });

// Statement is a more compact alternative to adding authorize to all /api/... routes manually.
app.all('/api', authenticate);
app.get('/api/articles', (req, res) => { res.send({ articles: [] }); });

// route for handling 404 requests
app.all('*', (req, res) => { res.status(404).send('Not found'); });

app.listen({ port: PORT, host: HOST }, (error) => {
  if (error) throw error;
  console.info(`Server ready at http://${HOST}:${PORT}`);
});
