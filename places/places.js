angular.module('app', ['ngSanitize'])
.controller('main', function($scope, $http, $sce) {
    $scope.issue = 100
    $scope.text = ''
    $scope.$watch('issue', value => {
        $scope.loading = true
        $scope.html = ''
        $scope.text = ''
        $scope.entities = []
        $http.get(`http://localhost:5000/https://aerostatica.ru/volumes/${value}/`)
            .then(response => {
                return $('h1 a', response.data).attr('href')
            })
            .then(link => {
                return $http.get(`http://localhost:5000/https://aerostatica.ru${link}`)
            })
            .then(response => {
                const $content = $('.post-content.markdown', response.data)
                $scope.html = $sce.trustAsHtml($content.html())
                return $content.text()
            })
            .then(text => {
                $scope.text = text
                $scope.loading = false
            })
            .catch(error => {
                $scope.text = ''
                $scope.error = error
                $scope.loading = false
            })
    })
    $scope.filterLoc = item => {
        return item.entity && item.entity === 'I-LOC'
    }
    $scope.extract = function() {
        $scope.loading = true
        $http.post('http://localhost:5005', {text: $scope.text})
        .then(json => {
            $scope.entities = json.data.result
            $scope.loading = false
        })
        .catch(error => {
            $scope.result = ''
            $scope.error = error
            $scope.loading = false
        })
    }
})