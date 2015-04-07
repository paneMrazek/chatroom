app = angular.module('chatroom', ['ui.router']);

app.controller('MainCtrl', ['$scope', 'socket','urls', function($scope, socket, urls){
	$scope.chats = [];

	$scope.showhide={
		administration: false,
		usernameSet: false,
		login: true
	};

	$scope.rooms = [
		{id:1, name: "Chatroom 1"},
		{id:2, name: "Chatroom 2"}
	];
	$scope.selRoom = $scope.rooms[0];

	$scope.changeRoom = function(r){
		$scope.selRoom = r;

		$scope.chats.push({
			name:"Chatroom",
			message:"Now in " + $scope.selRoom.name,
			room:$scope.selRoom.id
		});
	}

	$scope.name = '';
	$scope.typing = false;
	$scope.connected = false;

	$scope.keyboardEnter = function(event) {
		if(event.which === 13){
			if ($scope.name.length > 0) {
				sendMessage();
				// socket.emit('stop typing');
				$scope.typing = false;
			} else {
				$scope.setUsername();
			}
		}
	};

	$scope.setUsername = function(){
		$scope.name = cleanInput($scope.usernameInput);

		// If the username is valid
		if ($scope.name.length > 0) {
			$scope.showhide.usernameSet = true;
			$scope.showhide.login = false;

			// Tell the server your username
			socket.emit('add user', {name:$scope.name, room: $scope.selRoom.id});
		}
	}

	function cleanInput (input){
		return $('<div/>').text(input).text();
	}

	function sendMessage(){
		var localMessage = cleanInput($scope.chatmessage);

		if(localMessage){
			$scope.chats.push({
				name:$scope.name,
				message:localMessage,
				room: $scope.selRoom.id
			});
			$scope.chatmessage = "";
			socket.emit('new message', {message:localMessage, room:$scope.selRoom.id});
		}
	}

	socket.on('login', function(data){
		connected = true;
		// var message = 'Welcome to Chatroom';
		$scope.chats.push({
			name:"Chatroom",
			message:"Welcome " + $scope.name,
			room: data.room
		});
	});

	socket.on("new message", function(data){
		$scope.chats.push({
			name: data.name,
			message: data.message,
			room: data.room
		});
	});

	socket.on('user joined', function(data){
		$scope.chats.push({
			name:'Chatroom',
			message: data.name + " has joined the chatroom",
			room: data.room
		});
	});

	socket.on("user left", function(data){
		$scope.chats.push({
			name:'Chatroom',
			message: data.name + " has LEFT the chatroom"
		});
	});

	$scope.logout = function(){
		urls.logout().then(function(data){
			console.log("data",data);
		});
	}
	$scope.getUsersList = function(a, b){
		$scope.iua = null;
		$scope.usersList  = null;
		urls.getUsers(a, b).then(function(data){
			console.log('data', data);
			if(data == "Incorrect User Authentication"){
				$scope.iua = data;
			}else{
				$scope.usersList = data;
				console.log($scope.usersList);
			}
		});
	}

}]);


app.controller('FirstCtrl', ['$scope', function($scope){

}]);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider.state('first',{
		url:'/first',
		templateUrl:'/public/templates/first.html',
		controller:'MainCtrl'
	})
	.state('second',{
		url:'/second',
		templateUrl:'/public/templates/second.html',
		controller:'MainCtrl'
	});
	$urlRouterProvider.otherwise('first');
}]);