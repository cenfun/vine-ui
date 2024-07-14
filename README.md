![](/scripts/vine.jpg)

# Vine UI
- Lightweight UI components based on [Vue 3.x](https://github.com/vuejs/core)
- Dist size (js minified: true): 74.5KB / gzip: 18.6KB

## Preview Online
[https://cenfun.github.io/vine-ui/](https://cenfun.github.io/vine-ui/)

## Components
* VuiButton  * VuiCheckbox  * VuiDialog  * VuiFlex  * VuiFlyover  * VuiInput  * VuiLayout  * VuiLoading  * VuiModal  * VuiPopover  * VuiProgress  * VuiRadio  * VuiSelect  * VuiSwitch  * VuiTab  * VuiTooltip  

## Install
```sh
npm i vine-ui
```

## Usage
```
import VineUI from "vine-ui";
const { VuiButton, VuiInput } = VineUI;
export default {
    components: {
        VuiButton,
        VuiInput
    }
}
```
see [app.vue](/packages/app/src/app.vue)