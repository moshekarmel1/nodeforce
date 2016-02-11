var app = angular.module('node-force');
app.controller('MainCtrl', ['$scope', 'force', function($scope, force){
    $scope.hello = 'Hello World';
    $scope.getAccounts = function(){
        force.getAccounts().then(function(result){
            $scope.accounts = result.data.records;
        });
    };

    $scope.getAccount = function(){
    	var id = $scope.accId.trim();
    	if(!id || id === '') return;

    	force.getAccount(id).then(function(res){
    		if(res){
    			console.log(res.acc.BillingAddress);
    			$scope.acc = res.acc;
    			$scope.uas = res.uas;
    			//calculate total balance
    			$scope.acc.totalBal = res.uas.reduce(function(sum, ua){
    				return sum + ua.Utility_Account_Outstanding_Balance__c || 0;
    			}, 0);
    		}else{
    			$scope.error = {
    				message: "Um, we couldn't find anyone with that Id... "
    			};
    		}

    	});
    };
}]);