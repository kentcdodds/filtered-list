angular.module('fl').controller('MainCtrl', function($scope, angularFire, $filter, $modal, $location, $window) {
  var ref, dataWatcher, columnWatcher;

  function getDefaultDataset(data) {
    data = data || {};
    return {
      name: data.name || '',
      headers: data.headers || [],
      toAdd: data.toAdd || [],
      added: data.added || [],
      dataSource: data.dataSource || ''
    }
  }

  $scope.init = function() {
    setupFirebase($location.path().substring(1, $location.path().length));
  }

  $scope.go = function(path) {
    $location.path(path);
  }

  $scope.unbindFirebase = function() {
    //ref;
  }

  function setupFirebase(name, password) {
    if (!name) {
      return;
    }
    password = password || (function() {
      return $window.prompt('What\'s the password for dataset "' + name + '?"');
    })();
    ref = new Firebase('https://filtered-list.firebaseio.com/datasets/' + name + '/' + password);
    angularFire(ref, $scope, 'dataset');

    dataWatcher = $scope.$watch('dataset', function() {
      if ($scope.dataset) {
        if($scope.dataset.added && $scope.dataset.added.length) {
          $scope.dataset.exportData = CSV.stringify([$scope.dataset.headers].concat($scope.dataset.added), {
            forceQuotes: true
          });
        } else {
          $scope.dataset.exportData = '';
        }
      }
    });
  }

  $scope.tabs = [
    {title:'To Add', page: 'views/to-add.html'},
    {title:'Added', page: 'views/added.html'},
    {title:'Export', page: 'views/export.html'},
    {title:'About', page: 'views/about.html'}
  ];

  $scope.createDataset = function(data) {
    data.toAdd = CSV.parse(data.dataSource, {headers: true});
    data.headers = data.toAdd.headers;
    delete data.toAdd.headers;
    $scope.dataset = getDefaultDataset(data);

    setupFirebase(data.name, data.password);
    $location.path('/' + data.name);
  }

  $scope.moveItem = function(item, from, to) {
    if (!item && $scope.dataset[from].length > 0) {
      return;
    }
    if (!$scope.dataset[to]) {
      $scope.dataset[to] = [];
    }
    $scope.dataset[to].unshift(item);
    $scope.dataset[from].splice($scope.dataset[from].indexOf(item), 1);
  }
  
  $scope.deleteDataset = function(id) {
    ref.remove();
    $scope.go('/');
  }

});