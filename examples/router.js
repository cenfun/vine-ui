import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './home.vue';
import Example from './example.vue';

import examples from './examples.js';

const routes = [{
    path: '/',
    component: Home
}];

examples.forEach((item) => {
    routes.push({
        path: item.path,
        component: Example
    });
});

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
