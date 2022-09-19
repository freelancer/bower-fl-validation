'use strict';

describe('Directive: flDifferentFrom', function () {

  var element, $scope, usernameInput, passwordInput;

  beforeEach(module('flValidation'));

  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    element = angular.element(
      '<form name="form">' +
        '<input ng-model="username" name="username">' +
        '<input ng-model="password" name="password" ' +
        'fl-different-from="username">' +
      '</form>');
    element = $compile(element)($scope);
    usernameInput = element.scope().form.username;
    passwordInput = element.scope().form.password;
  }));

  it('should set the different $error keys when the inputs are the same',
    function() {
      var myUsername = 'myUsername';
      usernameInput.$setViewValue(myUsername);
      passwordInput.$setViewValue(myUsername);
      $scope.$digest();
      expect(passwordInput.$error.different).toBeTruthy();
  });

  it('should not set the different $error keys when the inputs are different',
    function() {
      var myUsername = 'myUsername';
      var myPassword = 'myPassword';
      usernameInput.$setViewValue(myUsername);
      passwordInput.$setViewValue(myPassword);
      $scope.$digest();
      expect(passwordInput.$error.different).toBeFalsy();
  });
  
  it('should reset the different $error keys when the inputs are different',
    function() {
      var myUsername = 'myUsername';
      var myPassword = 'myPassword';
      usernameInput.$setViewValue(myUsername);
      passwordInput.$setViewValue(myUsername);
      $scope.$digest();
      expect(passwordInput.$error.different).toBeTruthy();
      passwordInput.$setViewValue(myPassword);
      $scope.$digest();
      expect(passwordInput.$error.different).toBeFalsy();
  });

});
