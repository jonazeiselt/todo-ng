// Wrapper function containing Grunt code
module.exports = function (grunt) {
    // Define configuration data
    grunt.initConfig({
        // Import JSON metadata into grunt config
        pkg: grunt.file.readJSON("package.json"),
        protractor: {
            options: {
                configFile: "node_modules/protractor/example/conf.js", // Default config file
                keepAlive: true, // Don't stop grunt process when a test fails
                noColor: false, // Make protractor use colors in its output 
                args: {
                    // Pass arguments to the command
                }
            },
            e2e: {
                options: {
                    configFile: "tests/protractor.config.js",
                    args: {} // Target-specific arguments
                }
          
            }
        }
    });

    // Enable plugin
    grunt.loadNpmTasks('grunt-protractor-runner');

    // npm run test (test comes from package.json's "test" : "grunt test")
    grunt.registerTask('test', ['protractor:e2e']);
};