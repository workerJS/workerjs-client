# workerjs-client

Client for pushing tasks and getting responses...

```javascript
let task = client("task", {});

task.send(function(data){
	//handle message from worker
});
```


