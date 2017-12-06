(function () {
    angular.module('tutorialsApp')
    .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['$scope', '$http'];

    LoginFormController = function ($scope, $http) {
        $scope.formData = {
            email: "",
            password: ""
        };

        $scope.signin = function (data) {
            $http.post('/users/signin', data)
            .then((success) => {
                window.location = '/users/profile';
            })
            .catch((err) => {
                $scope.failed = true;
            })
        }
    }
})();