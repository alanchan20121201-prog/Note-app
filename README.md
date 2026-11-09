# NoteApp — 极简本地笔记 / 極簡本地筆記 / Minimalist Local Notes / ミニマルローカルノート

[下载 Windows 版](https://github.com/alanchan20121201-prog/Note-app/releases/tag/Windows)

![截图](https://github.com/user-attachments/assets/376befc0-0d83-405c-b471-33a87dbf9a20)

一个纯本地运行的 Electron 笔记软件，数据只存在本机，内置回收站与免安装便携版 EXE。

## 四种界面语言

| EXE | 语言 |
| --- | --- |
| `NoteApp-zh-CN.exe` | 简体中文 |
| `NoteApp-zh-TW.exe` | 繁體中文 |
| `NoteApp-en.exe` | English |
| `NoteApp-ja.exe` | 日本語 |

每个 EXE 的语言在打包时固定（写入 `lang.txt`），互不干扰；笔记数据存在 `localStorage`，四个语言版本共用同一份。

## 构建

```bash
npm install
npm run build:4lang   # 产出 dist/ 下四个语言的 EXE
```

单独运行源码（`npm start`）时没有 `lang.txt`，界面会依操作系统语言自动选择：
- `zh` / `zh-CN` → 简体中文
- `zh-TW` / `zh-HK` / `zh-Hant` → 繁體中文
- `ja` → 日本語
- 其他 → English

## 文案维护

所有界面文字集中在 `i18n.js` 的 `DICT`（四种语言各一份，共 22 个键）。新增文案时四种语言都要补齐；`lang.txt` 由 `build-4lang.js` 在构建时写入，不需要手动提交。
