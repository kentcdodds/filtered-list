angular.module('fl', ['firebase', '$strap.directives']);

// Using old version of angular that doesn't have the ngKeyup directive built in.
angular.module('fl').directive('ngKeyup', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngKeyup']);
    element.bind('keyup', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  };
});

angular.module('fl').controller('MainCtrl', function($scope, angularFire, angularFireAuth, $filter, $routeParams) {
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

  var dataName = getParameterByName('data') || '';
  
  $scope.data = getDataDefaults();
  if (dataName) {
    localStorageEnabled = false;
  }

  ref = new Firebase('https://filtered-list.firebaseio.com/');
  angularFireAuth.initialize(ref, {
    scope: $scope, name: 'user',
    callback: function(err, user) {
      if (user && !localStorageEnabled) {
        angularFire(new Firebase('https://filtered-list.firebaseio.com/' + dataName), $scope, 'data');
      }
    }
  });
  
  function getDataDefaults() {
    return {
      headers: [],
      toAdd: [],
      added: [],
      dataToImport: '',
      column: 0
    };
  }
  
  $scope.options = {
    buttonText: 'Options'
  }
  
  $scope.importData = function() {
    $scope.data.toAdd = CSV.parse($scope.data.dataToImport, {headers: true});
    $scope.data.headers = $scope.data.toAdd.headers;
  }
  
  $scope.moveItem = function(item, from, to) {
    if (!item && $scope.data[from].length > 0) {
      return;
    }
    if (!$scope.data[to]) {
      $scope.data[to] = [];
    }
    $scope.data[to].unshift(item);
    $scope.data[from].splice($scope.data[from].indexOf(item), 1);
  }
  
  $scope.exportData = function() {
    $scope.dataToExport = CSV.stringify([$scope.data.headers].concat($scope.data.added), {
      forceQuotes: true
    });
  }
  
  $scope.keyboardMoveItem = function(event, searchProp, from, to) {
    if (event.keyCode === 13 && $scope.data[from].length > 0) {
      var item = $filter('filter')($scope.data[from], $scope[searchProp])[0];
      if (!item) {
        alert($scope[searchProp] + ' is not in this list');
        return;
      }
      $scope.moveItem(item, from, to);
      $scope[searchProp] = '';
    }
  }
  
  $scope.deleteDataset = function(id) {
    localStorageHelper.remove('data');
    $scope.data = getDataDefaults();
  }
  
  dataWatcher = $scope.$watch('data', function(newVal) {
    localStorageHelper.set('data', newVal);
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