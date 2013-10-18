(function () {

  var tv4,
      __,
      ruleValidator = {};

  if (typeof(module) !== 'undefined' && module.exports) {
    tv4 = require('tv4');
    __ = require('lodash');
    module.exports = ruleValidator;
  } else if (typeof(define) !== 'undefined') {
    define(['amanda', 'underscore'], function (amanda, underscore) {
      tv4 = tv4;
      __ = underscore;
      return ruleValidator;
    });
  } else {
    tv4 = tv4;
    __ = _;
    this.ruleValidator = ruleValidator;
  }

  var ValidationRules = {};
  ValidationRules.prototype = {

    // __validate:__ Use this function validate some data against a rule.
    // 
    // `rules.validate(ruleName, data, callback)`
    //
    // - __ruleName:__ The rule that should be used.
    // - __data:__ The data that should be validated.
    // - __callback:__ `function(err){}`
    validate: function(ruleName, data, callback) {
      if (this[ruleName]) {
        var validation = tv4.validateResult(data, this[ruleName]);
        if (!validation.valid) {
          if (validation.error.subErrors && validation.error.subErrors.length > 0) {
            validation.error.subErrors = __.sortBy(validation.error.subErrors, function(s) {
              return -s.code;
            });
            callback(validation.error.subErrors[0].dataPath + ' => ' + validation.error.subErrors[0].message);
          } else {
            callback(validation.error.dataPath + ' => ' + validation.error.message);
          }
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }
      
  };

  // __extend:__ Use this function to create your rule validator object.
  // 
  // `base.extend(rules, extension)`
  //
  // - __rules:__ The rules that should be used.
  // - __extension:__ The rest that you want to extend. (Special handling for attributes!)
  ruleValidator.extend = function(rules, extension) {
    var extObj = __.extend(__.clone(ValidationRules.prototype), extension);

    for (var r in rules) {
      var rule = rules[r];

      if (rule.type === 'object' && rule.properties) {
        extObj[r] = rule;
      } else {
        extObj[r] = {
          type: 'object',
          properties: rule
        };
      }

      extObj[r].ruleName = r;
      extObj[r].validate = function(data, callback) {
        extObj.validate(this.ruleName, data, callback);
      };
    }

    return extObj;

  };

}());