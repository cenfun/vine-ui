import App from '../../app/src/app.vue';
const app = App.createComponent();

app.config.errorHandler = (err, instance, info) => {
    console.log(err, instance, info);
};
