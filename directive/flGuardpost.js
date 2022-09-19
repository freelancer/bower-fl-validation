'use strict';
/* jshint camelcase: false */
angular.module('flValidation')
  // jshint ignore:start
  /**
  * @ngdoc directive
  * @name flValidation.directive:flGuardpost
  * @element input
  * @function
  *
  * @description
  * Async validator using the Guardpost API from MailGun to ensure that an
  * email is valid (based on domain name, email naming rules & DNS / Mail
  * servers). Sets a "guardpostCheck" $error key when running and a
  * "guardpost" when the email is invalid.
  *
  * Also able to suggest a corrected spelling for a invalid email
  * ("something@gmai.com" will be corrected in "something@gmail.com") through
  * the "suggestion" ngModelController key (see usage bellow).
  *
  * @usage
  * <!-- Pass the name of the field that you want to validate ("username" or
  * "email") to the directive -->
  * <form name="form">
  *   <input type="text" name="email" ng-model="user.email" fl-guardpost>
  *   <div ng-messages="form.email.$error">
  *     <span class="validation-info" ng-message="guardpostCheck">
  *       Checking email availability...
  *     </span>
  *     <span class="validation-error" ng-message="guardpost">
  *       Invalid email. 
  *       <span ng-if="form.email.suggestion">
  *         Did you mean {{form.email.suggestion }}?
  *       </span>
  *     </span>
  *   </div>
  * </form>
  */
  // jshint ignore:end
  .directive('flGuardpost', function($http, MAILGUN_BASE_URL, MAILGUN_API_KEY) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        var isValid = false; // invalid value (e.g. incorrect email)
        var validatedValue; // the value that has been validated

        ctrl.$validators.guardpostCheck = function(value) {
          // Is valid if the current value has been validated
          return value === validatedValue;
        };

        ctrl.$validators.guardpost = function(value) {
          // Prevent the validator from running twice
          if (value !== validatedValue) {
            validatedValue = value;
            // Only run this validator if the email syntax is valid
            if (!ctrl.$error.required && !ctrl.$error.email) {
              // Guardpost doc:
              // http://documentation.mailgun.com/api-email-validation.html
              ctrl.loading = true;
              $http.get(MAILGUN_BASE_URL + '/v2/address/validate', {
                params: {
                  address: value,
                  api_key: MAILGUN_API_KEY
                }
              }).success(function(data, status, headers, config) {
                // Check is the view value hasn't changed. If it is the case
                // an other validation is already in progress and this one
                // doesn't matter anymore.
                if (ctrl.$viewValue === config.params.address) {
                  if (status === 200) {
                    if (data.is_valid === true) {
                      // Email is valid
                      isValid = true;
                    } else {
                      // Email is not valid
                      isValid = false;
                      // If a suggestion is present as part of the response,
                      // add it to the model to be displayed
                      ctrl.suggestion = data.did_you_mean ?
                      data.did_you_mean : null;
                    }

                  } else {
                    // Fail safe, consider email valid on failure. Our API
                    // key might have been blocked
                    // TODO: Log error
                    isValid = true;
                  }
                  ctrl.$validate();
                }
              }).error(function(data, status, headers, config) {
                // Fail safe, consider email valid on failure
                // TODO: Log error
                if (ctrl.$viewValue === config.params.address) {
                  isValid = true;
                  ctrl.$validate();
                }
              }).finally(function() {
                ctrl.loading = false;
              });
            }
          }
          // Is valid if the current value has been validated && is valid
          return (value === validatedValue) && isValid;
        };

      }
    };
  });

