
import type { ConfigItem } from "../types"; 

export function getConfig(game: string): (ConfigItem | null) {
  try {
    const configs:Record<string, ConfigItem> = import.meta.glob('../collections/**/config.json', { eager: true });
    const path = Object.keys(configs).find(p => p.includes(`/${game}/`));
    if (path) {
      const config:ConfigItem = {
        key: game,
        path: path,
        title: configs[path].title,
        sidebar: configs[path].sidebar,
      };
      return config;
    }
  } catch(e) { console.error(e) }
  return null;
}

export function getConfigColle(): Array<ConfigItem> {
  const arr:Array<ConfigItem> = [];
  try {
    const configs:Record<string, ConfigItem> = import.meta.glob('../collections/**/config.json', { eager: true });
    for (const path in configs) {
      const parts = path.split('/');
      const game = parts[parts.length - 2];
      arr.push({
        key: game,
        path: path,
        title: configs[path].title,
        sidebar: configs[path].sidebar,
      });
    }
  } catch(e) { console.error(e) }
  
  return arr;
}