const client = require("./");

let j = 0;
let count = 1000;

//let list = [];

for(i = 0; i < count; i++){
	//setTimeout(function(){
		let task = client("task", {});

		task.send(function(data){
			//list = list.filter((id) => {return id != task.config._uid;});
			if(++j % 100 == 0){
				console.log(j, task.config._uid);
			}
			
			if(j == count){
				process.exit();
			}

			//console.log(list);
		});

		//list.push(task.config._uid);
	//}, 0);
}

