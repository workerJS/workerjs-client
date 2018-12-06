const client = require("./");

// Config

let count = 100000; // Number of instances of task to create
let debug = false; // Print uncomplete tasks

// End of config

if(debug){
	let list = [];
}

let j = 0;

for(i = 0; i < count; i++){
	setTimeout(function(){
		let task = client("task", {});

		task.send(function(data){
			if(debug){
				list = list.filter((id) => {return id != task.config._uid;});
			}

			if(++j % 100 == 0){
				console.log(j, task.config._uid);
			}
			
			if(j == count){
				process.exit();
			}

			if(debug){
				console.log(list);
			}
		});

		if(debug){
			list.push(task.config._uid);
		}
	}, 0);
}

