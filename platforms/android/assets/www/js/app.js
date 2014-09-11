// angular.module is a global place for creating, registering and retrieving Angular modules
// 'directory' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'directory.services' is found in services.js
// 'directory.controllers' is found in controllers.js
var tdgrsvp = angular.module('tdgrsvp', ['ionic', 'tdgrsvp.services', 'tdgrsvp.controllers']);
    tdgrsvp.run(function($ionicPlatform, $location) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }

            if(!window.localStorage.logged || window.localStorage.logged == 'false')
            {
                window.localStorage.logged = false;
                window.localStorage.id = null;
                window.localStorage.name = null;

                //Verifica se está logado
                $location.path('/login');
            }
        });
    });

    tdgrsvp.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('events', {
                url: '/events',
                templateUrl: 'templates/events.html',
                controller: 'EventsCtrl'
            })

            .state('letters', {
                url: '/letters/:eventId',
                templateUrl: 'templates/letters.html',
                controller: 'LettersCtrl'
            })

            .state('names', {
                url: '/names/:eventId/:letter',
                templateUrl: 'templates/names.html',
                controller: 'NamesCtrl'
            })

            // .state('employee-detail', {
            //     url: '/employee/:employeeId',
            //     templateUrl: 'templates/employee-detail.html',
            //     controller: 'EmployeeDetailCtrl'
            // })

            // .state('employee-reports', {
            //     url: '/employee/:employeeId/reports',
            //     templateUrl: 'templates/employee-reports.html',
            //     controller: 'EmployeeReportsCtrl'
            // });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });

