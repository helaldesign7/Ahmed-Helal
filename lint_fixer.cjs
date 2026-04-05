const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/admin', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let mod = content;
    
    // Background replacements
    mod = mod.replace(/bg-\[#050505\]/g, 'bg-primary-black');
    mod = mod.replace(/bg-\[#040404\]/g, 'bg-primary-black');
    mod = mod.replace(/bg-white\/\[0\.02\]/g, 'bg-white/2');
    
    // Violet replacements (handle variants like text-, bg-, border-, accent-, hover:, focus:, etc)
    mod = mod.replace(/-\[#8b5cf6\]/g, '-accent-violet');
    
    // Linear gradient
    mod = mod.replace(/bg-gradient-to-/g, 'bg-linear-to-');
    
    // Fix DictionaryEditor
    if (filePath.includes('DictionaryEditor.tsx')) {
        mod = mod.replace("import { Content } from '../../data/content';", "import type { Content } from '../../data/content';");
        mod = mod.replace("data: any;", "/* eslint-disable-next-line @typescript-eslint/no-explicit-any */\n  data: any;");
        mod = mod.replace("updateText(sectionKey, path, 'raw', ", "updateText(sectionKey, path, 'raw' as any, ");
        mod = mod.replace("block text-[12px] font-bold text-white uppercase tracking-widest mb-4 inline-flex items-center gap-2", "text-[12px] font-bold text-white uppercase tracking-widest mb-4 inline-flex items-center gap-2");
    }

    if (content !== mod) {
      fs.writeFileSync(filePath, mod);
      console.log('Fixed lints in', filePath);
    }
  }
});
