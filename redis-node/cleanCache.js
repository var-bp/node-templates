const { clearHash } = require('./cache');


module.exports = async (req, res, next) => {
  await next(); // after route handler (req, res) => {} is completed run code below
  clearHash(req.user.id);
};
