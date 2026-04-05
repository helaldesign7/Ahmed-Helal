const fs = require('fs');
const path = require('path');

const sections = ['Hero','LaptopSection','FeaturedWork','Services','Marquee','Process','Testimonials','Metrics','ContactCTA'];
const files = sections.map(n => path.join('src/sections', n, n + '.tsx'));

files.forEach(f => {
  if (!fs.existsSync(f)) {
     console.log('Skipping', f);
     return;
  }
  let content = fs.readFileSync(f, 'utf8');
  
  // Replace the import
  content = content.replace(/import.*?\{[^}]*content[^}]*\}.*?from ['"]\.\.\/\.\.\/data\/content['"];?/g, 
    "import { useContent } from '../../context/ContentContext';\nimport type { Language } from '../../data/content';");
  
  // Inject hook properly inside the main exported component
  const compMatch = f.match(/([a-zA-Z]+)\.tsx/)[1];
  
  // Search for: export const ComponentName = ... => {
  const regex = new RegExp(`(export const ${compMatch}[^=]*=\\s*(?:[^\\{]*\\{[^}]*\\})?\\s*=>\\s*\\{)(?!\\s*const \\{ content \\} = useContent\\(\\);)`);
  
  if (content.match(regex)) {
    content = content.replace(regex, "$1\n  const { content } = useContent();");
  } else {
    console.log("Could not find matching function header in", f);
  }
  
  fs.writeFileSync(f, content);
  console.log('Refactored:', f);
});
