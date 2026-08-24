const fs = require('fs');
const icons = ['arrow-up-from-line', 'ship-wheel', 'house', 'ellipsis', 'shield-check', 'user-round', 'lock-keyhole', 'arrow-right'];
const lucide = require('lucide');

for (const icon of icons) {
  const camelCase = icon.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const iconData = lucide.icons[camelCase];
  if (iconData) {
    const paths = iconData.map(node => {
      const attrs = Object.entries(node[1]).map(([k,v]) => `${k}="${v}"`).join(' ');
      return `<${node[0]} ${attrs}/>`;
    }).join('');
    console.log(`'${icon}': '${paths}',`);
  } else {
    console.log(`Icon ${icon} not found`);
  }
}
