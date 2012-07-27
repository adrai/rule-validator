(function () {

    var jsonValidator
      , __
      , ruleValidator = {};

    if (typeof(module) !== 'undefined' && module.exports) {
        jsonValidator = require('amanda')('json');
        __ = require('lodash');
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

        // __schema:__ Use this function to wrap all passing attributes.
        // 
        // `this.schema(attributes.first, attributes.second)`
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

        // __validate:__ Use this function validate some data against a rule.
        // 
        // `rules.validate(ruleName, data, callback)`
        //
        // - __ruleName:__ The rule that should be used.
        // - __data:__ The data that should be validated.
        // - __callback:__ `function(err){}`
        validate: function(ruleName, data, callback) {
            if (this[ruleName]) {
                jsonValidator.validate(data, this[ruleName], { singleError: false }, callback);
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

        function isRequired(value) {
            for(var member in this) {
                if (this.hasOwnProperty(member)) {
                    // the cloning is necessary to not change attributes for other rules...
                    var copy = __.clone(this);
                    copy[member] = __.clone(this[member]);
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