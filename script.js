angular.module('fl', []).controller('MainCtrl', function($scope, $filter) {
  $scope.data = getObjectInStorage('data') || {
    headers: [],
    toAdd: [],
    added: []
  };
  $scope.column = getObjectInStorage('column', true) || 0;
  $scope.dataToImport = getObjectInStorage('importData') || '';

  function setObjectInStorage(itemName, object, noJson) {
    if (localStorage) {
      var valToSet = noJson ? object : JSON.stringify(object)
      localStorage.setItem(itemName, valToSet);
    }
  }

  function getObjectInStorage(itemName, noJson) {
    if (localStorage) {
      return noJson ? localStorage.getItem(itemName) : JSON.parse(localStorage.getItem(itemName));
    }
  }

  $scope.importData = function() {
    $scope.data.toAdd = CSV.parse($scope.dataToImport, {headers: true});
    $scope.data.headers = $scope.data.toAdd.headers;
    setObjectInStorage('importData', $scope.dataToImport);
  }

  $scope.moveItem = function(item, from, to) {
    $scope.data[to].unshift(item);
    $scope.data[from].splice($scope.data[from].indexOf(item), 1);
  }

  $scope.exportData = function() {
    $scope.dataToExport = CSV.stringify($scope.data.added, {
      forceQuotes: true
    });
  }

  $scope.keyboardMoveItem = function(event, searchProp, from, to) {
    if (event.keyCode === 13) {
      var item = $filter('filter')($scope.data[from], $scope[searchProp])[0];
      $scope.moveItem(item, from, to);
      $scope[searchProp] = '';
    }
  }

  $scope.$watch('data', function(newVal) {
    setObjectInStorage('data', newVal);
  }, true);

  $scope.$watch('column', function(newVal) {
    setObjectInStorage('column', newVal, true);
  });
});