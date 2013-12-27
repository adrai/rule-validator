# Introduction

[![Build Status](https://secure.travis-ci.org/adrai/rule-validator.png)](http://travis-ci.org/adrai/rule-validator)

[![browser support](https://ci.testling.com/adrai/rule-validator.png)](https://ci.testling.com/adrai/rule-validator)

Rule-validator is a javascript module based on tv4. And works for node.js and in the browser.
It can be very useful if you work with (d)ddd, cqrs, eventsourcing, domain, commands and events, etc.

# Dependencies
You need [tv4](https://github.com/geraintluff/tv4) and [lodash](http://lodash.com/) or [underscore](http://documentcloud.github.com/underscore/).

# Download
Releases for a browser are available for download from GitHub.

| **Version** | **Description** | **Size** |
|:------------|:----------------|:---------|
| `rule-validator-0.3.0.js` | *uncompressed, with comments* | [Download](https://raw.github.com/adrai/rule-validator/master/rule-validator-0.3.0.js) |
| `rule-validator-0.3.0.min.js` | *compressed, without comments* | [Download](https://raw.github.com/adrai/rule-validator/master/rule-validator-0.3.0.min.js) |

# Installation (node.js)

    $ npm install rule-validator

# Usage

    <!-- in Browser -->
    <script src="rule-validator.js"></script>

    // in node.js
    var base = require('rule-validator');

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
        // own stuff...
        aggregate: 'personAggregate'
    });

    // validate...
    personValRules.validate('createPerson', { lastName: 'Fritz' }, function(err) {
        
    });
    // or...
    personValRules.createPerson.validate({ lastName: 'Fritz' }, function(err) {
    });

# IMPORTANT

BE SURE TO DEFINE JSON SCHEMAS!
Hint: [http://jsonary.com/documentation/json-schema/](http://jsonary.com/documentation/json-schema/)

# License

Copyright (c) 2013 Adriano Raiano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.