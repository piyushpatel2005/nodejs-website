(function () {
    angular.module('tutorialsApp')
    .controller('VideoController', VideoController);

    VideoController.$inject = ['$scope', '$window', '$http'];

    function VideoController($scope, $window, $http) {
        $scope.formData = {
            title: "",
            url: "",
            hour: 0,
            minutes: 0,
            seconds: 0
        };

        $scope.video = $window.video;
        console.log($scope.$parent);
        
        $scope.addVideo = function (data) {
            console.log('scope tutorial', $scope.tutorial);
            $http.post('/tutorials/' + tutorial._id + '/videos', $scope.formData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err.data);
            });
        }
    }
})();