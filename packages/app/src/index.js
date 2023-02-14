import App from './app.vue';

import { createComponent } from 'vine-ui';

App.createComponent = createComponent.bind(App);

// const container = document.createElement('div');
// container.className = 'vui-app-container';
// document.body.appendChild(container);
// App.createComponent({ container });

App.createComponent();
