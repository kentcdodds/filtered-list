angular.module('fl').controller('MainCtrl', function($scope, angularFire, angularFireAuth, $filter, $modal) {
  var ref, dataWatcher, columnWatcher, localStorageEnabled = true;

  var localStorageHelper = {
    set: function(itemName, object, noJson) {
      if (localStorage && localStorageEnabled) {
        var valToSet = noJson ? object : JSON.stringify(object)
        localStorage.setItem(itemName, valToSet);
      }
    },
    get: function(itemName, noJson) {
      if (localStorage && localStorageEnabled) {
        return noJson ? localStorage.getItem(itemName) : JSON.parse(localStorage.getItem(itemName));
      }
    },
    remove: function(itemName) {
      if (localStorage && localStorageEnabled) {
        localStorage.removeItem(itemName);
      }
    }
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  $scope.datasets = localStorageHelper.get('datasets') || getDatasetsDefaults();
  $scope.currentDataIndex = 0;

  ref = new Firebase('https://filtered-list.firebaseio.com/');
  angularFireAuth.initialize(ref, {
    scope: $scope, name: 'user',
    callback: function(err, user) {
      if (user && !localStorageEnabled) {
        angularFire(new Firebase('https://filtered-list.firebaseio.com/datasets'), $scope, 'datasets');
      }
    }
  });
  
  function getDatasetsDefaults() {
    return [
      new Dataset('Default Dataset')
    ];
  }

  function Dataset(name) {
    return {
      name: name,
      headers: [],
      toAdd: [],
      added: [],
      dataSource: '',
      users: [],
      admins: []
    }
  }

  $scope.tabs = [
    {title:'Options', page: 'views/options.html'},
    {title:'To Add', page: 'views/to-add.html'},
    {title:'Added', page: 'views/added.html'},
    {title:'About', page: 'views/about.html'}
  ];

  $scope.datasetHeaders = ['Name'];
  
  $scope.importData = function(position) {
    var newData = CSV.parse($scope.editingDataset.dataSource, {headers: true});
    var dataset = $scope.editingDataset;
    dataset.toAdd = newData;
    dataset.headers = newData.headers;
    delete dataset.toAdd.headers;
    if (!angular.isNumber(position) || position > $scope.datasets.length || position < 0) {
      position = $scope.datasets.length;
    }
    $scope.datasets[position] = dataset;
    $scope.editingDataset = null;
  }

  $scope.editDataset = function(dataset, $index) {
    $scope.editingDataset = dataset || new Dataset();
    $scope.editingPosition = $index;
    $modal({template: 'views/dataset-modal.html', scope: $scope});
  }

  $scope.moveItem = function(item, from, to) {
    if (!item && $scope.datasets[$scope.currentDataIndex][from].length > 0) {
      return;
    }
    if (!$scope.datasets[$scope.currentDataIndex][to]) {
      $scope.datasets[$scope.currentDataIndex][to] = [];
    }
    $scope.datasets[$scope.currentDataIndex][to].unshift(item);
    $scope.datasets[$scope.currentDataIndex][from].splice($scope.datasets[$scope.currentDataIndex][from].indexOf(item), 1);
  }
  
  $scope.exportData = function() {
    $scope.dataToExport = CSV.stringify([$scope.datasets[$scope.currentDataIndex].headers].concat($scope.datasets[$scope.currentDataIndex].added), {
      forceQuotes: true
    });
  }
  
  $scope.deleteDatasets = function(id) {
    localStorageHelper.remove('datasets');
    $scope.datasets = getDatasetsDefaults();
  }
  
  dataWatcher = $scope.$watch('datasets', function(newVal) {
    localStorageHelper.set('datasets', newVal);
  }, true);
  
  $scope.createUser = function(email, password) {
    angularFireAuth.createUser(email, password, function(error, user) {
      console.log('new user created');
    });
  }
  
  $scope.login = function(email, password) {
    angularFireAuth.login('password', {
      email: email,
      password: password
    });
  }
  
  $scope.logout = function() {
    angularFireAuth.logout();
  }
  
});