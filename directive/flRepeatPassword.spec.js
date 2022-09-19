'use strict';

describe('Directive: flRepeatPassword', function () {

  var element, $scope, passwordInput, confirmPasswordInput;

  beforeEach(module('flValidation'));

  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    element = angular.element(
      '<form name="form">' +
        '<input ng-model="password" name="password">' +
        '<input ng-model="confirmPassword" name="confirmPassword" ' +
        'fl-repeat-password="password">' +
      '</form>');
    element = $compile(element)($scope);
    passwordInput = element.scope().form.password;
    confirmPasswordInput = element.scope().form.confirmPassword;
  }));

  it('should set the repeat $error keys when the inputs are different',
    function() {
      var myPassword = 'myPassword';
      var myConfirmPassword = 'myConfirmPassword';
      passwordInput.$setViewValue(myPassword);
      confirmPasswordInput.$setViewValue(myConfirmPassword);

      $scope.$digest();
      expect(confirmPasswordInput.$error.repeat).toBeTruthy();
  });

  it('should not set the repeat $error keys when the inputs are the same',
    function() {
      var myPassword = 'myPassword';
      passwordInput.$setViewValue(myPassword);
      confirmPasswordInput.$setViewValue(myPassword);

      $scope.$digest();
      expect(confirmPasswordInput.$error.repeat).toBeFalsy();
  });

  it('should reset the repeat $error keys when the inputs are the same',
    function() {
      var myPassword = 'myPassword';
      var myConfirmPassword = 'myConfirmPassword';
      passwordInput.$setViewValue(myPassword);
      confirmPasswordInput.$setViewValue(myConfirmPassword);

      $scope.$digest();
      expect(confirmPasswordInput.$error.repeat).toBeTruthy();

      confirmPasswordInput.$setViewValue(myPassword);
      $scope.$digest();
      expect(confirmPasswordInput.$error.repeat).toBeFalsy();
  });

});
