(function () {
    angular.module('tutorialsApp')
    .controller('TutorialsController', TutorialsController);

    TutorialsController.$inject = ['$scope', '$window', '$http'];

    function TutorialsController($scope, $window, $http){
        $scope.tutorials = $window.tutorials;
        $scope.tutorial = $window.tutorial;

        $scope.formData = {
            title: $scope.title,
            description: $scope.description
        };

        $scope.createTutorial = function (data) {
            $http.post('/tutorials', data)
            .then((response) => {
                toastr.success('Your tutorial has been created!', 'Success');
                console.log(response);
                window.location = '/tutorials/' + response.data._id;
            })
            .catch((err) => {
                $scope.errors = err.data;
                toastr.error($scope.errors.message, 'Error!');
            });
        };

        $scope.editTutorial = function () {
            console.log
            $http.put('/tutorials/' + tutorial._id, $scope.tutorial)
            .then((response) => {
                window.location = '/tutorials/' + response.data.id;
            })
            .catch((err) => {
                toastr.error(err.data.message, 'Error!');
            });
        }
    }
})();