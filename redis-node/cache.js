const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');


const redisUrl = 'redis://127.0.0.1:51530';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget); // client.hget('', () => {}) to Promise
const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ''); // JSON.stringify to string
  return this; // for chaining
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  // { _id: '', collection: 'test' }
  const key = JSON.stringify(Object.assign(
    {},
    this.getQuery(),
    { collection: this.mongooseCollection.name },
  ));
  // if key in redis
  const cacheValue = await client.hget(this.hashKey, key);
  // if yes, return it
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
  }
  // otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10); // 10 sec
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
