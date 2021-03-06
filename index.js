var redis = require("workerjs-rabbitmq")({url: process.env.REDIS_URL || undefined});

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
			ttl: 10
		},

		send: function(callback){
			client.config._rand = Math.random()*100000000;
			client.config._uid = crypto.createHash('md5').update(JSON.stringify(client.config)).digest("hex");

			var uid = client.config._uid;

			if(client._messaging instanceof Promise){
				client._messaging.then((messagingResolved) => {
					client._messaging = messagingResolved;

					return client.send(callback);
				});
			} else {
				client._messaging.on(uid, function (message) {
					client._eventEmitter.emit(uid, message);
				}).then(function(){
					if(client._queue instanceof Promise){
						client._queue.then((queueResolved) => {
							client._queue = queueResolved;

							client._queue.emit(client._channel, JSON.stringify(client.config));
						});
					} else {
						client._queue.emit(client._channel, JSON.stringify(client.config));
					}
				});

				client.on(uid, callback);
			}
		}
	}

	var t = client;

	t._channel = channel;

	t.on = function(name, callback){
		t._eventEmitter.on(name, callback);
	};

	t.emit = function(name, data){
		t._eventEmitter.emit(name, data, name);
	}

	return t;
}

