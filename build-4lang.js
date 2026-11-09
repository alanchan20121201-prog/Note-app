/*
 * 產出四個語言固定版本的 EXE：
 *   NoteApp-zh-CN.exe / NoteApp-zh-TW.exe / NoteApp-en.exe / NoteApp-ja.exe
 *
 * 每次建置前寫入 lang.txt，electron-builder 會把它一起包進 app；
 * i18n.js 啟動時讀取該檔決定介面語言，因此每個 EXE 只含一種語言。
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const LANGS = ['zh-CN', 'zh-TW', 'en', 'ja'];
const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
// 清掉上一次的語言產物，避免重複打包
for (const f of fs.readdirSync(DIST)) {
  if (f.startsWith('NoteApp-') && f.endsWith('.exe')) {
    fs.rmSync(path.join(DIST, f), { force: true });
  }
}

for (const lang of LANGS) {
  fs.writeFileSync(path.join(ROOT, 'lang.txt'), lang + '\n', 'utf8');
  console.log('\n=== 建置 ' + lang + ' ===');
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['electron-builder', '--win', 'portable'],
    { stdio: 'inherit', cwd: ROOT });

  const exe = fs.readdirSync(DIST)
    .find(f => f.endsWith('.exe') && !f.startsWith('NoteApp-'));
  if (!exe) throw new Error('找不到 electron-builder 產出的 exe');
  const target = 'NoteApp-' + lang + '.exe';
  fs.renameSync(path.join(DIST, exe), path.join(DIST, target));
  console.log('✔ ' + target);
}

fs.rmSync(path.join(ROOT, 'lang.txt'), { force: true });
console.log('\n四個語言 EXE 已產出於 dist/');
