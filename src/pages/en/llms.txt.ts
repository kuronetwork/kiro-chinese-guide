import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { localeOf } from '../../i18n/ui';

const SITE = 'https://kiro.kuronetwork.me';

export const GET: APIRoute = async () => {
  const docs = (await getCollection('docs'))
    .filter((d) => localeOf(d.id) === 'en')
    .sort((a, b) => a.data.order - b.data.order);

  const groups: { label: string; items: typeof docs }[] = [];
  for (const d of docs) {
    let g = groups.find((x) => x.label === d.data.section);
    if (!g) { g = { label: d.data.section, items: [] }; groups.push(g); }
    g.items.push(d);
  }

  let out = '# Kiro CLI Guide (English)\n\n';
  out += '> A community-curated tutorial for Amazon Kiro CLI, from your first chat all the way to multi-project automation. Every section includes copy-paste-ready examples. For Kiro CLI 2.6.1.\n\n';
  out += 'Unofficial community tutorial for learning purposes — always defer to the official docs (https://kiro.dev/docs/cli/) and `kiro-cli --help`.\n\n';
  out += 'Chinese / 繁體中文: ' + SITE + '/llms.txt\n\n';

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
