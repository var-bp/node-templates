const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const apiRouter = require('./router');
const apiRouter2 = require('./router-2');


const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

// When finished, calls next() to defer to the next middleware in the chain
const myFunMiddleware = (request, response, next) => {
  next();
};

// res.end will end the request
// res.send or res.sendFile call res.end internally

app.use(logger('short'));

app.get('/', (request, response) => {
  response.end('Welcome to my homepage!');
});

app.get('/about', (request, response) => {
  response.end('Welcome to the about page!');
});

app.get('/weather', (request, response) => {
  response.end('The current weather is NICE.');
});

app.use('/v1/api', apiRouter);
app.use('/v2/api', apiRouter2);

app.get('/random/:min/:max', (req, res) => {
  const min = parseInt(req.params.min);
  const max = parseInt(req.params.max);
  if (isNaN(min) || isNaN(max)) {
    res.status(400);
    res.json({ error: 'Bad request.' });
    return; // if you didn’t return, you’d continue on to the rest of the function and you’d send the request twice, and Express would start throwing nasty errors
  }
  const result = Math.round((Math.random() * (max - min)) + min);
  res.json({ result });
});

app.use((request, response) => {
  response.statusCode = 404; // express way -> response.status(404);
  response.end('404!');
});


// Express’s error-handling middleware does not handle errors that are thrown with the
// throw keyword, only when you call next with an argument. Express has some protections in place
// for these exceptions. The app will return a 500 error and that request will fail, but the app
// will keep on running. Some errors like syntax errors, however, will crash your server.

// Example of error
app.use((err, req, res, next) => {
  next(err);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(500);
  res.send('Internal server error.');
});

http.createServer(app).listen(3000); // same as app.listen(3000)
