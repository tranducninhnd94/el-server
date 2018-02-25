var Promise = require("promise"),
	redis = require("redis"),
	bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient(6379, "127.0.0.1");
client.on("connect", () => {
	console.log("connected to redis");
});

module.exports = {
	saveObject: (key, obj) => {
		return new Promise((resolve, reject) => {
			client.set(key, obj, (err, reply) => {
				if (err) return reject(err);
				return resolve(reply);
			});
		});
	},

	saveObjectUsingHash: (key, obj) => {
		return new Promise((resolve, reject) => {
			client.hmset(key, obj, (err, reply) => {
				if (err) return reject(err);
				return resolve(reply);
			});
		});
	},

	getObjectHash: key => {
		return new Promise((resovle, reject) => {
			client.hgetall(key, (err, reply) => {
				if (err) return reject(err);
				return resovle(reply);
			});
		});
	},

	getObject: key => {
		return new Promise((resolve, reject) => {
			client.get(key, (err, reply) => {
				if (err) return reject(err);
				return resolve(reply);
			});
		});
	},

	deleteKey: key => {
		return new Promise((resolve, reject) => {
			client.del(key, (err, reply) => {
				if (err) return reject(err);
				return resolve(reply);
			});
		});
	},

	expireKey: (key, timeExpire) => {
		return new Promise((resvle, reject) => {
			client.set(key, timeExpire);
		});
	}
};
