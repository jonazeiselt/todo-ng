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
                    /*args: {
                        baseUrl: "http://localhost:50940/#!/"
                    }*/
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.registerTask('default', ['protractor']);
};