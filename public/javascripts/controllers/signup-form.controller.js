(function (){
    angular.module('tutorialsApp')
    .controller('SignupFormController', SignupFormController);

    SignupFormController.$inject = ['$scope', '$http'];

    function SignupFormController ($scope, $http) {
        $scope.formData = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmation: ""
        };

        $scope.signup = (data) => {
            // $http.post('http://localhost:3000/users/signup/', {
            //     firstName: $scope.formData.firstName,
            //     lastName: $scope.formData.lastName,
            //     email: $scope.formData.email,
            //     password: $scope.formData.password,
            //     confirmation: $scope.formData.confirmation,
            // })
            // .then((success) => {
            //     // if successful then redirect
            //     window.location = '/profile';
            // })
            // .catch((err) => {
            //     console.log('eror',err );
            // });
            console.log(data);
            $http({
                url: "http://localhost:3000/users/signup",
                method: "POST",
                data: {
                    "firstName": data.firstName,
                    "lastName": data.lastName,
                    "email": data.email,
                    "password": data.password,
                    "confirmation": data.confirmation
                },
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }

            })
            .then((success) => {
                window.location = 'profile';
            })  
            .catch((err) => {
                console.log('err', err);
            });
        }
    }
})();