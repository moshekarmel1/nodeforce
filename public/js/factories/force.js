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

    o.get = function(id) {
        return $http.get('/validate/' + id).then(function(res){
            return res.data;
        });
    };

    o.logout = function(){
    	return $http.get('/logout').success(function(data){
            console.log(data);
        });	
    };

    return o;
}]);