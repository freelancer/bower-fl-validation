'use strict';

describe('Directive: flInvalidIf', function () {
  var element, $scope, input;

  beforeEach(module('flValidation'));

  describe('Basic version', function () {
    beforeEach(inject(function($rootScope, $compile) {
      $scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
          '<input ng-model="input" name="input" '+
          ' fl-invalid-if="{something: error1, somethingMore: error2,' +
          ' another: error3}">'+
        '</form>');
      element = $compile(element)($scope);
      input = element.scope().form.input;
    }));

    it('should set a field in the $error object for each key in the conditions'+
      'map that has a true value, and remove the field for each key that has'+
       'a false value',
      function() {
        $scope.error1 = false;
        $scope.error2 = false;
        $scope.error3 = false;
        $scope.$digest();
        expect(input.$error.something).toBeUndefined();
        expect(input.$error.somethingMore).toBeUndefined();
        expect(input.$error.another).toBeUndefined();
        $scope.error1 = true;
        $scope.error2 = true;
        $scope.error3 = true;
        $scope.$digest();
        expect(input.$error.something).toBeTruthy();
        expect(input.$error.somethingMore).toBeTruthy();
        expect(input.$error.another).toBeTruthy();
    });
  });


  describe('Extended version', function() {
    beforeEach(inject(function($rootScope, $compile) {
      $scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
          '<input ng-model="input" name="input" fl-invalid-if="error">' +
        '</form>');
      element = $compile(element)($scope);
      input = element.scope().form.input;
    }));

    it('should set the flInvalidIf $error key when the condition is true',
      function() {
        $scope.error = true;
        $scope.$digest();
        expect(input.$error.flInvalidIf).toBeTruthy();
    });

    it('should not set the flInvalidIf $error key when the condition is false',
      function() {
        $scope.error = false;
        $scope.$digest();
        expect(input.$error.flInvalidIf).toBeFalsy();
    });
  });
});
