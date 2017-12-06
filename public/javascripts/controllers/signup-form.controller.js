(function (){
    angular.module('tutorialsApp')
    .controller('SignupFormController', SignupFormController);

    SignupFormController.$inject = ['$scope', '$http'];

    function SignupFormController ($scope, $http) {
        $scope.formData = {
            firstName: "Piyush  ",
            lastName: "Patel",
            email: "abc@example.com",
            password: "Nectar1985",
            confirmation: "Nectar1985"
        };

        $scope.errors = {};

        $scope.signup = (data) => {
            $http.post('http://localhost:3000/users/signup/', {
                firstName: $scope.formData.firstName,
                lastName: $scope.formData.lastName,
                email: $scope.formData.email,
                password: $scope.formData.password,
                confirmation: $scope.formData.confirmation,
            })
            .then((success) => {
                // if successful then redirect
                window.location = '/users/profile';
            })
            .catch((err) => {
                $scope.errors = err.data;
                console.log($scope.errors);
                toastr.error($scope.errors.message, 'Error!');
            });

        }
    }
})();