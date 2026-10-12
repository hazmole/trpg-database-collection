import type { MarkdownHeading } from 'astro';

export interface SidebarItem {
  title: string;
  link?: string;
  members?: SidebarItem[];
}

export type ConfigColle  = Record<string, ConfigItem>

export interface ConfigItem {
  title: string;
  sidebar: any;
  default: ConfigItem;
}

export type MdColle = Record<string, MdItem>

export interface MdItem {
  Content: string;
  frontmatter: MarkdownFrontmatter;
  url?: string;
  /** Astro 提供：本頁 h1~h6 標題清單（含 slug = 標題 id），供 TOC 使用 */
  getHeadings?: () => MarkdownHeading[];
}

export interface MarkdownFrontmatter {
  title: string;
  description?: string;
  [key: string]: any; // 允許其他自訂屬性
}

/** config.json 中會傳給 GameLayout / SidebarMenu 使用的欄位 */
export interface GameConfig {
  title?: string;
  sidebar?: SidebarItem[];
  [key: string]: unknown;
}