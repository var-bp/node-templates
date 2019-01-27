// https://habr.com/ru/company/mailru/blog/115163/
// https://cloud.google.com/nodejs/getting-started/authenticate-users

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const { v4 } = require('uuid');


const PORT = 5000;
const HOST = 'localhost';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie-session uses browser cookies to store session information. In other words, the entire
// session is serialized into cookie-based storage, not just the session key. This approach should
// be avoided because of cookie size limitations and security concerns.
app.use(session({
  name: 'connect.sid', // a unique name is required
  genid: req => v4(), // session ID
  secret: 'secret',
  resave: false, // ?
  saveUninitialized: false, // ?
  // cookie: {
  //   secure: true, // обеспечивает отправку файлов cookie браузером только с использованием протокола HTTPS
  //   httpOnly: true, // Cross-Site Scripting (XSS) attacks, обеспечивает отправку cookie только с использованием протокола HTTP(S), а не клиентского JavaScript
  //   maxAge: null, // пока открыта вкладка браузера, но не дольше суток
  // },
  // store: '', // connect-redis - BEST, connect-mongodb - OK, cookie-sessions - NO
}));

app.use(passport.initialize()); // used to initialize passport
app.use(passport.session()); // used to persist login sessions

const extractProfile = (profile) => {
  let image = '';
  const { photos, id, displayName } = profile;
  if (photos && photos.length) image = photos[0].value;
  return {
    id,
    displayName,
    image,
  };
};

const authenticate = (req, res, next) => {
  if (!req.user) {
    req.session.oauth2return = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
};

// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
const addTemplateVariables = (req, res, next) => {
  res.locals.profile = req.user;
  res.locals.login = `/auth/login?return=${encodeURIComponent(req.originalUrl)}`;
  res.locals.logout = `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`;
  next();
};

passport.use(new GoogleStrategy({
  clientID: 'YOUR_OAUTH2_CLIENT_ID',
  clientSecret: 'YOUR_OAUTH2_CLIENT_SECRET',
  callbackURL: `http://${HOST}:${PORT}/auth/google/callback`,
  accessType: 'offline',
}, (accessToken, refreshToken, profile, done) => {
  done(null, extractProfile(profile)); // passes the profile data to serializeUser
}));

passport.use(new FacebookStrategy({
  clientID: 'FACEBOOK_APP_ID',
  clientSecret: 'FACEBOOK_APP_SECRET',
  callbackURL: `http://${HOST}:${PORT}/auth/facebook/callback`,
},
(accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, cb) => { cb(null, user); });
// Used to decode the received cookie and persist session
passport.deserializeUser((obj, cb) => { cb(null, obj); });

app.get('/', (req, res) => { res.send('Home page'); });

app.get(
  '/auth/google',
  (req, res, next) => {
    // Save the url of the user's current page so the app can redirect back to it after authorization
    if (req.query.return) req.session.oauth2return = req.query.return;
    next();
  },
  // Start OAuth 2 flow using Passport.js
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/facebook',
  (req, res, next) => {
    // Save the url of the user's current page so the app can redirect back to it after authorization
    if (req.query.return) req.session.oauth2return = req.query.return;
    next();
  },
  // Start OAuth 2 flow using Passport.js
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);

app.get(
  // OAuth 2 callback url. Use this url to configure your OAuth client in the Google Developers console
  '/auth/google/callback',
  // Finish OAuth 2 flow using Passport.js
  passport.authenticate('google'),
  // Redirect back to the original page, if any
  (req, res) => {
    const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    res.redirect(redirect);
  }
);

app.get(
  // OAuth 2 callback url.
  '/auth/facebook/callback',
  // Finish OAuth 2 flow using Passport.js
  passport.authenticate('facebook'),
  // Redirect back to the original page, if any
  (req, res) => {
    const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    res.redirect(redirect);
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Statement is a more compact alternative to adding authorize to all /api/... routes manually.
app.all('/api', authenticate);
app.get('/api/articles', (req, res) => { res.send({ articles: [] }); });

// route for handling 404 requests
app.all('*', (req, res) => { res.status(404).send('Not found'); });

app.listen({ port: PORT, host: HOST }, (error) => {
  if (error) throw error;
  console.info(`Server ready at http://${HOST}:${PORT}`);
});
