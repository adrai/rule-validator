var expect = expect || require('expect.js'),
    base = this.ruleValidator || require('../lib/ruleValidator');

describe('Rule-Validator', function() {

  describe('extending ruleValidator', function() {

    var personValRules = base.extend({

      createPerson: {
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 }
      },

      changePerson: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 1 },
          lastName: { type: 'string', minLength: 1 }
        },
        required: ['lastName']
      }

    },
    {
      aggregate: 'personAggregate'
    });

    it('it should contain all extending values', function() {
      expect(personValRules.aggregate).to.eql('personAggregate');
    });

    describe('calling validate on the new object', function() {

      it('it should validate correctly', function(done) {
        personValRules.validate('createPerson', { lastName: 'Fritz' }, function(err) {
          expect(err).not.to.be.ok();
          done();
        });
      });

      describe('having its value set required in an other rule', function() {

        it('it should validate correctly', function(done) {
          personValRules.validate('changePerson', { firstName: 'Fritz' }, function(err) {
            expect(err).to.be.ok();
            done();
          });
        });

      });

    });

    describe('calling validate on the rule', function() {

      it('it should validate correctly', function(done) {
        personValRules.createPerson.validate({ lastName: 'Fritz' }, function(err) {
          expect(err).not.to.be.ok();
          done();
        });
      });

    });

    describe('with rules as objects', function() {

      it('it should wrap the rules correctly', function() {
        expect(personValRules.createPerson.properties.lastName.type).to.eql('string');
      });

      describe('and wrong data', function() {

        it('it should return an error', function(done) {
          personValRules.createPerson.validate({ lastName: 1 }, function(err) {
            expect(err).to.be.ok();
            done();
          });
        });

      });

    });

  });

});