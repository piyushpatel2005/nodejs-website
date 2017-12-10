(function (){
    angular.module('tutorialsApp')
    .controller('SignupFormController', SignupFormController);

    SignupFormController.$inject = ['$scope', '$http'];

    function SignupFormController ($scope, $http) {
        $scope.formData = {
            firstName: "Admin",
            lastName: "Patel",
            email: "abc@example.com",
            password: "Abc12345",
            confirmation: "Abc12345"
        };

        $scope.errors = {};

        $scope.signup = (data) => {
            $http.post('/users/signup/', {
                firstName: $scope.formData.firstName,
                lastName: $scope.formData.lastName,
                email: $scope.formData.email,
                password: $scope.formData.password,
                confirmation: $scope.formData.confirmation,
            })
            .then((response) => {
                // if successful then redirect
                window.location = '/users/' + response.data.id;
            })
            .catch((err) => {
                $scope.errors = err.data;
                toastr.error($scope.errors.message, 'Error!', {
                    closeButton: true
                });
            });

        }
    }
})();