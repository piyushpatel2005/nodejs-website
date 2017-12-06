(function () {
    angular.module('tutorialsApp')
    .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['$scope', '$http'];

    function LoginFormController($scope, $http) {
        $scope.formData = {
            email: "abc@example.com",
            password: "Abc12345"
        };

        $scope.signin = function (data) {
            $http.put('/users/signin', data)
            .then((success) => {
                window.location = '/tutorials';
            })
            .catch((err) => {
                
            })
        }
    };
})();