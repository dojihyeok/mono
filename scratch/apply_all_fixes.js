const fs = require('fs');
const path = require('path');

const dirPath = '/Users/yunhyeok/mono/new mono';
const files = fs.readdirSync(dirPath);

function extractScript(html, type) {
  const regex = new RegExp(`<script[^>]*type="${type}"[^>]*>([\\s\\S]*?)</script>`, 'i');
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

files.forEach(file => {
  if (!file.endsWith('.html')) return;
  const filePath = path.join(dirPath, file);
  let htmlContent = fs.readFileSync(filePath, 'utf8');
  console.log(`\n========================================`);
  console.log(`Processing file: ${file}`);
  
  const isUserApp = file.normalize('NFC').includes('사용자 앱');

  // 1. Hide raw loading/thumbnail screens in raw CSS
  console.log('Patching raw CSS for loading screen...');
  htmlContent = htmlContent.replace(
    /#__bundler_thumbnail\s*{/g,
    '#__bundler_thumbnail { display: none !important;'
  );
  htmlContent = htmlContent.replace(
    /#__bundler_loading\s*{/g,
    '#__bundler_loading { display: none !important;'
  );

  // 2. Extract the template block
  const templateStr = extractScript(htmlContent, '__bundler/template');
  if (!templateStr) {
    console.log(`No template found for ${file}`);
    return;
  }

  try {
    let template = JSON.parse(templateStr);
    console.log(`Successfully parsed template of size ${template.length} characters.`);

    // 3. Apply changes based on the file type
    if (isUserApp) {
      console.log('Applying layout and theme fixes for MoNo 사용자 앱...');
      
      const oldHeaderAndPhone = `<div ref="{{ rootRef }}" style="min-height:100vh; width:100%; background:radial-gradient(120% 80% at 50% 0%, var(--amb1,#20312a) 0%, var(--amb2,#16241e) 45%, var(--amb3,#0d1814) 100%); display:flex; flex-direction:column; align-items:center; padding:40px 20px 56px; gap:22px; box-sizing:border-box; font-family:\'Pretendard\',sans-serif;">\n\n  <div style="display:flex; flex-direction:column; align-items:center; gap:7px; text-align:center;">\n    <div style="display:flex; align-items:center; gap:10px;">\n      <div style="width:30px; height:30px; border-radius:9px; background:linear-gradient(140deg,var(--c3,#1a6b51),var(--c0,#0a2519)); display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(10,37,25,.5), inset 0 0 0 1px rgba(232,195,74,.3); padding:6px;">\n        <svg width="100%" height="100%" viewBox="0 0 28 28" fill="none"><path d="M5 21V9l9 7 9-7v12" stroke="var(--a1,#e8c34a)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></svg>\n      </div>\n      <span style="color:var(--t0,#f0ede4); font-size:18px; font-weight:800; letter-spacing:-.2px;">MoNo</span>\n      <span style="color:#7e8f86; font-size:13px; font-weight:600;">· 근로자 네이티브 앱</span>\n    </div>\n    <span style="color:#5f7269; font-size:12.5px; font-weight:500; letter-spacing:.2px;">현장 경력을 신뢰 가능한 데이터 자산으로 — 인터랙티브 프로토타입</span>\n  </div>\n\n  <!-- PHONE -->\n  <div style="width:412px; height:872px; flex:none; background:linear-gradient(160deg,#1c1c1e,#0a0a0b); border-radius:56px; padding:11px; box-shadow:0 40px 90px -20px rgba(0,0,0,.7), 0 0 0 2px rgba(255,255,255,.04) inset; position:relative;">\n    <div style="position:absolute; top:0; left:0; right:0; height:100%; border-radius:56px; box-shadow:0 0 0 1px rgba(255,255,255,.06) inset; pointer-events:none; z-index:50;"></div>\n    <div class="scr" style="width:390px; height:850px; border-radius:46px; overflow:hidden; background:var(--bg,#f3f1ea); display:flex; flex-direction:column; position:relative;">`;

      const newFullScreenLayout = `<div ref="{{ rootRef }}" style="min-height:100vh; width:100%; background:var(--bg,#f3f1ea); display:flex; flex-direction:column; box-sizing:border-box; font-family:\'Pretendard\',sans-serif;">\n\n  <div class="scr" style="width:100%; flex:1; min-height:100vh; border-radius:0px; overflow:hidden; background:var(--bg,#f3f1ea); display:flex; flex-direction:column; position:relative;">`;

      if (template.includes(oldHeaderAndPhone)) {
        template = template.replace(oldHeaderAndPhone, newFullScreenLayout);
        console.log('Successfully replaced phone mockup layout.');
      } else {
        // Try replacing with different whitespace formatting if needed
        const oldNormalized = oldHeaderAndPhone.replace(/\r?\n/g, '\n');
        const templateNormalized = template.replace(/\r?\n/g, '\n');
        if (templateNormalized.includes(oldNormalized)) {
          template = templateNormalized.replace(oldNormalized, newFullScreenLayout);
          console.log('Successfully replaced phone mockup layout (normalized).');
        } else {
          console.warn('WARNING: Phone mockup layout pattern not found in template!');
        }
      }

      const oldClosers = `    </div>\n  </div>\n</div>\n\n</x-dc>`;
      const newClosers = `    </div>\n  </div>\n\n</x-dc>`;

      if (template.includes(oldClosers)) {
        template = template.replace(oldClosers, newClosers);
        console.log('Successfully replaced closing divs.');
      } else {
        const oldClosersNormalized = oldClosers.replace(/\r?\n/g, '\n');
        const templateNormalized = template.replace(/\r?\n/g, '\n');
        if (templateNormalized.includes(oldClosersNormalized)) {
          template = templateNormalized.replace(oldClosersNormalized, newClosers);
          console.log('Successfully replaced closing divs (normalized).');
        } else {
          console.warn('WARNING: Closing divs pattern not found in template!');
        }
      }

      // Replace default state theme from 'green' to 'mono'
      const oldStateTheme = `localStorage.getItem('mono-theme'))?localStorage.getItem('mono-theme'):'green'`;
      const newStateTheme = `localStorage.getItem('mono-theme'))?localStorage.getItem('mono-theme'):'mono'`;
      if (template.includes(oldStateTheme)) {
        template = template.replace(oldStateTheme, newStateTheme);
        console.log('Changed default state theme from green to mono.');
      } else {
        const alternateStateTheme = `localStorage.getItem('mono-theme'))?localStorage.getItem('mono-theme'):'mono'`;
        if (template.includes(alternateStateTheme)) {
          console.log('Default state theme is already mono.');
        } else {
          console.warn('WARNING: Default state theme key not found!');
        }
      }

      // Replace applyTheme fallback theme from 'green' to 'mono'
      const oldApplyThemeFallback = `this.THEMES[this.state.theme]||this.THEMES.green`;
      const newApplyThemeFallback = `this.THEMES[this.state.theme]||this.THEMES.mono`;
      if (template.includes(oldApplyThemeFallback)) {
        template = template.replaceAll(oldApplyThemeFallback, newApplyThemeFallback);
        console.log('Replaced applyTheme fallback theme to mono.');
      }

      // Replace hardcoded active tab highlight color
      const oldTabBg = `'#d7e8de'`;
      const newTabBg = `'var(--soft)'`;
      if (template.includes(oldTabBg)) {
        template = template.replaceAll(oldTabBg, newTabBg);
        console.log('Replaced active tab background highlight.');
      }
    } else {
      // For desktop templates, update default theme state to 'mono'
      console.log('Applying default theme updates for desktop page...');
      
      const oldStateThemePattern1 = `theme:(typeof localStorage!=='undefined'&&localStorage.getItem('mono-theme'))||'green'`;
      const newStateThemePattern1 = `theme:(typeof localStorage!=='undefined'&&['green','mono','trive'].includes(localStorage.getItem('mono-theme'))?localStorage.getItem('mono-theme'):'mono')`;
      
      if (template.includes(oldStateThemePattern1)) {
        template = template.replace(oldStateThemePattern1, newStateThemePattern1);
        console.log('Successfully updated default theme state to mono.');
      } else {
        const oldStateThemePattern2 = `theme:(typeof localStorage!=='undefined'&&localStorage.getItem('mono-theme'))||"green"`;
        if (template.includes(oldStateThemePattern2)) {
          template = template.replace(oldStateThemePattern2, newStateThemePattern1);
          console.log('Successfully updated default theme state (pattern 2) to mono.');
        } else {
          console.warn('WARNING: Default theme state pattern not found!');
        }
      }

      const oldApplyThemeFallback = `this.THEMES[this.state.theme]||this.THEMES.green`;
      const newApplyThemeFallback = `this.THEMES[this.state.theme]||this.THEMES.mono`;
      if (template.includes(oldApplyThemeFallback)) {
        template = template.replaceAll(oldApplyThemeFallback, newApplyThemeFallback);
        console.log('Replaced applyTheme fallback theme to mono.');
      } else {
        console.warn('WARNING: applyTheme fallback not found!');
      }
    }

    // 4. Serialize the template back to JSON, escaping all forward slashes as \u002F
    console.log('Serializing template and escaping forward slashes as \\u002F...');
    const newTemplateStr = JSON.stringify(template).replace(/\//g, '\\u002F');

    const targetScriptStart = htmlContent.indexOf('<script type="__bundler/template">');
    if (targetScriptStart === -1) {
      console.error('ERROR: Cannot find script start index!');
      return;
    }
    const innerContentStart = targetScriptStart + '<script type="__bundler/template">'.length;
    
    const nextClosingScript = htmlContent.indexOf('</script>', innerContentStart);
    if (nextClosingScript === -1) {
      console.error('ERROR: Cannot find closing </script> for template block!');
      return;
    }

    htmlContent = htmlContent.substring(0, innerContentStart) + newTemplateStr + htmlContent.substring(nextClosingScript);
    console.log(`Writing modifications back to file...`);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log('Successfully updated!');

  } catch (err) {
    console.error('ERROR processing template:', err);
  }
});
