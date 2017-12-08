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
                window.location = '/users/profile';
            })
            .catch((err) => {
                $scope.errors = err.data;
                console.log(err);
                toastr.error($scope.errors.message, 'Error!');
            })
        }
    };
})();