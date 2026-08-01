const moduleStrings = import.meta.glob('../icons/*.svg', {
    query: '?raw',
    eager: true
});

const defaultIcons = {};
const keys = Object.keys(moduleStrings);
for (const src of keys) {
    const icon = src.split('/').pop().slice(0, -4);
    defaultIcons[icon] = moduleStrings[src].default;
}

const icons = {
    ... defaultIcons
};

const setIcons = (iconMap) => {
    Object.assign(icons, iconMap);
};

export {
    icons, defaultIcons, setIcons
};
