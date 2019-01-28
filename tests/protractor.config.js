exports.config = {
    /*seleniumAddress: 'http://localhost:4444/wd/hub',*/
    baseUrl: 'http://localhost:50940/',
    capabilities: {
        'browserName': 'chrome'
    },
    specs: ['e2e/**/*.spec.js'],
    jasmineNodeOpts: {
        showColors: true
    }
}