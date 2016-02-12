var app = angular.module('node-force');
app.controller('AccCtrl', ['$scope', 'force', 'accUasObj', function($scope, force, accUasObj){
    $scope.acc = accUasObj.acc;
    $scope.uas = accUasObj.uas;

    $scope.acc.totalBal = accUasObj.uas.reduce(function(sum, ua){
        return sum + ua.Utility_Account_Outstanding_Balance__c || 0;
    }, 0);
}]);