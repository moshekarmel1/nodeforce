var app = angular.module('node-force');
app.controller('MainCtrl', ['$scope', '$window', 'force',function($scope, $window, force){
    $scope.hello = 'Hello World';

    $scope.getAccounts = function(){
        force.getAccounts().then(function(result){
            $scope.accounts = result.data.records;
        });
    };
}]);