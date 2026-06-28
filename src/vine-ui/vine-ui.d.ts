import { DefineComponent } from 'vue';

// ============================================================
// Component type helpers
// ============================================================
type StringOrNumber = string | number;

// ============================================================
// VuiButton
// ============================================================
export interface VuiButtonProps {
  /** Button text content */
  label?: string;
  /** Use primary style (blue background) */
  primary?: boolean;
  /** Button type attribute (button, submit, reset) */
  type?: string;
  /** Button width (supports px or number) */
  width?: StringOrNumber;
  /** Disable the button */
  disabled?: boolean;
}
export const VuiButton: DefineComponent<VuiButtonProps>;

// ============================================================
// VuiButtonGroup
// ============================================================
export interface VuiButtonGroupOption {
  label?: string;
  value?: StringOrNumber;
  name?: string;
  title?: string;
}
export interface VuiButtonGroupProps {
  /** Array of option objects [{label, value}] for rendering items */
  options?: VuiButtonGroupOption[] | null;
  /** Custom color for selected state */
  color?: string;
  /** If true, v-model binds to option.value; otherwise binds to index */
  bindValue?: boolean;
  modelValue?: StringOrNumber | null;
}
export const VuiButtonGroup: DefineComponent<VuiButtonGroupProps>;

// ============================================================
// VuiCheckbox
// ============================================================
export interface VuiCheckboxProps {
  /** Checkbox label text */
  label?: string;
  /** Disable the checkbox */
  disabled?: boolean;
  modelValue?: boolean | null;
}
export const VuiCheckbox: DefineComponent<VuiCheckboxProps>;

// ============================================================
// VuiDialog
// ============================================================
export interface VuiDialogProps {
  /** Dialog message text */
  message?: string;
  /** Dialog window width */
  width?: string;
  /** Dialog window height */
  height?: string;
  /** Close dialog when clicking outside */
  closeOnClickOut?: boolean;
  modelValue?: boolean | null;
}
export const VuiDialog: DefineComponent<VuiDialogProps>;

// ============================================================
// VuiFlex
// ============================================================
export interface VuiFlexProps {
  /** Flex direction: row or column */
  direction?: 'row' | 'column';
  /** Gap between flex items */
  gap?: StringOrNumber;
  /** Enable flex-wrap */
  wrap?: boolean;
  /** Allow children to shrink (flex-shrink: 1) */
  shrink?: boolean;
  /** justify-content value (start, center, end, between, etc.) */
  align?: string;
  /** Quick shorthand to center justify-content */
  center?: boolean;
  /** Align-items value */
  alignItems?: string;
  /** Flex container width */
  width?: StringOrNumber;
  /** Flex container height */
  height?: StringOrNumber;
  /** Overflow value */
  overflow?: string;
  /** Margin around the container */
  margin?: StringOrNumber;
  /** Padding inside the container */
  padding?: StringOrNumber;
}
export const VuiFlex: DefineComponent<VuiFlexProps>;

// ============================================================
// VuiFlyover
// ============================================================
export interface VuiFlyoverProps {
  /** Slide position: right or left */
  position?: 'right' | 'left';
  /** Flyover width (px or %) */
  width?: StringOrNumber;
  /** Minimum width when resizing */
  minWidth?: StringOrNumber;
  /** Maximum width when resizing */
  maxWidth?: StringOrNumber;
  /** Enable drag resize handle */
  resizable?: boolean;
  modelValue?: boolean | null;
}
export const VuiFlyover: DefineComponent<VuiFlyoverProps>;

// ============================================================
// VuiIcon
// ============================================================
export interface VuiIconProps {
  /** Icon name (must match an SVG file in icons directory) */
  icon?: string;
  /** Icon size (width and height) */
  size?: string;
  /** Icon width (overrides size) */
  width?: string;
  /** Icon height (overrides size) */
  height?: string;
  /** Icon color (CSS color value) */
  color?: string;
  /** Enable button mode (clickable with hover effect) */
  button?: boolean;
  /** Use primary color on hover (only with button mode) */
  primary?: boolean;
}
export const VuiIcon: DefineComponent<VuiIconProps>;

// ============================================================
// VuiIconLabel
// ============================================================
export interface VuiIconLabelProps {
  /** Icon name */
  icon?: string;
  /** Icon size */
  size?: string;
  /** Icon width (overrides size) */
  width?: string;
  /** Icon height (overrides size) */
  height?: string;
  /** Icon color */
  color?: string;
  /** Label text displayed next to the icon */
  label?: string;
  /** Enable button mode (clickable with hover effect) */
  button?: boolean;
  /** Use primary color on hover */
  primary?: boolean;
  /** Gap between icon and label */
  gap?: string;
}
export const VuiIconLabel: DefineComponent<VuiIconLabelProps>;

// ============================================================
// VuiInput
// ============================================================
export interface VuiInputProps {
  /** Input label text */
  label?: string;
  /** Input type (text, number, password, etc.) */
  type?: string;
  /** Input width */
  width?: StringOrNumber;
  /** Placeholder text */
  placeholder?: string;
  /** Auto-select all text on focus */
  selectOnFocus?: boolean;
  /** Disable the input */
  disabled?: boolean;
  /** Make the input read-only */
  readonly?: boolean;
  /** Icon name to show on the left side */
  icon?: string;
  /** Icon name to show on the right side */
  iconRight?: string;
  /** Icon color */
  iconColor?: string;
  /** Show a clear button when input has value */
  cleanable?: boolean;
  /** Make the left icon clickable */
  iconClickable?: boolean;
  /** Make the right icon clickable */
  iconRightClickable?: boolean;
  /** Initial value (used without v-model) */
  value?: StringOrNumber;
  modelValue?: StringOrNumber;
}
export const VuiInput: DefineComponent<VuiInputProps>;

// ============================================================
// VuiLayout
// ============================================================
export interface VuiLayoutProps {
  /** Layout container width */
  width?: string;
  /** Layout container height */
  height?: string;
  /** Layout direction: row or column */
  direction?: 'row' | 'column';
  /** Gutter hover highlight size */
  gutterHoverSize?: string;
  /** Gutter drag handle size */
  gutterSize?: string;
  modelValue?: string;
}
export const VuiLayout: DefineComponent<VuiLayoutProps>;

// ============================================================
// VuiLoading
// ============================================================
export interface VuiLoadingProps {
  /** Center the loading indicator absolutely */
  center?: boolean;
  /** Use faster animation speed */
  fast?: boolean;
  /** Spinner stroke color */
  color?: string;
  /** Loading size: s/small, m/medium, l/large (default: m) */
  size?: string;
  /** Theme name (reserved for future use) */
  theme?: string;
  /** Show or hide the loading indicator */
  visible?: boolean;
}
export const VuiLoading: DefineComponent<VuiLoadingProps>;

// ============================================================
// VuiModal
// ============================================================
export interface VuiModalProps {
  /** Modal title text */
  title?: string;
  /** Show close button */
  closeButton?: boolean;
  /** Close modal when clicking outside */
  closeOnClickOut?: boolean;
  /** Modal window width */
  width?: string;
  /** Modal window maximum width */
  maxWidth?: string;
  /** Append modal element to document body */
  appendToBody?: boolean;
  modelValue?: boolean | null;
}
export const VuiModal: DefineComponent<VuiModalProps>;

// ============================================================
// VuiMultiSelect
// ============================================================
export interface VuiMultiSelectOption {
  label?: string;
  value?: StringOrNumber;
  options?: VuiMultiSelectOption[];
}
export interface VuiMultiSelectProps {
  /** Multi-select label text */
  label?: string;
  /** Disable the multi-select */
  disabled?: boolean;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search input placeholder text */
  placeholder?: string;
  /** Array of options [{label, value}] or grouped [{label, options: [{label, value}]}] */
  options?: VuiMultiSelectOption[] | null;
  /** v-model binding for selected values array */
  modelValue?: StringOrNumber[] | null;
}
export const VuiMultiSelect: DefineComponent<VuiMultiSelectProps>;

// ============================================================
// VuiPopover
// ============================================================
export interface VuiPopoverProps {
  /** Popover title text */
  title?: string;
  /** Target element or rect for positioning */
  target?: any;
  /** Show arrow pointing to target */
  arrow?: boolean;
  /** Popover body padding */
  padding?: string;
  /** Use fixed positioning (ignore scroll) */
  fixed?: boolean;
  /** Auto-close on outside click or Escape key */
  autoClose?: boolean;
  /** Behavior on window resize: "close" or truthy to update */
  bindResize?: string | boolean;
  /** Behavior on window scroll: "close" or truthy to update */
  bindScroll?: string | boolean;
  /** Popover width */
  width?: StringOrNumber;
  /** Popover minimum height */
  minHeight?: StringOrNumber;
  /** Popover maximum height */
  maxHeight?: StringOrNumber;
  /** Preferred positions (comma-separated or array, e.g. "bottom,top") */
  positions?: string | string[];
  /** Popover border color */
  borderColor?: string;
  /** Popover background color */
  bgColor?: string;
  /** Popover text color */
  color?: string;
  /** Container element for boundary calculation */
  container?: any;
  /** Disable pointer events (non-interactive popover) */
  nonreactive?: boolean;
  modelValue?: boolean | null;
}
export const VuiPopover: DefineComponent<VuiPopoverProps>;

// ============================================================
// VuiProgress
// ============================================================
export interface VuiProgressProps {
  /** Progress percentage (0-100) */
  percentage?: number | string;
  /** Progress bar width */
  width?: string;
  /** Progress bar height */
  height?: string;
  /** Border radius */
  radius?: string;
  /** Progress fill color */
  color?: string;
  /** Progress bar border color */
  borderColor?: string;
}
export const VuiProgress: DefineComponent<VuiProgressProps>;

// ============================================================
// VuiRadio
// ============================================================
export interface VuiRadioProps {
  /** Radio label text */
  label?: string;
  /** Radio group name */
  name?: string;
  /** Disable the radio */
  disabled?: boolean;
  /** Radio value */
  value?: string;
  modelValue?: string | null;
}
export const VuiRadio: DefineComponent<VuiRadioProps>;

// ============================================================
// VuiSelect
// ============================================================
export interface VuiSelectOption {
  label?: string;
  value?: StringOrNumber;
  removable?: boolean;
}
export interface VuiSelectProps {
  /** Select label text */
  label?: string;
  /** Disable the select */
  disabled?: boolean;
  /** Input type attribute */
  type?: string;
  /** Array of option objects [{label, value}] */
  options?: VuiSelectOption[] | null;
  /** Select width */
  width?: StringOrNumber;
  /** Select minimum width */
  minWidth?: StringOrNumber;
  /** Select maximum width */
  maxWidth?: StringOrNumber;
  /** Select font size */
  fontSize?: StringOrNumber;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Auto-select text on focus */
  selectOnFocus?: boolean;
  /** If true, v-model binds to option index instead of value */
  index?: boolean;
  /** Initial value (used without v-model) */
  value?: StringOrNumber;
  /** v-model binding for selected value */
  modelValue?: StringOrNumber | null;
}
export const VuiSelect: DefineComponent<VuiSelectProps>;

// ============================================================
// VuiSlider
// ============================================================
export interface VuiSliderProps {
  /** Show left/right navigation buttons */
  button?: boolean;
  /** Slider container width */
  width?: string;
  /** Slider container height */
  height?: string;
  /** Update token — change this value to trigger re-layout */
  token?: StringOrNumber;
  /** Scroll step size in pixels when using buttons */
  step?: number | string;
}
export const VuiSlider: DefineComponent<VuiSliderProps>;

// ============================================================
// VuiSwitch
// ============================================================
export interface VuiSwitchProps {
  /** Switch label text */
  label?: string;
  /** Label position: left or right */
  labelPosition?: 'left' | 'right';
  /** Allow clicking label to toggle switch */
  labelClickable?: boolean;
  /** Comma-separated colors: offColor,onColor */
  colors?: string;
  /** Switch width */
  width?: string;
  /** Switch height */
  height?: string;
  /** Disable the switch */
  disabled?: boolean;
  modelValue?: boolean | null;
}
export const VuiSwitch: DefineComponent<VuiSwitchProps>;

// ============================================================
// VuiTab
// ============================================================
export interface VuiTabOption {
  label?: string;
  value?: StringOrNumber;
  disabled?: boolean;
}
export interface VuiTabColors {
  background?: string;
  separator?: string;
  hover?: string;
  selected?: string;
}
export interface VuiTabProps {
  /** Array of tab options [{label, value, disabled}] */
  options?: VuiTabOption[];
  /** Color configuration object: {background, separator, hover, selected} */
  colors?: VuiTabColors;
  /** Tab alignment: left, center, or right */
  align?: 'left' | 'center' | 'right' | '';
}
export const VuiTab: DefineComponent<VuiTabProps>;

// ============================================================
// VuiToast
// ============================================================
export interface VuiToastProps {
  /** Toast type: success, error, info, or custom */
  type?: string;
  /** Toast message content */
  content?: string;
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
}
export const VuiToast: DefineComponent<VuiToastProps>;

// ============================================================
// VuiTooltip
// ============================================================
export interface VuiTooltipProps {
  /** Tooltip content text */
  text?: string;
  /** Enable HTML content rendering */
  html?: boolean;
  /** Tooltip maximum width */
  maxWidth?: StringOrNumber;
  /** Target element or rect for positioning */
  target?: any;
  /** Preferred positions (comma-separated or array) */
  positions?: string | string[];
  /** Tooltip border color */
  borderColor?: string;
  /** Tooltip background color */
  bgColor?: string;
  /** Tooltip text color */
  color?: string;
  /** Container element for boundary calculation */
  container?: any;
  /** Disable pointer events (non-interactive tooltip) */
  nonreactive?: boolean;
  /** Initial visibility (used without v-model) */
  visible?: boolean;
}
export const VuiTooltip: DefineComponent<VuiTooltipProps>;

// ============================================================
// Utilities
// ============================================================

/** Icon name to SVG string map (mutable, can be extended via setIcons) */
export const icons: Record<string, string>;

/** Default icons loaded from SVG files (read-only snapshot) */
export const defaultIcons: Record<string, string>;

/** Set or override icons by name */
export function setIcons(iconMap: Record<string, string>): void;

/** Initialize global tooltip event listeners */
export function initGlobalTooltips(
  onEnter: (target: HTMLElement, text: string) => void,
  onLeave: (target: HTMLElement) => void,
  getTooltip?: (target: HTMLElement) => string | null
): void;

/** Mount a Vue component to a DOM element */
export function mount(
  Component: any,
  options: {
    el?: HTMLElement;
    props?: Record<string, any>;
    children?: any;
    app?: any;
  }
): { el: HTMLElement; unmount: () => void };

/** Show a toast notification */
export function showToast(
  options: {
    type?: string;
    content?: string;
    timeout?: number;
  },
  container?: HTMLElement
): { el: HTMLElement; unmount: () => void };

// ============================================================
// Motion class
// ============================================================
export interface MotionOptions {
  easing?: ((t: number) => number) | null;
  duration?: number;
  from?: number;
  till?: number;
  data?: number;
}
export class Motion extends EventTarget {
  static START: string;
  static MOVE: string;
  static END: string;
  static STOP: string;
  constructor(options?: MotionOptions);
  start(): void;
  stop(): void;
}

// ============================================================
// StartMoveEnd class
// ============================================================
export interface StartMoveEndOptions {
  inertia?: boolean;
  inertiaTime?: number;
}
export class StartMoveEnd extends EventTarget {
  static START: string;
  static MOVE: string;
  static END: string;
  static INERTIA: string;
  constructor(target: HTMLElement, options?: StartMoveEndOptions);
  bind(event: string, handler: (e: any) => void): void;
  destroy(): void;
}