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
  
  // Replace import
  content = content.replace(/import \{ content \} from '\.\.\/\.\.\/data\/content(?:'|;?);?/g, "import { useContent } from '../../context/ContentContext';");
  
  // Inject hook right after the component declaration
  content = content.replace(/(export const \w+[\s\S]*?(?:=>\s*\{|\(\)\s*\{))(?!\s*const \{ content \} = useContent\(\);)/, "$1\n  const { content } = useContent();");
  
  fs.writeFileSync(f, content);
  console.log('Refactored:', f);
});

// Fix PublicHome.tsx to not import from data/content directly if not needed, but wait, PublicHome uses 'Language' type which is fine.
