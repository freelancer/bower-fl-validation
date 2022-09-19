'use strict';
angular.module('flValidation')
  // jshint ignore:start
  /**
  * @ngdoc directive
  * @name flValidation.directive:flEnsureUnique
  * @element input
  * @function
  *
  * @description
  * Async validator ensuring that a username or an email address is unique in
  * the database. Sets a "uniqueCheck" $error key when running, a
  * "uniqueInvalid" key when invalid, and a "unique" key when already taken.
  *
  * Also able to suggest an available username based on a submitted email
  * address or an already taken username using the
  * "fl-ensure-unique-recommend-username" attribute.
  *
  * @usage
  * <!-- Pass the name of the field that you want to validate ("username" or "email") to the directive -->
  * <form name="form">
  *   <input type="text" name="email" ng-model="user.email" fl-ensure-unique="email">
  *   <div ng-messages="form.email.$error">
  *     <span class="validation-info" ng-message="uniqueCheck">
  *       Checking email availability...
  *     </span
  *     <span class="validation-error" ng-message="uniqueInvalid">
  *       Invalid email
  *     </span>
  *     <span class="validation-error" ng-message="unique">
  *       Email already taken. <a href="/reset-password">Forgot your password?</a>
  *     </span>
  *   </div>
  * </form>
  *
  * <!-- Pass a model to the "fl-ensure-unique-recommend-username" attribute to
  * fill in a username field with an available username -->
  * <form name="form">
  *   <input type="text" name="email" ng-model="user.email" fl-ensure-unique="email" fl-ensure-unique-recommend-username="user.username">
  *   <div ng-messages="form.email.$error">
  *     <span class="validation-info" ng-message="uniqueCheck">
  *       Checking email availability...
  *     </span
  *     <span class="validation-error" ng-message="uniqueInvalid">
  *       Invalid email
  *     </span>
  *     <span class="validation-error" ng-message="unique">
  *       Email already taken. <a href="/reset-password">Forgot your password?</a>
  *     </span>
  *   </div>
  *   <input type="text" name="username" ng-model="user.username">
  * </form>
  */
  // jshint ignore:end
  .directive('flEnsureUnique', function(Users) {
    return {
      require: 'ngModel',
      scope: {
        // Used to set a value suggested by the api to another model value
        // An example use case is to suggest a username when
        // the email is checked to be unique
        recommendedUsername: '=flEnsureUniqueRecommendUsername'
      },
      link: function(scope, element, attrs, ctrl) {
        var isUnique = false; // unique value
        var isValid = false; // invalid value (e.g. incorrect email)
        var validatedValue; // the value that has been validated

        // /!\ All the validators bellow are run only when the change comes
        // from the view (ctrl.$viewValue === value) and the model is assumed
        // invalid until all build-in validators (in any) are valid

        ctrl.$validators.uniqueCheck = function(value) {
          return (ctrl.$viewValue !== value) || (value === validatedValue);
        };

        ctrl.$validators.unique = function(value) {
          // Prevent the validator from running twice or running if the
          // build-in validator are failing
          if (ctrl.$viewValue === value && value !== validatedValue &&
            !(ctrl.$error.maxlength || ctrl.$error.minlength ||
            ctrl.$error.pattern || ctrl.$error.required || ctrl.$error.email)) {
              validatedValue = value;
              // The field to check. For now it can be 'username' or 'email'
              var field = attrs.flEnsureUnique;
              var user = {};
              user[field] = ctrl.$viewValue;
              var params = attrs.flEnsureUniqueRecommendUsername ?
                { recommend_name: true } : {};
              Users.check(user, params)
              .then(function(response) {
                // Check is the view value hasn't changed. If it is the case
                // an other validation is already in progress and this one
                // doesn't matter anymore.
                if (ctrl.$viewValue === user[field]) {
                  // Set the recommanded username if asked for & the associated
                  // model is not set yet
                  if (attrs.flEnsureUniqueRecommendUsername &&
                  response.recommended_name && !scope.recommendedUsername) {
                    scope.recommendedUsername = response.recommended_name;
                  }
                  isUnique = true;
                  isValid = true;
                  ctrl.$validate();
                } 
              })
              .catch(function(response) {
                if (ctrl.$viewValue === user[field]) {
                  // Field already taken
                  if (response.code === 'EMAIL_TAKEN' ||
                  response.code === 'USERNAME_TAKEN') {
                    isUnique = false;
                    isValid = true;
                  } else {
                    isUnique = false;
                    isValid = false;
                  }
                  ctrl.$validate();
                }
              });
          }
          // Is valid if the current value has been validated && is unique
          return (ctrl.$viewValue !== value) || ((value === validatedValue) &&
            isUnique);
        };

        ctrl.$validators.uniqueInvalid = function(value) {
          // Is valid if the current value has been validated && is valid
          return (ctrl.$viewValue !== value) || ((value === validatedValue) &&
            isValid);
        };

      }
    };
  });

