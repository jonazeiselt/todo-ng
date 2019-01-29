module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        protractor: {
            options: {
                configFile: "node_modules/protractor/example/conf.js",
                keepAlive: true,
                noColor: false
            },
            e2e: {
                options: {
                    configFile: "tests/protractor.config.js"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.registerTask('default', ['protractor:e2e']);
};