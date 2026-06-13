// ============================================================
// 互動練習場 · 關卡資料
//
// 內容與引擎分離,方便日後增刪關卡,也天然支援雙語。
// accept 是「可接受輸入」的正規表達式字串清單(比對時帶 i 旗標、
// 並先把輸入做 trim + 多空白壓一格)。任一命中即過關,所以可以寫
// 得寬鬆一點,降低「答對卻被判錯」的挫折感。
//
// 指令依據官方文件與 kiro-cli --help 整理,對應 Kiro CLI 2.6.1。
// 這裡只是模擬終端,不會真的執行任何東西。
// ============================================================

import type { Locale } from '../i18n/ui';

export interface Level {
  id: string;                          // 對應 ?level= 深連結
  chapter: string;                     // 連回哪篇文章(doc id)
  title: Record<Locale, string>;
  goal: Record<Locale, string>;
  preamble: Record<Locale, string[]>;  // 終端先顯示的情境行(輸入前)
  accept: string[];                    // 可接受輸入的 regex 字串
  answer: Record<Locale, string>;      // 「看答案」填入的標準輸入
  output: Record<Locale, string[]>;    // 過關後逐行播放的輸出
  hints: Record<Locale, string[]>;
}

export const levels: Level[] = [
  {
    id: 'version',
    chapter: '02-install',
    title: { 'zh-Hant': '確認版本', en: 'Check your version' },
    goal: {
      'zh-Hant': '用一行指令查出你裝的是哪個版本。',
      en: 'Find out which version you have with a single command.',
    },
    preamble: {
      'zh-Hant': ['# 任務:查出目前安裝的 Kiro CLI 版本'],
      en: ['# Task: find the installed Kiro CLI version'],
    },
    accept: ['^kiro-cli\\s+(--version|-v|version)$'],
    answer: { 'zh-Hant': 'kiro-cli --version', en: 'kiro-cli --version' },
    output: { 'zh-Hant': ['Kiro CLI 2.6.1'], en: ['Kiro CLI 2.6.1'] },
    hints: {
      'zh-Hant': ['指令開頭是 kiro-cli', '加上 --version 這個旗標'],
      en: ['The command starts with kiro-cli', 'Add the --version flag'],
    },
  },
  {
    id: 'help',
    chapter: '17-reference',
    title: { 'zh-Hant': '求救 --help', en: 'Get help with --help' },
    goal: {
      'zh-Hant': '不確定指令怎麼用?叫出說明就對了。',
      en: 'Not sure how a command works? Bring up the help.',
    },
    preamble: {
      'zh-Hant': ['# 想看看 Kiro CLI 有哪些指令可以用'],
      en: ['# You want to see what commands Kiro CLI offers'],
    },
    accept: ['^kiro-cli\\s+(--help|-h|--help-all)$', '^kiro-cli\\s+\\w+\\s+--help$'],
    answer: { 'zh-Hant': 'kiro-cli --help', en: 'kiro-cli --help' },
    output: {
      'zh-Hant': [
        'Usage: kiro-cli [OPTIONS] [COMMAND]',
        '',
        'Commands:',
        '  chat      Terminal 裡的 AI 助理(核心)',
        '  agent     管理 AI agent',
        '  mcp       管理 MCP servers',
        '  settings  自訂外觀與行為',
        '  ...',
        'Options:',
        '  -h, --help     顯示說明',
        '  -V, --version  顯示版本',
      ],
      en: [
        'Usage: kiro-cli [OPTIONS] [COMMAND]',
        '',
        'Commands:',
        '  chat      The AI assistant in your terminal (the core)',
        '  agent     Manage AI agents',
        '  mcp       Manage MCP servers',
        '  settings  Customize appearance and behavior',
        '  ...',
        'Options:',
        '  -h, --help     Print help',
        '  -V, --version  Print version',
      ],
    },
    hints: {
      'zh-Hant': ['旗標是 --help(或簡寫 -h)', '想一次看全部子指令可以用 --help-all'],
      en: ['The flag is --help (or -h)', 'Use --help-all to see every subcommand at once'],
    },
  },
  {
    id: 'first-chat',
    chapter: '04-first-chat',
    title: { 'zh-Hant': '第一次對話', en: 'Your first chat' },
    goal: {
      'zh-Hant': '啟動 Terminal 裡的 AI agent。',
      en: 'Start the AI agent in your terminal.',
    },
    preamble: {
      'zh-Hant': ['# 進到專案資料夾,開始跟 Kiro 對話'],
      en: ['# In your project folder, start a conversation with Kiro'],
    },
    accept: [
      '^kiro-cli\\s+chat$',
      '^kiro-cli\\s+chat\\s+".+"$',
      "^kiro-cli\\s+chat\\s+'.+'$",
    ],
    answer: { 'zh-Hant': 'kiro-cli chat', en: 'kiro-cli chat' },
    output: {
      'zh-Hant': ['Kiro CLI 2.6.1 — 已就緒。輸入你的任務…'],
      en: ['Kiro CLI 2.6.1 — ready. Type your task…'],
    },
    hints: {
      'zh-Hant': ['核心子指令叫 chat', '完整是 kiro-cli chat'],
      en: ['The core subcommand is chat', 'In full: kiro-cli chat'],
    },
  },
  {
    id: 'ask',
    chapter: '04-first-chat',
    title: { 'zh-Hant': '用白話交辦', en: 'Ask in plain language' },
    goal: {
      'zh-Hant': '你已經在對話裡了。不用記指令,直接用一句話把任務講出來。',
      en: "You're in the chat now. No commands needed — just describe a task in one sentence.",
    },
    preamble: {
      'zh-Hant': ['Kiro CLI 2.6.1 — 已就緒。輸入你的任務…'],
      en: ['Kiro CLI 2.6.1 — ready. Type your task…'],
    },
    accept: ['^(?!kiro-cli)(?!/).{4,}$'],
    answer: {
      'zh-Hant': '列出這個專案用了哪些框架',
      en: 'list the frameworks this project uses',
    },
    output: {
      'zh-Hant': ['› 規劃任務', '› 讀取程式碼', '› 整理清單', '完成 ✓'],
      en: ['› plan task', '› read code', '› compile the list', 'done ✓'],
    },
    hints: {
      'zh-Hant': ['這裡不是打指令,是直接講你要做什麼', '例如:列出這個專案用了哪些框架'],
      en: ["This isn't a command — just say what you want", 'e.g., list the frameworks this project uses'],
    },
  },
  {
    id: 'trust',
    chapter: '07-tools-trust',
    title: { 'zh-Hant': '工具與信任', en: 'Tools & trust' },
    goal: {
      'zh-Hant': 'Kiro 想寫檔,正在等你核准。放行它。',
      en: 'Kiro wants to write a file and is waiting for your approval. Let it through.',
    },
    preamble: {
      'zh-Hant': [
        'Kiro 想使用工具:write → src/app.ts',
        '允許嗎?  [y] 這一次  ·  [t] 這次對話都信任  ·  [n] 拒絕',
      ],
      en: [
        'Kiro wants to use a tool: write → src/app.ts',
        'Allow?  [y] once  ·  [t] trust for this session  ·  [n] deny',
      ],
    },
    accept: ['^y$', '^yes$', '^t$', '^/tools\\s+trust(-all)?(\\s+[\\w]+)*$'],
    answer: { 'zh-Hant': 'y', en: 'y' },
    output: {
      'zh-Hant': ['✓ 已寫入 src/app.ts'],
      en: ['✓ Wrote src/app.ts'],
    },
    hints: {
      'zh-Hant': ['按 y 放行這一次', '或用 /tools trust write 讓這次對話都免問'],
      en: ['Press y to allow once', 'or use /tools trust write to stop being asked this session'],
    },
  },
  {
    id: 'resume',
    chapter: '06-sessions',
    title: { 'zh-Hant': '續接對話', en: 'Resume a session' },
    goal: {
      'zh-Hant': '昨天的對話想接著做。把這個資料夾最近一次叫回來。',
      en: "Pick up yesterday's conversation. Resume the latest session in this folder.",
    },
    preamble: {
      'zh-Hant': ['# 回到同一個專案資料夾,接續上次的對話'],
      en: ['# Back in the same project folder, continue last time'],
    },
    accept: [
      '^kiro-cli\\s+chat\\s+(--resume|-r|--resume-picker)$',
      '^kiro-cli\\s+chat\\s+--resume-id\\s+\\S+$',
    ],
    answer: { 'zh-Hant': 'kiro-cli chat --resume', en: 'kiro-cli chat --resume' },
    output: {
      'zh-Hant': ['Resuming: Implement auth (15 msgs)', 'Kiro CLI 2.6.1 — 已還原上次的對話。'],
      en: ['Resuming: Implement auth (15 msgs)', 'Kiro CLI 2.6.1 — restored your last session.'],
    },
    hints: {
      'zh-Hant': ['在 chat 後面加旗標', '--resume(或簡寫 -r)接最近一次'],
      en: ['Add a flag after chat', '--resume (or -r) for the latest one'],
    },
  },
  {
    id: 'subagent',
    chapter: '10-subagents',
    title: { 'zh-Hant': 'Subagent 平行工作流', en: 'Subagent parallel workflow' },
    goal: {
      'zh-Hant': '你在對話裡。叫 Kiro 同時「平行」處理多個互不相干的子任務。',
      en: "You're in the chat. Ask Kiro to handle several independent subtasks in parallel.",
    },
    preamble: {
      'zh-Hant': [
        'Kiro CLI 2.6.1 — 已就緒。輸入你的任務…',
        '# 訣竅:句子裡帶上「平行」或「同時」,Kiro 就會開 subagent 平行跑',
      ],
      en: [
        'Kiro CLI 2.6.1 — ready. Type your task…',
        '# Trick: say "in parallel" or "at the same time" and Kiro spins up subagents',
      ],
    },
    accept: [
      '^(?!kiro-cli)(?!/).*(平行|同時|並行|parallel|simultaneous|at the same time|at once|concurrently).*',
    ],
    answer: {
      'zh-Hant': '平行分析 auth、payment、search 的安全性,最後彙整成報告',
      en: 'analyze the security of auth, payment and search in parallel, then merge into a report',
    },
    output: {
      'zh-Hant': [
        '› 拆解任務 → 3 條互不相依的支線,平行開跑',
        '  ├─ auth     ▶ 規劃 › 掃描 › 完成 ✓',
        '  ├─ payment  ▶ 規劃 › 掃描 › 完成 ✓',
        '  └─ search   ▶ 規劃 › 掃描 › 完成 ✓',
        '› 彙整報告 … 完成 ✓',
      ],
      en: [
        '› split task → 3 independent branches, running in parallel',
        '  ├─ auth     ▶ plan › scan › done ✓',
        '  ├─ payment  ▶ plan › scan › done ✓',
        '  └─ search   ▶ plan › scan › done ✓',
        '› merge report … done ✓',
      ],
    },
    hints: {
      'zh-Hant': [
        '不用記特殊指令,用自然語言講,關鍵是說出「平行」或「同時」',
        '例如:平行分析 auth、payment、search 的安全性,再彙整成報告',
      ],
      en: [
        'No special command — use natural language; the key is to say "in parallel" or "at the same time"',
        'e.g., analyze the security of auth, payment and search in parallel, then merge into a report',
      ],
    },
  },
];
