module.exports = {

    precommit: {
        gitHook: false,
        enable: false
    },

    build: {
        define: {
            //__VUE_OPTIONS_API__: true,
            //__VUE_PROD_DEVTOOLS__: false
        },
        cssExtract: false,

        afterAll: require('./scripts/after-all-build.js')
    }

};
