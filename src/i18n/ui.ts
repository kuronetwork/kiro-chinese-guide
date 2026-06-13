// ============================================================
// i18n 核心:語系判斷 + 介面字串字典 + t() 取字工具
//
// 設計原則(方便未來維護,且能交給 AI 接手):
//   - 中文(zh-Hant)是「真實來源」。內容檔放在 src/content/docs/ 根目錄,
//     網址維持 /xxx/(完全不動,保住既有 SEO)。
//   - 英文(en)是鏡像,放在 src/content/docs/en/,slug 自動變 en/xxx,
//     網址 /en/xxx/。
//   - 介面文字一律集中在這份字典,新增語系只要再補一個 key 區塊。
// ============================================================

export const DEFAULT_LOCALE = 'zh-Hant' as const;
export const LOCALES = ['zh-Hant', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** 內容 id(例如 'en/01-intro' 或 '01-intro')→ 語系 */
export function localeOf(id: string): Locale {
  return id.startsWith('en/') ? 'en' : 'zh-Hant';
}

/** 去掉語系前綴,取得跨語系共用的「基底鍵」(例如 'en/01-intro' → '01-intro') */
export function baseKey(id: string): string {
  return id.startsWith('en/') ? id.slice(3) : id;
}

/** 由基底鍵 + 語系組出內容 id(en 會加上 en/ 前綴) */
export function idFor(locale: Locale, key: string): string {
  return locale === 'en' ? `en/${key}` : key;
}

/** 由內容 id 組出網站路徑(尾端帶斜線);不含 base。 */
export function pathForId(id: string): string {
  return `/${id}/`;
}

/** <html lang> 用的值 */
export const HTML_LANG: Record<Locale, string> = {
  'zh-Hant': 'zh-Hant',
  en: 'en',
};

/** og:locale 用的值 */
export const OG_LOCALE: Record<Locale, string> = {
  'zh-Hant': 'zh_TW',
  en: 'en_US',
};

/** 語言切換器上顯示的標籤 */
export const LOCALE_LABEL: Record<Locale, string> = {
  'zh-Hant': '中',
  en: 'EN',
};

type Dict = Record<string, string>;

const ui: Record<Locale, Dict> = {
  'zh-Hant': {
    // 站名 / 標題列
    'site.titleSuffix': '繁中教學',
    'site.tagline': 'Kiro CLI 繁體中文教學 — 從零到自動化的完整學習路徑。',
    'nav.menu': '開關選單',
    'nav.toLang': '切換語言',

    // 程式碼複製按鈕
    'code.copy': '複製',
    'code.copied': '已複製',
    'code.aria': '複製程式碼',

    // 章節切換器
    'pager.aria': '章節切換',
    'pager.prev': '❮ 上一章',
    'pager.next': '下一章 ❯',

    // 首頁
    'home.title': 'Kiro CLI 繁中教學 — 從零到自動化',
    'home.h1': 'Kiro CLI 繁中教學',
    'home.lead':
      '把 AI agent 帶進你的 Terminal。從第一次對話開始,一路帶你走到多專案平行的全自動工作流。',
    'home.sub': '繁體中文 · 每段都附能直接複製的範例 · 對應 Kiro CLI 2.6.1',
    'home.cta.start': '開始學習 ❯',
    'home.cta.path': '看學習路徑',
    'home.path.title': '# 學習路徑',
    'home.foot':
      '非官方社群教學,內容經整理並翻譯為中文,輔助學習使用,請以官方指令為準。與 Amazon / AWS 無關聯。指令行為以你本機的 kiro-cli --help 為準。',

    // 首頁示意終端機(逐行)
    'home.term.comment': '# 在任何專案資料夾,叫出 Terminal 裡的 AI agent',
    'home.term.cmd1': 'kiro-cli chat',
    'home.term.ready': 'Kiro CLI 2.6.1 — 已就緒。輸入你的任務…',
    'home.term.cmd2': '幫我把這個專案的測試補齊並跑過',
    'home.term.steps': '› 規劃任務 › 讀取程式碼 › 寫測試 › 執行 › 完成 ✓',
    'home.term.name': 'zsh — kiro-cli',

    // 互動練習場(遊戲)
    'game.entry': '練習場',
    'game.title': '互動練習場',
    'game.subtitle': '在模擬終端裡跑一遍最常用的 Kiro CLI 指令。純練習,不會真的執行任何東西。',
    'game.level': '關卡',
    'game.of': '/',
    'game.goalLabel': '目標',
    'game.hint': '提示',
    'game.showAnswer': '看答案',
    'game.skip': '略過',
    'game.next': '下一關 →',
    'game.placeholder': '在這裡輸入,按 Enter…',
    'game.correct': '✓ 答對了!',
    'game.wrong': '不太對,再試試看(或點提示)。',
    'game.answerLabel': '參考答案(已幫你填好,按 Enter 送出)',
    'game.backToChapter': '讀對應章節 →',
    'game.safety': '模擬終端 · 不會在你的機器上執行任何指令',
    'game.reset': '重置進度',
    'game.done.title': '🎉 全部過關!',
    'game.done.body': '你已經跑過 Kiro CLI 最核心的幾個動作。接下來把它們串成真實工作流,看實戰 Cookbook。',
    'game.done.cta': '前往實戰 Cookbook →',
    'game.done.restart': '重新挑戰',
  },

  en: {
    // Site name / topbar
    'site.titleSuffix': 'CLI Guide',
    'site.tagline':
      'A Kiro CLI tutorial — a complete learning path from zero to automation.',
    'nav.menu': 'Toggle menu',
    'nav.toLang': 'Switch language',

    // Code copy button
    'code.copy': 'Copy',
    'code.copied': 'Copied',
    'code.aria': 'Copy code',

    // Pager
    'pager.aria': 'Chapter navigation',
    'pager.prev': '❮ Previous',
    'pager.next': 'Next ❯',

    // Home
    'home.title': 'Kiro CLI Guide — From Zero to Automation',
    'home.h1': 'Kiro CLI Guide',
    'home.lead':
      'Bring the AI agent into your terminal. From your very first chat all the way to fully automated, multi-project parallel workflows.',
    'home.sub': 'English · Copy-paste-ready examples in every section · For Kiro CLI 2.6.1',
    'home.cta.start': 'Start learning ❯',
    'home.cta.path': 'See the learning path',
    'home.path.title': '# Learning path',
    'home.foot':
      'An unofficial community tutorial, curated to help you learn — always defer to the official commands. Not affiliated with Amazon / AWS. Command behavior follows your local kiro-cli --help.',

    // Home demo terminal (line by line)
    'home.term.comment': '# In any project folder, summon the AI agent in your terminal',
    'home.term.cmd1': 'kiro-cli chat',
    'home.term.ready': 'Kiro CLI 2.6.1 — ready. Type your task…',
    'home.term.cmd2': 'Fill in the missing tests for this project and run them',
    'home.term.steps': '› plan task › read code › write tests › run › done ✓',
    'home.term.name': 'zsh — kiro-cli',

    // Interactive Playground (game)
    'game.entry': 'Playground',
    'game.title': 'Interactive Playground',
    'game.subtitle': 'Run through the most-used Kiro CLI commands in a simulated terminal. Practice only — nothing is ever actually executed.',
    'game.level': 'Level',
    'game.of': 'of',
    'game.goalLabel': 'Goal',
    'game.hint': 'Hint',
    'game.showAnswer': 'Show answer',
    'game.skip': 'Skip',
    'game.next': 'Next →',
    'game.placeholder': 'Type here, press Enter…',
    'game.correct': '✓ Correct!',
    'game.wrong': 'Not quite — give it another go (or take a hint).',
    'game.answerLabel': 'Answer (filled in for you — press Enter to submit)',
    'game.backToChapter': 'Read the matching chapter →',
    'game.safety': 'Simulated terminal · never runs any command on your machine',
    'game.reset': 'Reset progress',
    'game.done.title': '🎉 All levels cleared!',
    'game.done.body': "You've run through the core Kiro CLI moves. Next, see how they string into real workflows in the Cookbook.",
    'game.done.cta': 'Go to the Cookbook →',
    'game.done.restart': 'Play again',
  },
};

/** 取介面字串;找不到時退回中文,再退回 key 本身。 */
export function t(locale: Locale, key: string): string {
  return ui[locale]?.[key] ?? ui[DEFAULT_LOCALE][key] ?? key;
}
