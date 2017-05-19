var events = require("workerjs-redis")();
var crypto = require('crypto');

module.exports = function(){
	var task = {
		task: {
			path: "https://scontent.fbeg2-1.fna.fbcdn.net/v/t1.0-9/18485686_10211085145236151_6190539574485761440_n.jpg?oh=5bf5b10ef14f9450e941c1d250070a8f&oe=59ADF1F6"
		},
		time: Math.floor(new Date().getTime()/1000),
		persistant: true,
		ttl: 5
	}

	task.uid = crypto.createHash('md5').update(JSON.stringify(task)).digest("hex");

	events.emit("tasks", JSON.stringify(task)).then(function(){});
	events._client.subscribe(task.uid);

	events._client.on("message", function (channel, message) {
		if(channel == task.uid){
			console.log(JSON.parse(message));
		}
	});
	
}

module.exports();
