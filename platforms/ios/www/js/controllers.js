var tdgrsvp = angular.module('tdgrsvp.controllers', ['pickadate']);

    tdgrsvp.controller('LoginCtrl', function ($scope, $http, $location, UiInfo) {

        //Verifica se está logado
        if(window.localStorage.logged)
            $location.path('/events');

        $scope.loginData = {};

        $scope.doLogin = function() {

            if($scope.loginData.email && $scope.loginData.password)
            {
                var loginPost = {};
                    loginPost.email = $scope.loginData.email;
                    loginPost.password = md5($scope.loginData.password);

                $http
                    .post(UiInfo.baseUrl +'login', loginPost)
                    .success(function(response) {
                        switch(response.status)
                        {
                            case 'success':
                                window.localStorage.logged = true;
                                window.localStorage.id = response.data.id;
                                window.localStorage.name = response.data.name;
                                $location.path('/events');
                            break;
                            case 'error':
                                alert(response.message);
                            break;
                            case 'fail':
                                alert('Informe seu e-mail e senha');
                            break;
                        }
                    });
            } else {
                alert('Informe seu e-mail e senha');
            }
        }
    });

    tdgrsvp.controller('EventsCtrl', function ($scope, $rootScope, $http, $location, $ionicModal, UiEvent) {

        //Verifica se está logado
        if(!window.localStorage.dateEvent)
        {
            var dateToday = new Date();
            var day = dateToday.getDate();
            var month = parseInt(dateToday.getMonth()) + 1;
            var year = dateToday.getFullYear();

            if(day <= 9) day = '0'+ day;
            if(month <= 9) month = '0'+ month;

            window.localStorage.dateEvent = day +'/'+ month +'/'+ year
            $scope.dateEvent = window.localStorage.dateEvent;
        } else {
            $scope.dateEvent = window.localStorage.dateEvent;
        }
        
        //Lista os eventos do dia selecionado
        UiEvent.findByDate($scope.dateEvent);

        $ionicModal.fromTemplateUrl('templates/popup-events.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modalEvents = modal;
            });

        $ionicModal.fromTemplateUrl('templates/popup-date.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modalDate = modal;
            });

        $scope.showEvents = function(eventSelected) {
            $scope.event = eventSelected;
            $scope.modalEvents.show();
        };

        $scope.hideEvents = function() {
            $scope.modalEvents.hide();
        };

        $scope.showDate = function()
        {
            $scope.modalDate.show();
        };

        $scope.hideDate = function()
        {
            $scope.modalDate.hide();
        };

        $scope.setDate = function(dateSelected)
        {
            $scope.modalDate.hide();

            if(dateSelected.indexOf('-') > -1)
            {
                dateSelected = dateSelected.split('-');
                dateSelected = dateSelected[2] +'/'+ dateSelected[1] +'/'+ dateSelected[0]; 
            }

            $scope.dateEvent = dateSelected;

            window.localStorage.dateEvent = $scope.dateEvent;

            //Lista os eventos do dia selecionado
            UiEvent.findByDate($scope.dateEvent);
        };
    });

    tdgrsvp.controller('LettersCtrl', function ($scope, $stateParams, UiEvent) {

        if(!$stateParams.eventId)
            $location.path('/events');

        $scope.dateEvent = window.localStorage.dateEvent;
        $scope.event = {id: "0", title: "TODOS OS CONVIDADOS"};

        if($stateParams.eventId != '0')
            $scope.event = UiEvent.findById($stateParams.eventId);
    });

    tdgrsvp.controller('NamesCtrl', function ($scope, $http, $stateParams, $ionicModal, UiInfo, UiEvent) {

        if(!$stateParams.eventId)
            $location.path('/events');

        $scope.dateEvent = window.localStorage.dateEvent;
        $scope.event = {id: "0", title: "TODOS OS CONVIDADOS"};

        if($stateParams.eventId != '0')
            $scope.event = UiEvent.findById($stateParams.eventId);

        var namePost = {};
            namePost.event_id = $stateParams.eventId;
            namePost.letter = $stateParams.letter;
            namePost.date = window.localStorage.dateEvent;

        $http
            .post(UiInfo.baseUrl +'names', namePost)
            .success(function(response) {
                if(response.data.length > 0)
                {   
                    $scope.names = response.data; 
                } else {
                    $scope.names = [];
                }
            });

        $ionicModal.fromTemplateUrl('templates/popup-name.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
            });

        $scope.showInfo = function(nameSelected) {
            $scope.nameData = { seat: nameSelected.seat, control: nameSelected.control };
            $scope.name = nameSelected;
            $scope.modal.show();
        };

        $scope.hideInfo = function() {
            $scope.modal.hide();
        };

        $scope.cancelName = function(name) {
            name.seat = "";
            name.control = "";
            name.confirmed = 0;

            $http
                .post(UiInfo.baseUrl +'save', name)
                .success(function(response) {
                    if(response.status == 'success')
                    {   
                        alert('Dados salvos com sucesso!');
                    } else {
                        alert('Erro ao salvar dados');
                    }
                    $scope.modal.hide();
                });
        };

        $scope.saveName = function(name) {

            if($scope.nameData.control == "")
            {
                alert('Informe o número do controle');
            } else {

                if($scope.nameData.control < 1000 || $scope.nameData.control > 2000)
                    alert('Informe um controle entre 1000 e 2000!');
                else {
                    name.seat = $scope.nameData.seat;
                    name.control = $scope.nameData.control;
                    name.confirmed = 1;

                    if(name.control >= 1000 && name.control <= 1099)
                        name.color = "branco";

                    if(name.control >= 1100 && name.control <= 1199)
                        name.color = "verde";

                    if(name.control >= 1200 && name.control <= 1299)
                        name.color = "azul";

                    if(name.control >= 1300 && name.control <= 1399)
                        name.color = "amarelo";

                    if(name.control >= 1400 && name.control <= 2000)
                        name.color = "vermelho";

                    $http
                        .post(UiInfo.baseUrl +'save', name)
                        .success(function(response) {
                            if(response.status == 'success')
                            {   
                                alert('Dados salvos com sucesso!');
                            } else {
                                alert('Erro ao salvar dados');
                            }
                            $scope.modal.hide();
                        });
                }
            }
        };
    });

    // tdgrsvp.controller('EmployeeDetailCtrl', function ($scope, $stateParams, EmployeeService) {
    //     EmployeeService.findById($stateParams.employeeId).then(function(employee) {
    //         $scope.employee = employee;
    //     });
    // });

    // tdgrsvp.controller('EmployeeReportsCtrl', function ($scope, $stateParams, EmployeeService) {
    //     EmployeeService.findByManager($stateParams.employeeId).then(function(employees) {
    //         $scope.employees = employees;
    //     });
    // });
