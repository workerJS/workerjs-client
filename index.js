var redis = require("workerjs-redis")({url: process.env.REDIS_URL || undefined});

var queue = redis.queue;
var messaging = redis.messaging;

var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter;

module.exports = function(channel, task){
	var client = {
		_queue: queue,
		_messaging: messaging,

		_eventEmitter: new EventEmitter(),

		_channel: undefined,

		config: {
			task: task,
			time: Math.floor(new Date().getTime()*1),
			persistant: true,
			ttl: 5
		},

		send: function(callback){
			client.config._rand = Math.random()*100000000;
			client.config._uid = crypto.createHash('md5').update(JSON.stringify(client.config)).digest("hex");

			var uid = client.config._uid;

			console.log(uid);

			client._queue.emit(client._channel, JSON.stringify(client.config)).then(function(){
				client._messaging.on(uid, function (channel, message) {
					if(channel == uid){
						client.EventEmitter.emit(uid, JSON.parse(message))
					}
				});
			});

			client.on(uid, callback);
		}
	}

	var t = client;

	t._channel = channel;

	t.on = function(name, callback){
		t._eventEmitter.on(name, callback);
	};

	t.emit = function(name, data){
		t._eventEmitter.emit(name, data);
	}

	return t;
}

