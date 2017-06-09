var events = require("workerjs-redis")({url: process.env.REDIS_URL || undefined});
var redis = require("redis");

var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter;

module.exports = function(){
	var client = {
		_arguments: {url: process.env.REDIS_URL || undefined},
		_eventEmitter: new EventEmitter(),

		config: {
			task: {
				path: "https://scontent.fbeg2-1.fna.fbcdn.net/v/t1.0-9/18485686_10211085145236151_6190539574485761440_n.jpg?oh=5bf5b10ef14f9450e941c1d250070a8f&oe=59ADF1F6"
			},
			time: Math.floor(new Date().getTime()*1),
			persistant: true,
			ttl: 5
		},
		send: function(callback){
			client.config.rand = Math.random()*100000000;
			client.config.uid = crypto.createHash('md5').update(JSON.stringify(client.config)).digest("hex");
			var uid = client.config.uid;

			events.emit("tasks", JSON.stringify(client.config)).then(function(){
				var rclient = redis.createClient.apply(this, client._arguments);

				rclient.subscribe(uid);

				rclient.on("message", function (channel, message) {
					if(channel == uid){
						client.emit(uid, JSON.parse(message))
					}
				});
			});

			client.on(uid, callback);
		}
	}

	var t = client;

	t.on = function(name, callback){
		t._eventEmitter.on(name, callback);
	};

	t.emit = function(name, data){
		t._eventEmitter.emit(name, data);
	}

	return t;
}

