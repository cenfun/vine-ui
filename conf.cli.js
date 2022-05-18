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
        overrides: {
            vue: {
                dependencies: {},
                main: 'dist/vue.runtime.global.js'
            }
          
        }
    }

};
