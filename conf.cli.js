module.exports = {

    precommit: {
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
