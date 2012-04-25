(function () {

    var jsonValidator
      , __
      , ruleValidator = {};

    if (typeof(module) !== 'undefined' && module.exports) {
        jsonValidator = require('amanda')('json');
        __ = require('underscore');
        module.exports = ruleValidator;
    } else if (typeof(define) !== 'undefined') {
        define(['amanda', 'underscore'], function (amanda, underscore) {
            jsonValidator = amanda('json');
            __ = underscore;
            return ruleValidator;
        });
    } else {
        jsonValidator = amanda('json');
        __ = _;
        this.ruleValidator = ruleValidator;
    }

    var ValidationRules = {};
    ValidationRules.prototype = {

        schema: function() {
            var attributes = {};
            __.each(arguments, function(arg) {
                for(var member in arg) {
                    if (arg.hasOwnProperty(member)) {
                        attributes[member] = arg[member];
                        break;
                    }
                }
            });

            return attributes;
        },

        validate: function(ruleName, data, callback) {
            jsonValidator.validate(data, this[ruleName], { singleError: false }, callback);
        }
        
    };

    ruleValidator.extend = function(rules, extension) {
        var extObj = __.extend(__.clone(ValidationRules.prototype), extension);

        function isRequired(value) {
            for(var member in this) {
                if (this.hasOwnProperty(member)) {
                    var copy = {};
                    copy[member] = __.clone(this);
                    copy[member].required = value === undefined || value === null ? true : value;
                    return copy;
                }
            }
        }

        function isNotRequired() {
            return isRequired.call(this, false);
        }

        if (extObj.attributes) {
            for (var m in extObj.attributes) {
                var attr = {};
                attr[m] = extObj.attributes[m];
                attr.isRequired = isRequired;
                attr.isNotRequired = isNotRequired;
                extObj.attributes[m] = attr;
            }
        }

        for (var r in rules) {
            var rule = rules[r];
            if (__.isFunction(rule)) {
                rule = rule.call(extObj, extObj.attributes);
            }

            extObj[r] = {
                type: 'object',
                properties: rule
            };

            extObj[r].ruleName = r;
            extObj[r].validate = function(data, callback) {
                extObj.validate(this.ruleName, data, callback);
            };
        }

        return extObj;

    };

}());