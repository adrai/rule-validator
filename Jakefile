var smoosh = require('smoosh'),
    pkg = require('./package.json');

// ## BUILD
// run `jake build`   
// will build the projects clientsources.
desc('Builds the scripts');
task('build', [], function(debug) {
    
    // a basic smoosh configuration object
    smoosh.config({
      "VERSION": pkg.version,
      "JAVASCRIPT": {
        "DIST_DIR": "./",
        "rule-validator": [
          "lib/ruleValidator.js"
        ]
      }
    });

    // run smoosh to get minified version of the js file
    smoosh.build().analyze();
    
    console.log('+ written files successfully'.green);

});