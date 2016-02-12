var app = angular.module('node-force');
app.controller('MainCtrl', ['$scope', 'force', function($scope, force){
    $scope.getAccount = function(){
    	var id = $scope.accId.trim();
    	if(!id || id === '') return;
        location.href = '/#/acc/' + id; 
    };
}]);