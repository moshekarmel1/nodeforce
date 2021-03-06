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

    o.getAccount = function(id) {
        return $http.get('/accounts/' + id).then(function(res){
            return res.data;
        });
    };

    o.getUtilityAccount = function(id) {
        return $http.get('/uas/' + id).then(function(res){
            return res.data;
        });
    };

    o.getInvoices = function(id) {
        return $http.get('/inv/' + id).then(function(res){
            return res.data;
        });
    };

    o.saveUtilityAccount = function(ua){
        return $http.post('/uas/', ua).then(function(res){
            return res.data;
        });
    };

    o.get = function(id) {
        return $http.get('/validate/' + id).then(function(res){
            return res.data;
        });
    };

    o.logout = function(){
    	return $http.get('/logout').then(function(data){
            return data;
        });	
    };

    return o;
}]);