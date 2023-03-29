// starfall-cli config
// https://github.com/cenfun/starfall-cli

module.exports = {

    precommit: {
        gitHook: false,
        enable: false
    },

    build: {
        define: {
            __VUE_OPTIONS_API__: false,
            __VUE_PROD_DEVTOOLS__: false
        },
        cssExtract: false,

        vendors: ['vine-ui', 'app'],

        before: require('./before-build.js'),
        afterAll: require('./after-all-build.js')
    }

};
