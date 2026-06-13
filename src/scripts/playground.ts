// ============================================================
// 互動練習場 · 引擎(純前端,vanilla TS)
//
// 重點:這是「模擬」終端 —— 完全不執行任何真實指令,只比對字串
// 並播放預錄好的輸出動畫。零風險。
// ============================================================

import { levels, type Level } from '../games/levels';

type Locale = 'zh-Hant' | 'en';

interface Strings {
  level: string; of: string; goalLabel: string;
  hint: string; showAnswer: string; skip: string; next: string;
  placeholder: string; correct: string; wrong: string; answerLabel: string;
  backToChapter: string; safety: string; reset: string;
  doneTitle: string; doneBody: string; doneCta: string; doneRestart: string;
}

const LS_KEY = 'kiro-playground-v1';

export function initPlayground(): void {
  const root = document.getElementById('pg');
  if (!root) return;

  const locale = (root.dataset.locale as Locale) || 'zh-Hant';
  const base = (root.dataset.base || '').replace(/\/$/, '');
  const strings = JSON.parse(
    document.getElementById('pg-strings')?.textContent || '{}'
  ) as Strings;

  const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
    document.getElementById(id) as T;

  const elLevelNo = $('pgLevelNo');
  const elDots = $('pgDots');
  const elGoal = $('pgGoal');
  const elBody = $('pgBody');
  const elForm = $<HTMLFormElement>('pgForm');
  const elInput = $<HTMLInputElement>('pgInput');
  const elMsg = $('pgMsg');
  const elHint = $<HTMLButtonElement>('pgHint');
  const elAnswer = $<HTMLButtonElement>('pgAnswer');
  const elSkip = $<HTMLButtonElement>('pgSkip');
  const elNext = $<HTMLButtonElement>('pgNext');
  const elChapter = $<HTMLAnchorElement>('pgChapter');
  const elReset = $<HTMLButtonElement>('pgReset');
  const elDone = $('pgDone');
  const elDoneCta = $<HTMLAnchorElement>('pgDoneCta');
  const elRestart = $<HTMLButtonElement>('pgRestart');
  const elGame = $('pgGame');

  const total = levels.length;
  let index = 0;
  let busy = false;
  let hintIndex = 0;
  let wrongCount = 0;
  let completed = new Set<string>();

  // ---- 進度持久化 ----
  function load(): number {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      if (Array.isArray(raw.completed)) completed = new Set(raw.completed);
      return typeof raw.index === 'number' ? raw.index : 0;
    } catch {
      return 0;
    }
  }
  function save() {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ completed: [...completed], index })
      );
    } catch { /* 隱私模式等情況忽略 */ }
  }

  // ---- 終端輸出 ----
  function lineClass(text: string): string {
    if (text.startsWith('#')) return 'pg-ln pg-comment';
    if (text.startsWith('❯')) return 'pg-ln pg-echo';
    if (/[✓]/.test(text)) return 'pg-ln pg-ok';
    if (text.startsWith('›') || /[├└│▶]/.test(text)) return 'pg-ln pg-step';
    return 'pg-ln';
  }
  function appendLine(text: string) {
    const div = document.createElement('div');
    div.className = lineClass(text);
    div.textContent = text === '' ? '\u00a0' : text;
    elBody.appendChild(div);
    elBody.scrollTop = elBody.scrollHeight;
  }
  function typeLines(lines: string[], delay = 90): Promise<void> {
    return new Promise((resolve) => {
      let i = 0;
      const step = () => {
        if (i >= lines.length) return resolve();
        appendLine(lines[i++]);
        setTimeout(step, delay);
      };
      step();
    });
  }

  function normalize(s: string): string {
    return s.trim().replace(/\s+/g, ' ');
  }
  function matches(level: Level, input: string): boolean {
    const v = normalize(input);
    return level.accept.some((p) => {
      try { return new RegExp(p, 'i').test(v); } catch { return false; }
    });
  }

  // ---- 畫面渲染 ----
  function renderDots() {
    elDots.innerHTML = '';
    levels.forEach((lv, i) => {
      const dot = document.createElement('span');
      dot.className =
        'pg-dot' +
        (completed.has(lv.id) ? ' is-done' : '') +
        (i === index ? ' is-current' : '');
      dot.title = lv.title[locale];
      elDots.appendChild(dot);
    });
  }

  async function renderLevel(i: number) {
    if (i >= total) { showDone(); return; }
    index = i;
    busy = true;
    hintIndex = 0;
    wrongCount = 0;
    const lv = levels[i];

    elLevelNo.textContent = `${strings.level} ${i + 1} ${strings.of} ${total}`;
    renderDots();
    elGoal.innerHTML = `<span class="pg-goal-label">${strings.goalLabel}</span> ${escapeHtml(lv.title[locale])} — ${escapeHtml(lv.goal[locale])}`;

    elBody.innerHTML = '';
    elMsg.textContent = '';
    elMsg.className = 'pg-msg';
    elInput.value = '';
    elInput.placeholder = strings.placeholder;
    elInput.disabled = true;

    const chHref = `${base}${locale === 'en' ? '/en/' : '/'}${lv.chapter}/`;
    elChapter.href = chHref;
    elChapter.textContent = strings.backToChapter;

    // 已過關的關卡:Next 直接可用,方便往前往後走
    elNext.disabled = !completed.has(lv.id);

    await typeLines(lv.preamble[locale], 80);
    busy = false;
    elInput.disabled = false;
    elInput.focus();
    save();
  }

  async function onSubmit(e: Event) {
    e.preventDefault();
    if (busy || elInput.disabled) return;
    const raw = elInput.value;
    if (normalize(raw) === '') return;
    const lv = levels[index];

    if (matches(lv, raw)) {
      busy = true;
      elInput.disabled = true;
      appendLine(`❯ ${raw}`);
      elInput.value = '';
      await typeLines(lv.output[locale], 90);
      completed.add(lv.id);
      save();
      renderDots();
      elMsg.textContent = strings.correct;
      elMsg.className = 'pg-msg is-ok';
      elNext.disabled = false;
      elNext.focus();
      busy = false;
    } else {
      wrongCount++;
      elMsg.textContent = strings.wrong;
      elMsg.className = 'pg-msg is-wrong';
      // 連錯兩次,把提示推到眼前
      if (wrongCount >= 2) showHint();
    }
  }

  function showHint() {
    const lv = levels[index];
    const hints = lv.hints[locale];
    const h = hints[Math.min(hintIndex, hints.length - 1)];
    hintIndex = Math.min(hintIndex + 1, hints.length - 1);
    elMsg.textContent = `💡 ${h}`;
    elMsg.className = 'pg-msg is-hint';
  }

  function showAnswer() {
    const lv = levels[index];
    if (elInput.disabled) return;
    elInput.value = lv.answer[locale];
    elInput.focus();
    const len = elInput.value.length;
    elInput.setSelectionRange(len, len);
    elMsg.textContent = strings.answerLabel;
    elMsg.className = 'pg-msg is-hint';
  }

  function showDone() {
    elGame.hidden = true;
    elDone.hidden = false;
    elDoneCta.href = `${base}${locale === 'en' ? '/en/' : '/'}15-cookbook/`;
    elDone.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function escapeHtml(s: string): string {
    return s.replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string)
    );
  }

  // ---- 事件 ----
  elForm.addEventListener('submit', onSubmit);
  elHint.addEventListener('click', showHint);
  elAnswer.addEventListener('click', showAnswer);
  elSkip.addEventListener('click', () => renderLevel(index + 1));
  elNext.addEventListener('click', () => renderLevel(index + 1));
  elReset.addEventListener('click', () => {
    completed = new Set();
    index = 0;
    save();
    renderLevel(0);
  });
  elRestart.addEventListener('click', () => {
    completed = new Set();
    index = 0;
    save();
    elDone.hidden = true;
    elGame.hidden = false;
    renderLevel(0);
  });

  // ---- 啟動:?level= 深連結優先,其次存檔進度 ----
  const saved = load();
  const params = new URLSearchParams(location.search);
  const wanted = params.get('level');
  const deepIndex = wanted ? levels.findIndex((l) => l.id === wanted) : -1;
  const startIndex =
    deepIndex >= 0 ? deepIndex : Math.min(Math.max(saved, 0), total - 1);
  renderLevel(startIndex);
}
