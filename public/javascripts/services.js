app.factory('socket', ['$rootScope', function($rootScope){
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
}]);

app.factory('urls', ['$http', '$q', function($http, $q){
	function logout(){
		var prom = $q.defer();
		$http.get('http://52.10.212.104/logout')
		.success(function(data){prom.resolve(data);})
		.error(function(e){prom.resolve(e);})
		return prom.promise;
	}

	function getUsers(a, b){
		var prom = $q.defer();
		$http.get('http://52.10.212.104/currentUsers?admin='+a+'&pass='+b)
		.success(function(data){prom.resolve(data);})
		.error(function(e){prom.resolve(e);})
		return prom.promise;	
	}

	return{
		logout: logout,
		getUsers: getUsers
	}
}]);
