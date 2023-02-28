import { createRouter, createWebHashHistory } from 'vue-router';

import Home from './home.vue';
import Demo from './demo.vue';

import demos from './demos.js';

const routes = [{
    path: '/',
    component: Home
}];

demos.forEach((item) => {
    routes.push({
        path: item.path,
        component: Demo
    });
});

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
