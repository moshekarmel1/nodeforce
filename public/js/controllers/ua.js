var app = angular.module('node-force');
app.controller('UACtrl', ['$scope', 'force', 'actualUA', function($scope, force, actualUA){
	if(actualUA.length > 0){
    	$scope.actualUA = actualUA[0];
	}else{
		$scope.error = {
			message: "We couldn't find a Utility Account with this Id..."
		};
	}

	$scope.getInvoices = function(){
		force.getInvoices($scope.actualUA.Id).then(function(res){
			$scope.invoices = res;
		});
	};
}]);


