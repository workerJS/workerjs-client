var client = require("./");

var j = 0;

for(var i = 0; i < 100; i++){
	setTimeout(function(){
		client().send(function(data){
			console.log(++j);
			console.log(data);
		});
	}, 0);
}

