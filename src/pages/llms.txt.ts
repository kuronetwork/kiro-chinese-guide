import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://kiro.kuronetwork.me';

export const GET: APIRoute = async () => {
  const docs = (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);

  const groups: { label: string; items: typeof docs }[] = [];
  for (const d of docs) {
    let g = groups.find((x) => x.label === d.data.section);
    if (!g) { g = { label: d.data.section, items: [] }; groups.push(g); }
    g.items.push(d);
  }

  let out = '# Kiro CLI 繁體中文教學\n\n';
  out += '> 用台灣繁體中文整理的 Amazon Kiro CLI 教學,從第一次對話一路到多專案自動化,每段都附可直接複製的範例。對應 Kiro CLI 2.6.1。\n\n';
  out += '本站為非官方社群教學,內容經整理並翻譯為中文輔助學習,請以官方文件(https://kiro.dev/docs/cli/)與 `kiro-cli --help` 為準。\n\n';

  for (const g of groups) {
    out += `## ${g.label}\n`;
    for (const it of g.items) {
      out += `- [${it.data.title}](${SITE}/${it.id}/): ${it.data.description}\n`;
    }
    out += '\n';
  }

  return new Response(out, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
