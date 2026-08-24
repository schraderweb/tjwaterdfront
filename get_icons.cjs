const lucide = require('lucide');

const icons = ['arrow-up-from-line', 'ship-wheel', 'house', 'ellipsis', 'shield-check', 'user-round', 'lock-keyhole', 'arrow-right', 'map-pinned'];

for (const icon of icons) {
  const pascalCase = icon.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  const iconData = lucide.icons[pascalCase];
  if (iconData) {
    const paths = iconData.map(node => {
      const attrs = Object.entries(node[1]).map(([k,v]) => `${k}="${v}"`).join(' ');
      return `<${node[0]} ${attrs}/>`;
    }).join('');
    console.log(`  '${icon}': '${paths}',`);
  } else {
    console.log(`Icon ${icon} not found as ${pascalCase}`);
  }
}
