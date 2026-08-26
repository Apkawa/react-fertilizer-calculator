// Одноразовый инструмент миграции yarn → pnpm.
// Читает yarn.lock (v1) и генерирует pnpm.overrides, фиксирующие все
// range-спецификаторы на точные резолвинутые версии, чтобы `pnpm install`
// дал то же дерево зависимостей, что было в yarn.lock, без обновления версий.
//
// Использование: node tools/yarnlock2overrides.js yarn.lock /path/to/out.json
const fs = require('fs');

const lockText = fs.readFileSync(process.argv[2], 'utf8');

const overrides = {};
const lines = lockText.split('\n');
let pendingKeys = null;

for (const line of lines) {
  // Ключ на нулевом уровне индентации, заканчивается на ':'
  // (может содержать несколько спецификаторов: `"a@^1", "a@^2":`)
  if (!line.startsWith(' ') && line.endsWith(':')) {
    pendingKeys = line
      .replace(/:$/, '')
      .split(', ')
      .map(k => k.replace(/^"|"$/g, ''));
    continue;
  }
  if (pendingKeys && line.startsWith('  ') && line.includes('version')) {
    const v = line.match(/^\s+version "?([^"]+)"?$/);
    if (v) {
      for (const k of pendingKeys) {
        overrides[k] = v[1];
      }
      pendingKeys = null;
    }
  }
}

console.log(`parsed ${Object.keys(overrides).length} entries`);
fs.writeFileSync(process.argv[3], JSON.stringify(overrides, null, 2));
