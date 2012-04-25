var expect = expect || require('expect.js')
  , base = this.ruleValidator || require('../lib/ruleValidator');

describe('Rule-Validator', function() {

    describe('extending ruleValidator', function() {

        var personValRules = base.extend({

            createPerson: {
                lastName: { type: 'string', minLength: 1 }
            },

            renamePerson: function(attributes) {
                return this.schema(
                    attributes.firstName.isRequired(),
                    attributes.lastName.isRequired()
                );
            },

            renameFirstNameOfPerson: function(attributes) {
                return this.schema(
                    attributes.firstName
                );
            }

        },
        {
            attributes: {
                firstName: { type: 'string', minLength: 1 },
                lastName: { type: 'string', minLength: 1 }
            },

            aggregate: 'personAggregate'
        });

        it('it should contain all extending values', function() {
            expect(personValRules.aggregate).to.eql('personAggregate');
        });

        describe('calling validate on the new object', function() {

            it('it should validate correctly', function() {
                personValRules.validate('createPerson', { lastName: 'Fritz' }, function(err) {
                    expect(err).not.to.be.ok();
                });
            });

            describe('having its value set required in an other rule', function() {

                it('it should validate correctly', function() {
                    personValRules.validate('renameFirstNameOfPerson', { lastName: 'Fritz' }, function(err) {
                        expect(err).not.to.be.ok();
                    });
                });

            });

        });

        describe('calling validate on the rule', function() {

            it('it should validate correctly', function() {
                personValRules.createPerson.validate({ lastName: 'Fritz' }, function(err) {
                    expect(err).not.to.be.ok();
                });
            });

            describe('having its value set required in an other rule', function() {

                it('it should validate correctly', function() {
                    personValRules.renameFirstNameOfPerson.validate({ lastName: 'Fritz' }, function(err) {
                        expect(err).not.to.be.ok();
                    });
                });

            });

        });

        describe('with rules as objects', function() {

            it('it should wrap the rules correctly', function() {
                expect(personValRules.createPerson.properties.lastName.type).to.eql('string');
            });

        });

        describe('with rules as functions', function() {

            it('it should save its executed value and wrap the rules correctly', function() {
                expect(personValRules.renamePerson.properties.firstName.type).to.eql('string');
            });

            it('it should have a schema function', function() {
                var res = personValRules.schema({ a: 't' }, { b: 'c'});
                expect(res.a).to.eql('t');
                expect(res.b).to.eql('c');
            });

            describe('having extended with attributes', function() {

                it('it should have saved the attributes correctly to can be used in the rules', function() {
                    expect(personValRules.attributes.lastName.lastName.type).to.eql('string');
                    var res = personValRules.attributes.lastName.isRequired();
                    expect(res.lastName.required).to.eql(true);
                    var res2 = personValRules.attributes.lastName.isNotRequired();
                    expect(res2.lastName.required).to.eql(false);
                });

            });

        });

    });

});