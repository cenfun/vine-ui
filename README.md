![](scripts/vine.jpg)

# Vine UI
- Lightweight UI components based on [Vue 3](https://github.com/vuejs/core)
- Dist size (js minified: true): 65.0KB / gzip: 14.8KB

## Preview Online
[https://cenfun.github.io/vine-ui/](https://cenfun.github.io/vine-ui/)

## Components
- VuiButton  - VuiCheckbox  - VuiFlex  - VuiFlyover  - VuiInput  - VuiLoading  - VuiModal  - VuiPopover  - VuiRadio  - VuiSelect  - VuiTab  - VuiTooltip  

## Install
```sh
npm i vine-ui
```

## Usage
```
import { components } from "vine-ui";
const { VuiButton, VuiInput } = components;
export default {
    components: {
        VuiButton,
        VuiInput
    }
}
```
see [demo.vue](public/src/demo.vue)

## Changelog

* 3.0.0
    * update to vue 3.x
