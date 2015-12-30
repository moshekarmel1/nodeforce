var app = angular.module('node-force');
app.controller('LogoutCtrl', ['$scope', 'force', 'out', function($scope, force, out){
    console.log(out);
}]);