module.exports = {

    precommit: {
        gitHook: false,
        enable: false
    },

    outdate: {
        exclude: [
            //'vue'
        ]
    },
 
    build: {
        cssExtract: false,

        afterAll: require('./scripts/after-all-build.js')
    }

};
