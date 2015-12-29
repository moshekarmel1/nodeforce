var app = angular.module('node-force');
app.controller('ValidateCtrl', ['$scope', 'force', 'opp', function($scope, force, opp){
	$scope.errors = 0;
	opp = validate(opp);
    $scope.opp = opp.Opportunity;
    $scope.IQs = opp.IQs;
    $scope.Tenors = opp.Tenors;

    $scope.errorCriteria = opp.ErrorCriteria;

    function validate(obj){
	    obj.IQs.forEach(function(iq){
	        obj.Tenors.forEach(function(tenor){
	            obj.ErrorCriteria.forEach(function(errCriteria){
	                if(eval(errCriteria.criteria)){
	                    errCriteria.criteriaMet = true;
	                    $scope.errors += 1;
	                }
	            });
	        });
	    });
	    return obj;
	};
}]);