import plus from 'eslint-config-plus';

export default {
    ... plus,
    root: true,
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    env: {
        browser: true
    }
};
