// Memcached vs. Redis https://stackoverflow.com/a/11257333

// https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f
//

const express = require('express');
const cleanCache = require('./cleanCache');
require('./cache');


const app = express();

// brew services start redis
// redis-cli ping
// redis-cli client list

app.get('/blogs', cleanCache, async (req, res) => {
  const blogs = await Blogs.find({ _user: req.user.id }).cache({ key: req.user.id });
  res.send(blogs);
});
