import type { SidebarItem } from '../types';

/**
 * Astro.url 在部署到子目錄（astro.config 的 base）時，pathname 可能已經含 base，
 * 為避免比對-currentPath-時出現「有時有 base 有時沒有」的問題，這裡一律先去掉前綴。
 */
function stripBase(path: string, base: string): string {
  const b = base.replace(/\/+$/, '');
  if (!b) return path;
  const lower = path.toLowerCase();
  const baseLower = b.toLowerCase();
  if (lower === baseLower) return '/';
  if (lower.startsWith(`${baseLower}/`)) return path.slice(b.length) || '/';
  return path;
}

/**
 * 取得可用於比對的站內路徑：去掉 origin、query、hash、base、index.html、副檔名與多餘斜桿。
 * 範例：/trpg-database-collection/kamigakari/docs/core_world_about/ -> /kamigakari/docs/core_world_about
 */
export function normalizePath(raw: string | null | undefined, base = ''): string {
  if (raw === null || raw === undefined) return '/';
  let path = String(raw).trim();
  if (!path) return '/';
  // 完整 URL（含 protocol）或 protocol-relative URL，只取 path 部分
  const origin = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^/]*|^\/\//.exec(path);
  if (origin) path = path.slice(origin[0].length) || '/';
  path = path.split('#')[0].split('?')[0];
  try {
    path = decodeURIComponent(path);
  } catch {
    // 非法 percent 編碼（例如手寫連結殘留 %），保留原始字串即可
  }
  path = stripBase(path, base);
  path = path.replace(/index\.html$/i, '').replace(/\.html?$/i, '').replace(/\.md$/i, '');
  return `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

/** 外部連結、mailto、純錨點等，不應再加上 base 與 game 前綴 */
export function isExternalLink(link: string): boolean {
  return /^(?:[a-zA-Z][a-zA-Z\d+\-.]*:)?\/\//.test(link) || /^(?:mailto:|tel:|javascript:|#)/i.test(link);
}

/** 由 game 與 config.json 的 link 組出規格化路徑（不含 base），逗號無多餘斜桿 */
function itemPath(game: string | undefined, link: string | undefined): string {
  const segments = [game ?? '', link ?? '']
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value.replace(/^\/+/, '').replace(/\/+$/, ''))
    .filter(Boolean);
  return normalizePath(`/${segments.join('/')}`);
}

/** 給 <a href> 用的最終站內 URL（會補上 base） */
export function gameHref(game: string | undefined, link: string | undefined, base = ''): string {
  const raw = (link ?? '').trim();
  if (!raw) return '#';
  if (isExternalLink(raw)) return raw;
  return `${base.replace(/\/+$/, '')}${itemPath(game, raw)}`;
}

/** 該節點是否就是目前頁面（currentPath 必須是已 normalizePath 過、不含 base 的路徑） */
export function isCurrentLink(
  link: string | undefined,
  game: string | undefined,
  currentPath: string,
): boolean {
  const raw = (link ?? '').trim();
  if (!raw || isExternalLink(raw)) return false;
  return itemPath(game, raw) === currentPath;
}

/** 子孫中是否有目前頁面 —— used by 自動展開目前頁面所在的資料夾鏈 */
export function hasCurrentDescendant(
  members: SidebarItem[] | undefined,
  game: string | undefined,
  currentPath: string,
): boolean {
  return (members ?? []).some(
    (member) => isCurrentLink(member.link, game, currentPath) || hasCurrentDescendant(member.members, game, currentPath),
  );
}
