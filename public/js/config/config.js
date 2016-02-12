var app = angular.module('node-force');
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/views/home.html',
        controller: 'MainCtrl'
    })
    .state('acc', {
        url: '/acc/{id}',
        templateUrl: '/views/acc.html',
        controller: 'AccCtrl',
        resolve: {
            accUasObj: ['$stateParams', 'force', function($stateParams, force) {
                return force.getAccount($stateParams.id);
            }]
        }
    })
    .state('ua', {
        url: '/ua/{id}',
        templateUrl: '/views/ua.html',
        controller: 'UACtrl',
        resolve: {
            actualUA: ['$stateParams', 'force', function($stateParams, force) {
                console.log($stateParams.id);
                return force.getUtilityAccount($stateParams.id);
            }]
        }
    })
    .state('logout', {
        url: '/logout',
        templateUrl: '/views/logout.html',
        controller: 'LogoutCtrl',
        resolve:{
            out: ['force', function(force){
                return force.logout();
            }]
        }
    })
    .state('validate', {
        url: '/validate/{id}',
        templateUrl: '/views/validate.html',
        controller: 'ValidateCtrl',
        resolve: {
            opp: ['$stateParams', 'force', function($stateParams, force) {
                return force.get($stateParams.id);
            }]
        }
    })
    $urlRouterProvider.otherwise('home');
}])