'use strict';

describe('Directive: flEnsureUnique', function () {

  var element, $scope, $q, input, UsersMock;

  beforeEach(module('flValidation', function($provide) {
    UsersMock = {};
    UsersMock.check = jasmine.createSpy();
    $provide.value('Users', UsersMock);
  }));

  describe('with email', function() {

    beforeEach(inject(function($rootScope, $compile, _$q_) {
      $scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
          '<input ng-model="email" name="email" fl-ensure-unique="email">' +
        '</form>');
      element = $compile(element)($scope);
      input = element.scope().form.email;
      $q = _$q_;
    }));

    it('should reset the $error keys when the email is valid',
      function() {
        var validEmail = 'validEmail';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(validEmail);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        d.resolve();
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeFalsy();
        expect(input.$error.uniqueInvalid).toBeFalsy();
        expect(input.$error.unique).toBeFalsy();
    });

    it('should set the uniqueInvalid $error key when the email is invalid',
      function() {
        var invalidEmail = 'invalidEmail';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(invalidEmail);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        d.reject({ code: 'INVALID_EMAIL' });
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeFalsy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();
    });

    it('should set the unique $error key when the email is not unique',
      function() {
        var notUniqueEmail = 'notUniqueEmail';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(notUniqueEmail);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        d.reject({ code: 'EMAIL_TAKEN' });
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeFalsy();
        expect(input.$error.uniqueInvalid).toBeFalsy();
        expect(input.$error.unique).toBeTruthy();
    });

    it('should not take in account a successful validation if the user has' +
    ' already entered something else',
      function() {
        var validEmail = 'validEmail';
        var anotherEmail = 'anotherEmail';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(validEmail);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        var d2 = $q.defer();
        UsersMock.check.and.returnValue(d2.promise);
        input.$setViewValue(anotherEmail);
        d.resolve();
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

    });

    it('should not take in account a successful validation if the user has' +
    ' already entered something else',
      function() {
        var notUniqueEmail = 'notUniqueEmail';
        var anotherEmail = 'anotherEmail';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(notUniqueEmail);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        var d2 = $q.defer();
        UsersMock.check.and.returnValue(d2.promise);
        input.$setViewValue(anotherEmail);
        d.reject({ code: 'EMAIL_TAKEN' });
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();
    });

  });

  describe('with username', function() {

    beforeEach(inject(function($rootScope, $compile, _$q_) {
      $scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
          '<input ng-model="username" name="username" ' +
          'fl-ensure-unique="username">' +
      '</form>');
      element = $compile(element)($scope);
      input = element.scope().form.username;
      $q = _$q_;
    }));

    it('should reset the $error keys when the username is valid',
      function() {
        var validUsername = 'validUsername';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(validUsername);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        d.resolve();
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeFalsy();
        expect(input.$error.uniqueInvalid).toBeFalsy();
        expect(input.$error.unique).toBeFalsy();
    });

    it('should set the uniqueInvalid $error key when the username is invalid',
      function() {
        var invalidUsername = 'invalidUsername';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(invalidUsername);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        d.reject({ code: 'INVALID_USERNAME' });
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeFalsy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();
    });

    it('should set the unique $error key when the username is not unique',
      function() {
        var notUniqueUsername = 'notUniqueUsername';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        input.$setViewValue(notUniqueUsername);
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeTruthy();
        expect(input.$error.uniqueInvalid).toBeTruthy();
        expect(input.$error.unique).toBeTruthy();

        d.reject({ code: 'USERNAME_TAKEN' });
        $scope.$digest();

        expect(input.$error.uniqueCheck).toBeFalsy();
        expect(input.$error.uniqueInvalid).toBeFalsy();
        expect(input.$error.unique).toBeTruthy();
    });

  });

  describe('with username recommendation', function() {
    
    var emailInput, usernameInput;

    beforeEach(inject(function($rootScope, $compile, _$q_) {
      $scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
          '<input ng-model="email" name="email" ' +
          'fl-ensure-unique="email"' + 
          'fl-ensure-unique-recommend-username="username">' +
          '<input ng-model="username" name="username" ' +
      '</form>');
      element = $compile(element)($scope);
      emailInput = element.scope().form.email;
      usernameInput = element.scope().form.username;
      $q = _$q_;
    }));

    it('should suggest a username when the email is valid',
      function() {
        var validEmail = 'validEmail';
        var suggestedUsername = 'suggestedUsername';
        var d = $q.defer();
        UsersMock.check.and.returnValue(d.promise);

        emailInput.$setViewValue(validEmail);
        d.resolve({ recommended_name: suggestedUsername });
        $scope.$digest();

        expect(usernameInput.$viewValue).toBe(suggestedUsername);
    });

  });

});
