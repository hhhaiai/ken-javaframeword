/* task.js
*/
require.provide("lib.core.util.task");
/*
CLASS:
  WIN.Task
DES:
  defines basic task module;
PROPERTY:
  {int} _timer
    interval handler;
  {int} interval
    task run interval
  {boolean} running
    specify task is running
  {function} task
    task to be run
METHOD:
	{void} run( [{function} task, {object} scope])
	{void} stop()
EVT:
	{void} onstart()
	{void} onstop()
*/
WIN.Task = WIN.createClass(function(interval, task){
		this.interval = interval || 1000;
		this.task = task;
	},{
		/*
		():
			{void} run( [{function} task, {object} scope])
		DES:
			start to run a task
		ARG:
		  {function} task
			  (optional),defauts to this.task;
			{object} scope
			  (optional),defauts to this;
		*/
	  run : function(){
			if(this.running)return ;
			var f = Function.bind( this.task, this);
			
			f.apply(null, arguments);
		  this._timer = setInterval(function(){
				f.apply(null, arguments);
			}, this.interval);
			
			if(this.onstart)this.onstart();
			this.running = true;
		},
		/*
		():
			{void} stop()
		DES:
			stop running task;
		*/
		stop : function(){
			if(!this.running)return ;
			clearInterval(this._timer);
			this.running = false;
			if(this.onstop)this.onstop();
		},
		/*
		onstart : Function.empty,
		onstop : Function.empty,*/
		toString : function(){return "[object WIN.Task]"; }
	}
);