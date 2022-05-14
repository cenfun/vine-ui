module.exports = {

    preCommit: false,
 
    moduleOverrides: {
       
        'vue': {
            main: ['dist/vue.js']
        }
      
    },

    outdate: {
        exclude: [
            'vue'
        ]
    }

};
