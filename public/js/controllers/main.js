var app = angular.module('node-force');
app.controller('MainCtrl', ['$scope', 'force', function($scope, force){
    $scope.hello = 'Hello World';
    $scope.getAccounts = function(){
        force.getAccounts().then(function(result){
            $scope.accounts = result.data.records;
        });
    };

    $scope.getUtilityAccount = function(){
    	var num = $scope.uaNum.trim();
    	if(!num || num === '') return;

    	force.getUtilityAccount(num).then(function(res){
    		if(res.length > 0){
    			$scope.ua = res[0];
    		}else{
    			$scope.error = {
    				message: "Um, we couldn't find anyone with that number... "
    			};
    		}

    	});
    };
}]);