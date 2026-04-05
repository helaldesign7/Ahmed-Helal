const fs = require('fs');
const path = require('path');

const sections = ['Hero','LaptopSection','FeaturedWork','Services','Marquee','Process','Testimonials','Metrics','ContactCTA'];
const files = sections.map(n => path.join('src/sections', n, n + '.tsx'));

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  
  if (text.includes('useContent();')) {
     console.log('Already injected:', f);
     return;
  }

  // Find: export const Name = (...) => {
  const compMatch = f.match(/([a-zA-Z]+)\.tsx/)[1];
  const searchPattern = `export const ${compMatch} = (`;
  
  const idx = text.indexOf(searchPattern);
  if (idx !== -1) {
     const arrowIdx = text.indexOf('=> {', idx);
     if (arrowIdx !== -1) {
        const injectIdx = arrowIdx + 4;
        text = text.slice(0, injectIdx) + "\n  const { content } = useContent();" + text.slice(injectIdx);
        fs.writeFileSync(f, text);
        console.log('Injected safely:', f);
     }
  }
});
