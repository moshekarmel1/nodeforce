var app = angular.module('node-force');
app.factory('force', ['$http','$window', function($http, $window){
    var o = {
        data: []
    };

    o.getAccounts = function() {
        return $http.get('/accounts').success(function(data){
            angular.copy(data, o.data);
        });
    };

    return o;
}]);