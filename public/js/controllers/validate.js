var app = angular.module('node-force');
app.controller('ValidateCtrl', ['$scope', 'force', 'opp', function($scope, force, opp){
    $scope.opp = opp.Opportunity;
    $scope.IQs = opp.IQs;
    $scope.Tenors = opp.Tenors;
}]);