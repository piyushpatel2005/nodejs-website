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
        
        $scope.addVideo = function (data) {
            console.log('scope tutorial', tutorial);
            $http.post('/tutorials/' + tutorial.id + '/videos/', $scope.formData)
            .then((response) => {
                console.log(response.data);
                console.log($window.tutorial);
                $window.tutorial.videos.push(response.data.video);
                // TODO: update dom automatically on addition
                window.location = '/tutorials' + tutorial.id;
            })
            .catch((err) => {
                console.log(err.data);
                toastr.error(err.data.message, 'Error!');
            });
        };

        $scope.updateVideo = function () {
            $http.put('/tutorials/' + $window.tutorial.id + '/videos/' + video.id, video)
            .then((response) => {
                console.log(response.data);
                window.location = '/tutorials/' + $window.tutorial.id;
                
            })
            .catch((err) => {
                console.log(err.data);
                toastr.error(err.data.message, "Error!");
            });
        };

        $scope.deleteVideo = function (id) {
            $http.delete('/tutorials/' + $window.tutorial.id + '/videos/' + id)
            .then((response) => {
                console.log(response.data);
                toastr.success(response.data.message, 'Success!');
                console.log($scope.tutorial);
                // TODO: update dom automatically
                // try {
                // $scope.tutorial.videos = $scope.tutorial.videos.filter((video) => {
                //     video.id !== id;
                // });
                // }catch(err) {
                //     console.log(err);
                // }
                $window.location = '/tutorials/' + $window.tutorial.id;
            })
            .catch((err) => {
                console.log(err.data);
                toastr.error(err.data.message, 'Error!');
            });
        };

    }
})();