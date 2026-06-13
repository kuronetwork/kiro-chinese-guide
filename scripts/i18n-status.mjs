#!/usr/bin/env node
// ============================================================
// i18n 翻譯狀態檢查
//
// 中文(src/content/docs/*.mdx)是真實來源,英文鏡像放在
// src/content/docs/en/。這支腳本告訴你(以及 AI)哪些英文:
//   - 還沒翻(MISSING)
//   - 中文比英文新,可能過期了(STALE)
//
// 用法:  node scripts/i18n-status.mjs   或   npm run i18n:status
// 時間判斷優先用 git 最後 commit 時間,沒有就用檔案 mtime。
// ============================================================

import { readdirSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DOCS = join(ROOT, 'src', 'content', 'docs');
const EN = join(DOCS, 'en');

/** 遞迴列出某資料夾下的 .md/.mdx 檔(回傳絕對路徑) */
function listDocs(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listDocs(full));
    else if (/\.(md|mdx)$/.test(name)) out.push(full);
  }
  return out;
}

/** 取得檔案的最後修改時間(秒);優先 git commit 時間,退回檔案 mtime */
function lastModified(absPath) {
  try {
    const rel = relative(ROOT, absPath);
    const ts = execSync(`git log -1 --format=%ct -- "${rel}"`, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (ts) return parseInt(ts, 10);
  } catch {
    /* git 不可用就往下走 */
  }
  return Math.floor(statSync(absPath).mtimeMs / 1000);
}

// 中文來源:docs 底下、但不在 en/ 的所有檔
const zhFiles = listDocs(DOCS).filter((p) => !p.startsWith(EN + '/') && p !== EN);

const missing = [];
const stale = [];
const ok = [];

for (const zh of zhFiles) {
  const key = relative(DOCS, zh); // 例如 01-intro.mdx
  const en = join(EN, key);
  if (!existsSync(en)) {
    missing.push(key);
    continue;
  }
  const zhT = lastModified(zh);
  const enT = lastModified(en);
  if (zhT > enT) stale.push({ key, zhT, enT });
  else ok.push(key);
}

const fmt = (s) => new Date(s * 1000).toISOString().slice(0, 10);

console.log('\n=== Kiro CLI guide · i18n 翻譯狀態 ===\n');
console.log(`中文文章: ${zhFiles.length}  |  已翻譯: ${ok.length}  |  缺翻譯: ${missing.length}  |  可能過期: ${stale.length}\n`);

if (missing.length) {
  console.log('🟥 MISSING(還沒翻成英文):');
  for (const k of missing) console.log(`   - ${k}  →  en/${k}`);
  console.log('');
}
if (stale.length) {
  console.log('🟧 STALE(中文比英文新,建議重翻):');
  for (const s of stale) console.log(`   - ${s.key}   zh:${fmt(s.zhT)} > en:${fmt(s.enT)}`);
  console.log('');
}
if (!missing.length && !stale.length) {
  console.log('✅ 所有英文翻譯都是最新的。\n');
}

// 有缺漏或過期時用非零結束碼,方便接 CI
process.exit(missing.length || stale.length ? 1 : 0);
