const client = require("./");

let j = 0;

let list = [];

for(i = 0; i < 100; i++){
	setTimeout(function(){
		let task = client("task", {});

		task.send(function(data){
			list = list.filter((id) => {return id != task.config._uid;});
			console.log(++j, task.config._uid);
			console.log(list);
		});

		list.push(task.config._uid);
	}, 0);
}

