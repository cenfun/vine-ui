![](/scripts/vine.jpg)

# Vine UI
- Lightweight UI components based on [Vue 3.x](https://github.com/vuejs/core)
- Zero dependencies, tree-shakable ESM, full TypeScript definitions

## Preview Online
[https://cenfun.github.io/vine-ui/](https://cenfun.github.io/vine-ui/)

## Components
* [VuiButton](https://cenfun.github.io/vine-ui/#/button) — button
* [VuiButtonGroup](https://cenfun.github.io/vine-ui/#/button-group) — button group with single selection
* [VuiCheckbox](https://cenfun.github.io/vine-ui/#/checkbox) — checkbox
* [VuiDialog](https://cenfun.github.io/vine-ui/#/dialog) — dialog / confirm box
* [VuiFlex](https://cenfun.github.io/vine-ui/#/flex) — flex layout helper
* [VuiFlyover](https://cenfun.github.io/vine-ui/#/flyover) — side flyover panel (resizable)
* [VuiIcon](https://cenfun.github.io/vine-ui/#/icon) — SVG icon
* [VuiIconLabel](https://cenfun.github.io/vine-ui/#/icon-label) — icon with label
* [VuiInput](https://cenfun.github.io/vine-ui/#/input) — text input
* [VuiLayout](https://cenfun.github.io/vine-ui/#/layout) — split-pane layout
* [VuiLoading](https://cenfun.github.io/vine-ui/#/loading) — loading spinner
* [VuiModal](https://cenfun.github.io/vine-ui/#/modal) — modal window
* [VuiPopover](https://cenfun.github.io/vine-ui/#/popover) — popover
* [VuiProgress](https://cenfun.github.io/vine-ui/#/progress) — progress bar
* [VuiRadio](https://cenfun.github.io/vine-ui/#/radio) — radio
* [VuiSelect](https://cenfun.github.io/vine-ui/#/select) — select dropdown (single/multiple, searchable options via slot)
* [VuiSlider](https://cenfun.github.io/vine-ui/#/slider) — horizontal scroller
* [VuiSwitch](https://cenfun.github.io/vine-ui/#/switch) — switch
* [VuiTab](https://cenfun.github.io/vine-ui/#/tab) — tabs
* [VuiToast](https://cenfun.github.io/vine-ui/#/toast) — toast notification
* [VuiTooltip](https://cenfun.github.io/vine-ui/#/tooltip) — tooltip

## Install
```sh
npm i vine-ui
```

## Usage

### ESM (recommended)
Named imports keep the bundle tree-shakable:

```vue
<script setup>
import { VuiButton, VuiInput } from 'vine-ui';
</script>

<template>
    <VuiInput v-model="text" placeholder="input" />
    <VuiButton primary @click="onClick">OK</VuiButton>
</template>
```

### Options API
```js
import { VuiButton, VuiInput } from 'vine-ui';

export default {
    components: {
        VuiButton,
        VuiInput
    }
}
```

### Browser (UMD)
```html
<script src="vine-ui.js"></script>
<script>
    const { VuiButton } = window['vine-ui'];
</script>
```

## Utilities

### Icons (`icons`, `defaultIcons`, `setIcons`)

```js
import { icons, defaultIcons, setIcons } from 'vine-ui';

// all built-in icon names
console.log(Object.keys(defaultIcons)); // ['arrow-down', 'arrow-left', 'close', ...]

// icons is a mutable copy of defaultIcons, setIcons merges new/overridden icons into it
setIcons({
    'my-icon': '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M8 2 L14 14 L2 14 Z"/></svg>'
});

// then use it in a template
// <VuiIcon icon="my-icon" />
```

### `showToast`

```js
import { showToast } from 'vine-ui';

// types: success | error | info
showToast({ type: 'success', content: 'Saved successfully' });
showToast({ type: 'error', content: 'Something went wrong' });

// custom dismiss timeout in ms (default: 2000, 0 = keep until manually closed)
showToast({ type: 'info', content: 'Long message', timeout: 5000 });

// render into a custom container (defaults to a fixed container appended to body)
const container = document.getElementById('toast-area');
const { unmount } = showToast({ type: 'success', content: 'Hi' }, container);
// unmount(); // dismiss manually
```

### `mount`

Programmatically render a component into a detached element (appended to body by default):

```js
import { mount, VuiDialog } from 'vine-ui';

const { el, unmount } = mount(VuiDialog, {
    props: {
        message: 'Are you sure?',
        closeOnClickOut: false
    }
});

// el is appended to document.body and contains the rendered component

// remove it later
unmount();
```

### `initGlobalTooltips`

Global tooltip handling for any element with a `tooltip` attribute (used by the docs site):

```js
import { initGlobalTooltips } from 'vine-ui';

initGlobalTooltips(
    // onEnter: target hovered, text = tooltip content
    (target, text) => {
        tooltip.visible = true;
        tooltip.target = target;
        tooltip.text = text;
    },
    // onLeave: target no longer hovered
    (target) => {
        tooltip.visible = false;
        tooltip.text = '';
    },
    // optional getTooltip: customize how text is resolved
    (target) => target.getAttribute('tooltip')
);
```

Then simply add attributes in templates:

```html
<button tooltip="Delete this item">Delete</button>
```

### `Motion`

Frame-based animation helper (extends `EventTarget`, data in `e.detail`):

```js
import { Motion } from 'vine-ui';

// animate a single number from 0 to 100
const motion = new Motion({ duration: 300, from: 0, till: 100 });
motion.bind(Motion.MOVE, (e) => {
    el.style.opacity = e.detail / 100; // 0 → 1
});
motion.bind(Motion.END, () => {
    console.log('animation finished');
});
motion.start();

// animate multiple values at once (object mode)
new Motion({ from: { x: 0, y: 0 }, till: { x: 100, y: 50 } })
    .bind(Motion.MOVE, (e) => {
        el.style.transform = `translate(${e.detail.x}px, ${e.detail.y}px)`;
    })
    .start({ duration: 500 });

// custom easing function, e.g. ease-out
new Motion({
    duration: 400,
    from: 0,
    till: 300,
    easing: (k) => 1 - (1 - k) * (1 - k)
}).start();

// stop early or clean up
motion.stop();
motion.destroy();
```

Events: `Motion.START`, `Motion.MOVE`, `Motion.END`, `Motion.STOP`.

### `StartMoveEnd`

Unified mouse / touch drag tracking (extends `EventTarget`):

```js
import { StartMoveEnd } from 'vine-ui';

const sme = new StartMoveEnd(el, {
    inertia: true,      // enable touch inertia (fling)
    inertiaTime: 200    // sample window for velocity
});

sme.bind(StartMoveEnd.START, (e) => {
    console.log('start at', e.detail.startX, e.detail.startY);
});

sme.bind(StartMoveEnd.MOVE, (e) => {
    const d = e.detail;
    // moveX / moveY: offset from previous position
    // offsetX / offsetY: offset from start position
    el.style.transform = `translate(${d.offsetX}px, ${d.offsetY}px)`;
});

sme.bind(StartMoveEnd.END, (e) => {
    console.log('end');
});

// touch only, with inertia enabled
sme.bind(StartMoveEnd.INERTIA, (e) => {
    const d = e.detail;
    el.style.transform = `translate(${d.offsetX + d.touchInertiaX}px, ${d.offsetY + d.touchInertiaY}px)`;
});

// remove all listeners
sme.destroy();
```

Events: `StartMoveEnd.START`, `StartMoveEnd.MOVE`, `StartMoveEnd.END`, `StartMoveEnd.INERTIA`.

## TypeScript
vine-ui ships complete type definitions (`dist/vine-ui.d.ts`) with typed props, events (including `v-model`) and slots.

## Development
```sh
npm run dev     # run examples locally
npm run docs    # build static docs site (see examples/)
npm run build   # build library to dist/
```

Examples source: [examples/](examples/)
