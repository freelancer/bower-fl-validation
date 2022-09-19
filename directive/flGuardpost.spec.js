'use strict';

describe('Directive: flGuardpost', function () {

  var MOCK_MAILGUN_BASE_URL, MOCK_MAILGUN_API_KEY;
  var $httpBackend, element, $scope, input;

  beforeEach(module('flValidation', function($provide) {
    MOCK_MAILGUN_BASE_URL = 'MOCK_MAILGUN_BASE_URL';
    MOCK_MAILGUN_API_KEY = 'MOCK_MAILGUN_API_KEY';
    $provide.constant('MAILGUN_BASE_URL', MOCK_MAILGUN_BASE_URL);
    $provide.constant('MAILGUN_API_KEY', MOCK_MAILGUN_API_KEY);
  }));

  beforeEach(inject(function (_$httpBackend_) {
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    element = angular.element(
      '<form name="form">' +
        '<input type="email" ng-model="email" name="email" fl-guardpost>' +
      '</form>');
    element = $compile(element)($scope);
    input = element.scope().form.email;
  }));
  
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should reset the $error key when the email is valid',
    function() {
      var validEmail = 'validEmail@valid.fr';
     
      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + validEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(200, {
        is_valid: true
      });
      input.$setViewValue(validEmail);

      expect(input.loading).toBeTruthy();
      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();

      $httpBackend.flush();

      expect(input.$error.guardpostCheck).toBeFalsy();
      expect(input.$error.guardpost).toBeFalsy();
      expect(input.loading).toBeFalsy();

  });

  it('should set the $error key when the email is invalid',
    function() {
      var invalidEmail = 'invalidEmail@invalid.de';

      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + invalidEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(200, {
        is_valid: false
      });
      input.$setViewValue(invalidEmail);

      expect(input.loading).toBeTruthy();
      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();

      $httpBackend.flush();

      expect(input.$error.guardpostCheck).toBeFalsy();
      expect(input.$error.guardpost).toBeTruthy();
      expect(input.loading).toBeFalsy();

  });

  it('should export a suggested correction if any',
    function() {
      var invalidEmail = 'invalidEmail@invalid.fr';
      var suggestedEmail = 'suggestedEmail@suggested.com.au';
     
      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + invalidEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(200, {
        is_valid: false,
        did_you_mean: suggestedEmail
      });
      input.$setViewValue(invalidEmail);

      expect(input.loading).toBeTruthy();
      $httpBackend.flush();
      
      expect(input.suggestion).toBe(suggestedEmail);
      expect(input.loading).toBeFalsy();

  });

  it('should fail safe on error',
    function() {
      var validEmail = 'validEmail@valid.fr';
     
      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + validEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(500);
      input.$setViewValue(validEmail);

      expect(input.loading).toBeTruthy();
      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();

      $httpBackend.flush();

      expect(input.$error.guardpostCheck).toBeFalsy();
      expect(input.$error.guardpost).toBeFalsy();
      expect(input.loading).toBeFalsy();

  });

  it('should fail safe on invalid response',
    function() {
      var validEmail = 'validEmail@valid.fr';
     
      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + validEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(201);
      input.$setViewValue(validEmail);

      expect(input.loading).toBeTruthy();
      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();

      $httpBackend.flush();

      expect(input.$error.guardpostCheck).toBeFalsy();
      expect(input.$error.guardpost).toBeFalsy();
      expect(input.loading).toBeFalsy();

  });

  it('should not take in account a successful validation if the user has' +
  ' already entered something else',
    function() {
      var validEmail = 'validEmail@valid.fr';
      var anotherEmail = 'anotherEmail@another.co.uk';
     
      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + validEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(200, {
        is_valid: true
      });
      input.$setViewValue(validEmail);

      expect(input.loading).toBeTruthy();
      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();

      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + anotherEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(200, {
        is_valid: true
      });
      input.$setViewValue(anotherEmail);
      $httpBackend.flush(1);

      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();
      expect(input.loading).toBeFalsy();
      $httpBackend.flush(1);

  });

  it('should not take in account an error if the user has' +
  ' already entered something else',
    function() {
      var validEmail = 'validEmail@valid.fr';
      var anotherEmail = 'anotherEmail@another.co.uk';
     
      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + validEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(500);
      input.$setViewValue(validEmail);

      expect(input.loading).toBeTruthy();
      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();

      $httpBackend.expectGET(MOCK_MAILGUN_BASE_URL + '/v2/address/validate' +
       '?address=' + anotherEmail + '&api_key=' + MOCK_MAILGUN_API_KEY)
      .respond(200, {
        is_valid: true
      });
      input.$setViewValue(anotherEmail);
      $httpBackend.flush(1);

      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();
      expect(input.loading).toBeFalsy();
      $httpBackend.flush(1);

  });


  it('should not run the validator in the static validation are failing' +
  ' already entered something else',
    function() {
      var notEvenAnEmail = 'notEvenAnEmail';
      input.$setViewValue(notEvenAnEmail);

      expect(input.$error.guardpostCheck).toBeTruthy();
      expect(input.$error.guardpost).toBeTruthy();
      expect(input.loading).toBeUndefined();
  });

});
