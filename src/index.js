import './global.scss';

import VuiButton from './components/button.vue';
import VuiButtonGroup from './components/button-group.vue';
import VuiCheckbox from './components/checkbox.vue';
import VuiContentRenderer from './components/content-renderer.vue';
import VuiDialog from './components/dialog.vue';
import VuiFlex from './components/flex.vue';
import VuiFlyover from './components/flyover.vue';
import VuiIcon from './components/icon.vue';
import VuiIconLabel from './components/icon-label.vue';
import VuiInput from './components/input.vue';
import VuiLayout from './components/layout.vue';
import VuiLoading from './components/loading.vue';
import VuiModal from './components/modal.vue';
import VuiPopover from './components/popover.vue';
import VuiProgress from './components/progress.vue';
import VuiRadio from './components/radio.vue';
import VuiSelect from './components/select.vue';
import VuiSlider from './components/slider.vue';
import VuiSwitch from './components/switch.vue';
import VuiTab from './components/tab.vue';
import VuiToast from './components/toast.vue';
import VuiTooltip from './components/tooltip.vue';

import {
    icons, defaultIcons, setIcons
} from './utils/icons.js';
import {
    initGlobalTooltips, mount, showToast
} from './global.js';
import { Motion } from './utils/motion.js';
import { StartMoveEnd } from './utils/start-move-end.js';

const VERSION = window.VERSION;
const TAG = window.TAG;

export {
    VERSION,
    TAG,

    VuiButton,
    VuiButtonGroup,
    VuiCheckbox,
    VuiContentRenderer,
    VuiDialog,
    VuiFlex,
    VuiFlyover,
    VuiIcon,
    VuiIconLabel,
    VuiInput,
    VuiLayout,
    VuiLoading,
    VuiModal,
    VuiPopover,
    VuiProgress,
    VuiRadio,
    VuiSelect,
    VuiSlider,
    VuiSwitch,
    VuiTab,
    VuiToast,
    VuiTooltip,

    icons,
    defaultIcons,
    setIcons,

    initGlobalTooltips,
    mount,
    showToast,

    Motion,
    StartMoveEnd
};
