// cookies/sessions are not supported on mobile

// Протокол HTTP - это "протокол без сохранения состояния". А "сессия" ("сеанс") - это когда юзер
// авторизовался на сайте, ходит по разным его страницам - а сервер его везде, на всех страницах
// узнаёт.

// Сессия - это просто хранилище данных, которые доступны для разных запросов. Обычно их
// делают доступными по какому-то идентификатору пользователя. В NodeJs нет никакого встроенного
// механизма работы с сессиями. Обычно для этого используется middleware, которое цепляется к
// обработчикам запросов и из cookie достает идентификатор пользователя и в каком-либо хранилище
// достает нужные данные. Хранилищем может выступать что угодно - переменная в оперативной памяти,
// файлы на диске, БД, удаленный сервис. Удобно использовать memcached/Redis.

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { v4 } = require('uuid');
// passport & passport-local is optional


const PORT = 5000;
const HOST = '0.0.0.0';

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

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    // It’s useful to pass request authentication information to the templates.
    res.locals.auth = true;
  }
  next();
});
const sessionChecker = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.status(401).send('Access is denied due to invalid credentials');
};

app.get('/', (req, res) => { res.send(`Home page. Session ID: ${req.sessionID}`); });

app.post('/login', (req, res) => {
  req.session.user = {};
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => { res.redirect('/'); });
});

// Statement is a more compact alternative to adding authorize to all /api/... routes manually.
app.all('/api', sessionChecker);
app.get('/api/articles', (req, res) => { res.send({ articles: [] }); });

// route for handling 404 requests
app.all('*', (req, res) => { res.status(404).send('Not found'); });

app.listen({ port: PORT, host: HOST }, (error) => {
  if (error) throw error;
  console.info(`Server ready at http://${HOST}:${PORT}`);
});
