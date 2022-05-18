module.exports = {

    precommit: {
        gitHook: false,
        enable: false
    },

    outdate: {
        exclude: [
            'vue'
        ]
    },
 
    build: {
        overrides: {
       
            'vue': {
                main: ['dist/vue.js']
            }
          
        }
    }

};
