var app = angular.module('node-force');
app.controller('NavCtrl', ['$scope', 'force', function($scope, force){
	$scope.logout = function(){
		force.logout();
	};
}]);
