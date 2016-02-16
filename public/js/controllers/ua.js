var app = angular.module('node-force');
app.controller('UACtrl', ['$scope', 'force', 'actualUA', function($scope, force, actualUA){
	if(actualUA.length > 0){
    	$scope.actualUA = actualUA[0];
	}else{
		$scope.message = {
			title: "Sorry",
			message: "We couldn't find a Utility Account with this Id...",
			class: "danger"
		};
	}

	$scope.getInvoices = function(){
		force.getInvoices($scope.actualUA.Id).then(function(res){
			$scope.invoices = res;
		});
	};

	$scope.saveUtilityAccount = function(){
		force.saveUtilityAccount($scope.actualUA).then(function(res){
			if(res.success){
				$scope.editing = false;
				$scope.message = {
					title: "Success",
					message: "Your mailing address has been updated.",
					class: "success"
				};
			}else{
				$scope.message = {
					title: "Sorry",
					message: "Something went wrong during the update...",
					class: "danger"
				};
			}
		});
	};
}]);


