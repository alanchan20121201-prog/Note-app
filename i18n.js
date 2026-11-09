/*
 * NoteApp 四語系字典：简体中文 / 繁體中文 / English / 日本語
 *
 * 每個 EXE 由 build-4lang.js 在建置時寫入 lang.txt 固定語言；
 * 直接用原始碼啟動（npm start）時，改依系統語言自動偵測。
 */
(function () {
  'use strict';

  var DICT = {
    'zh-CN': {
      'app.title': '极简本地笔记',
      'sidebar.notes': '历史笔记',
      'sidebar.trash': '回收站',
      'btn.new': '+ 新建',
      'tab.notes': '笔记',
      'tab.trash': '回收站',
      'placeholder.title': '输入标题...',
      'placeholder.content': '在这里写下你的想法...',
      'status.saved': '已保存到本地',
      'btn.save': '保存到本地',
      'empty.notes': '暂无历史笔记',
      'empty.trash': '回收站为空',
      'note.untitled': '无标题',
      'title.export': '导出为 TXT',
      'title.delete': '删除',
      'title.restore': '还原',
      'title.deleteForever': '彻底删除',
      'error.titleEmpty': '错误：标题不能为空！',
      'error.titleInvalid': '错误：标题包含非法字符（\\ / : * ? " < > |）',
      'confirm.deleteForever': '确定要永久删除这条笔记吗？',
      'export.labelTitle': '标题：',
      'export.labelDateTime': '日期/时间：'
    },
    'zh-TW': {
      'app.title': '極簡本地筆記',
      'sidebar.notes': '歷史筆記',
      'sidebar.trash': '回收桶',
      'btn.new': '+ 新增',
      'tab.notes': '筆記',
      'tab.trash': '回收桶',
      'placeholder.title': '輸入標題...',
      'placeholder.content': '在這裡寫下你的想法...',
      'status.saved': '已儲存至本機',
      'btn.save': '儲存至本機',
      'empty.notes': '尚無歷史筆記',
      'empty.trash': '回收桶是空的',
      'note.untitled': '無標題',
      'title.export': '匯出為 TXT',
      'title.delete': '刪除',
      'title.restore': '還原',
      'title.deleteForever': '永久刪除',
      'error.titleEmpty': '錯誤：標題不能為空！',
      'error.titleInvalid': '錯誤：標題包含非法字元（\\ / : * ? " < > |）',
      'confirm.deleteForever': '確定要永久刪除這則筆記嗎？',
      'export.labelTitle': '標題：',
      'export.labelDateTime': '日期/時間：'
    },
    en: {
      'app.title': 'Minimalist Local Notes',
      'sidebar.notes': 'History Notes',
      'sidebar.trash': 'Trash Bin',
      'btn.new': '+ New',
      'tab.notes': 'Notes',
      'tab.trash': 'Trash',
      'placeholder.title': 'Enter title...',
      'placeholder.content': 'Write your thoughts here...',
      'status.saved': 'Saved to local history',
      'btn.save': 'Save to Local History',
      'empty.notes': 'No history notes',
      'empty.trash': 'Trash is empty',
      'note.untitled': 'Untitled',
      'title.export': 'Export as Txt',
      'title.delete': 'Delete',
      'title.restore': 'Restore',
      'title.deleteForever': 'Delete Forever',
      'error.titleEmpty': 'Error: Title cannot be empty!',
      'error.titleInvalid': 'Error: Title contains illegal characters (\\ / : * ? " < > |)',
      'confirm.deleteForever': 'Are you sure you want to permanently delete this note?',
      'export.labelTitle': 'Title: ',
      'export.labelDateTime': 'Date/Time: '
    },
    ja: {
      'app.title': 'ミニマルローカルノート',
      'sidebar.notes': '履歴ノート',
      'sidebar.trash': 'ゴミ箱',
      'btn.new': '+ 新規',
      'tab.notes': 'ノート',
      'tab.trash': 'ゴミ箱',
      'placeholder.title': 'タイトルを入力...',
      'placeholder.content': 'ここに思いを書いてください...',
      'status.saved': 'ローカルに保存しました',
      'btn.save': 'ローカルに保存',
      'empty.notes': '履歴ノートはありません',
      'empty.trash': 'ゴミ箱は空です',
      'note.untitled': '無題',
      'title.export': 'TXT でエクスポート',
      'title.delete': '削除',
      'title.restore': '復元',
      'title.deleteForever': '完全に削除',
      'error.titleEmpty': 'エラー：タイトルを入力してください',
      'error.titleInvalid': 'エラー：タイトルに使用できない文字が含まれています（\\ / : * ? " < > |）',
      'confirm.deleteForever': 'このノートを完全に削除してもよろしいですか？',
      'export.labelTitle': 'タイトル：',
      'export.labelDateTime': '日時：'
    }
  };

  var FALLBACK = 'en';

  function detect() {
    var v = null;
    try {
      var fs = require('fs');
      var path = require('path');
      var f = path.join(__dirname, 'lang.txt');
      if (fs.existsSync(f)) v = fs.readFileSync(f, 'utf8').trim();
    } catch (_e) { /* 無 lang.txt 或純瀏覽器環境 */ }
    if (v && DICT[v]) return v;
    try {
      var nav = (navigator.language || 'en').toLowerCase().replace('_', '-');
      if (nav.indexOf('ja') === 0) return 'ja';
      if (nav.indexOf('zh') === 0) return /tw|hk|mo|hant/.test(nav) ? 'zh-TW' : 'zh-CN';
    } catch (_e2) { /* ignore */ }
    return FALLBACK;
  }

  var lang = detect();
  window.I18N_LANG = lang;
  window.t = function (key) {
    return (DICT[lang] && DICT[lang][key]) || DICT[FALLBACK][key] || key;
  };
  window.applyI18n = function () {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = window.t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = window.t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.title = window.t(el.getAttribute('data-i18n-title'));
    });
  };
})();
