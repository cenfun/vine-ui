![](/scripts/vine.jpg)

# Vine UI
- Lightweight UI components based on [Vue 3.x](https://github.com/vuejs/core)
- Dist size (js minified: true): 69.0KB / gzip: 16.2KB

## Preview Online
[https://cenfun.github.io/vine-ui/](https://cenfun.github.io/vine-ui/)

## Components
* VuiButton  * VuiCheckbox  * VuiFlex  * VuiFlyover  * VuiInput  * VuiLayout  * VuiLoading  * VuiModal  * VuiPopover  * VuiProgress  * VuiRadio  * VuiSelect  * VuiSwitch  * VuiTab  * VuiTooltip  

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
see [app.vue](/packages/app/src/app.vue)