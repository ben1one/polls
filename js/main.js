Vue.component('poll-today', {
	props: ['poll'],
	data:{
		voted:false
	},
	template: '	<div class="poll-today">\
	<div class="inner">\
	<h1>Today\'s Poll</h1>\
	<p class="title">{{ poll.title }} <span class="date-label">{{ epoch2date(poll.publishedDate)	}}</span></p>\
	<div class="chart"><svg width="150px" height="150px" viewBox="0 0 42 42" class="donut">\
	<circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>\
	<circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d77a44" stroke-width="8"></circle><circle id="circle" class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#1e3a67" stroke-width="8" v-bind:stroke-dasharray="poll.strokeDasharray" v-bind:stroke-dashoffset="getOffset(poll.bluePercent, poll.orangePercent)"></circle></svg>	\
	<p>{{poll.bluePercent}}<span></span>{{poll.orangePercent}}</p></div>\
	<div class="vote-buttons" v-bind:class="{ voted: poll.voted }">\
	<div  v-on:click="vm.vote(poll.id,poll.answer.options[0].id);poll.voted=true;" class="vote-button vote-button1">{{ poll.answer.options[0].label	}}</div>\
	<div  v-on:click="vm.vote(poll.id,poll.answer.options[1].id);poll.voted=true;" class="vote-button vote-button2">{{ poll.answer.options[1].label }}</div>\
	</div>\
	<p class="total-vote">Total number of votes recored: {{ poll.total }}</p>\
	</div>\
	<div class="doted-line"></div>\
	</div>'
});
Vue.component('poll-item', {
	props: ['poll'],		
	template: '\
	<div class="poll">\
	<a v-bind:href="\'#\'+poll.id" v-on:click="vm.loadSinglePoll(poll.id)">\
	<div class="left">\
	<img src="images/poll-icon.png" alt="" /> \
	</div><div class="right">\
	<div class="date-label">{{ epoch2date(poll.publishedDate)	}}</div> \
	<p class="title">{{ poll.title }}</p>\
	</div></a>\
	</div>\
	'
});
Vue.component('single-poll', {
	props: ['poll'],		
	template: '<div><a class="back" href="" v-on:click="vm.currentPage = \'poll-listing\' ">< Back</a><div class="upper">\
	<h1 class="title">{{poll.title}}</h1>\
	<div class="doted-line"></div>\
	<p class="date">PUBLISHED: {{ epoch2GMT(poll.publishedDate)	}}</p>\
	</div>\
	<div class="wrapper">\
	<div class="inner">\
	<h1 class="title">{{poll.title}}</h1>\
	<div class="left">\
	<div class="vote-buttons">\
	<div class="vote-button vote-button1" v-on:click="vm.vote(poll.id,poll.answer.options[0].id);poll.voted=true;">{{ poll.answer.options[0].label	}}</div> \
	<div class="vote-button vote-button2" v-on:click="vm.vote(poll.id,poll.answer.options[1].id);poll.voted=true;">{{ poll.answer.options[1].label	}}</div>\
	</div>		\
	</div><div class="right">\
	<div class="chart"><svg width="150px" height="150px" viewBox="0 0 42 42" class="donut">\
	<circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>\
	<circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d77a44" stroke-width="8"></circle><circle id="circle" class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#1e3a67" stroke-width="8" v-bind:stroke-dasharray="poll.strokeDasharray" v-bind:stroke-dashoffset="getOffset(poll.bluePercent, poll.orangePercent)"></circle></svg>	\
	<p>{{poll.bluePercent}}<span></span>{{poll.orangePercent}}</p></div>	\				</div>\
	<p class="total-vote">Total number of votes recored: {{ poll.total }}</p>\						</div>\
	</div></div>\
	'
});			


function epoch2date(ts){
	var output = new Date( ts  *1000);
	output =  output.toGMTString().split(' ');
	return output[1]+" "+output[2]+" "+output[3];	
}	
function epoch2GMT(ts){
	var output = new Date( ts  *1000);
	output =  output.toGMTString().split('GMT')[0];
	return output;	
}				
function getOffset(val1, val2){
	var larger = val1>val2?val1:val2;
	return (val1*-1)+ larger/2; 
}		
function getBase0byId(list, idx){
	for(var i=0;i<list.length;i++){
		if( list[i]['id'] == idx ){
			idx = i;
		}
	}	
	return idx;
}
function updateTitle(){
	document.title = location.hash == "" ? "Poll Listing":"Single Poll - "+ location.hash.replace('#', '');
}

var vm = new Vue({
	el: '#vue', 
	data: {
		currentPage : location.hash == "" ? "poll-listing":"single-poll",
		pollUrl: "assets/poll.json",
		pollList : [{id:"", title:"",total:"", answer:{options:{0:"",1:""}}}],
		singlePoll : [{id:"", title:"",total:"", answer:{options:{0:"",1:""}}}]
	}, 
	methods:{
		loadPolls: function(today) {
			this.$http.get(this.pollUrl).then(function(response){
				
				//Poll Id to array id
				today = getBase0byId(response.body.polls, today);
				console.log("today in term of arr idx is %s", today);
				
				//A little hack to the JSON
				response.body.polls[today]['total'] = "";
				response.body.polls[today]['strokeDasharray'] = "";
				response.body.polls[today]['orangePercent'] = "";
				response.body.polls[today]['bluePercent'] = "";
				
				console.log(response.body.polls);
				
				//Data bind
				this.pollList = response.body.polls;
				this.singlePoll[0] = this.pollList[today];
				
				
				//Load total for Today's Poll
				this.$http.get("vote.php?pid="+this.pollList[today].id).then(function(response){
					console.log(response.body);
					
					vm.pollList[today].total = response.body.total;
					vm.singlePoll[0].total = response.body.total;
					
					var opt1 = vm.pollList[today].answer.options[0].id; //Orange
					var opt2 = vm.pollList[today].answer.options[1].id; //Blue
					
					var orangePercent = parseInt(parseInt(response.body.votes[opt1])/(response.body.total)*100);
					var bluePercent = 100-orangePercent;
					
					if(isNaN(bluePercent)){bluePercent=0;}
					if(isNaN(orangePercent)){orangePercent=0;}
					
					vm.pollList[today].bluePercent = bluePercent;
					vm.pollList[today].orangePercent = orangePercent;
					vm.pollList[today].strokeDasharray = bluePercent+" "+orangePercent;		
					
					
					}).catch(function(response) {
					console.log(response);
				});					
				
				
				}).catch(function(response) {
				console.log(response);
			});
		},
		vote: function(pid, option){
			console.log("%s %s", pid, option);
			
			
			this.$http.post("vote.php", "pid="+pid+"&optionKey="+option,{
				headers: {
					"Content-Type": 'application/x-www-form-urlencoded'
				}}).then(function(response){
				
				var result = JSON.parse(response.body);
				console.log(result);
				
				
				var pid_base0 = getBase0byId(vm.pollList, pid);
				
				vm.pollList[pid_base0].total = result.total;
				var opt1 = vm.pollList[pid_base0].answer.options[0].id; //Orange
				var opt2 = vm.pollList[pid_base0].answer.options[1].id; //Blue						
				var orangePercent = parseInt(parseInt(result.votes[opt1])/(result.total)*100);
				var bluePercent = 100-orangePercent;
				
				if(isNaN(bluePercent)){bluePercent=0;}
				if(isNaN(orangePercent)){orangePercent=0;}
				
				vm.pollList[pid_base0].bluePercent = bluePercent;
				vm.pollList[pid_base0].orangePercent = orangePercent;
				vm.pollList[pid_base0].strokeDasharray = bluePercent+" "+orangePercent;		
				
				console.log("bluePercent orangePercent:"+bluePercent+" "+orangePercent);
				
				vm.singlePoll[0].bluePercent = bluePercent;
				vm.singlePoll[0].orangePercent = orangePercent;
				vm.singlePoll[0].strokeDasharray = bluePercent+" "+orangePercent;		
				
				
				}).catch(function(response) {
				console.log(response);
			});				
			
		},
		loadSinglePoll : function(pid){
			console.log(pid);
			//this.singlePoll[0] = this.pollList[pid];
			this.loadPolls(pid);		
		}
	},
	mounted: function () {
		this.loadPolls(location.hash == "" ? 1: location.hash.replace('#', ''));		
		updateTitle();
	}
});

window.addEventListener("hashchange", function(){			
	vm.currentPage =  location.hash == "" ? "poll-listing":"single-poll";
	updateTitle();
}, false);