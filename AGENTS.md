<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Прототип учёта

Перед задачей прочитай `docs/domain.md`, затем `docs/architecture.md` и `docs/extending-the-prototype.md`.

- Только клиент. Учётные числа живут в `localStorage`, формулы — в `src/domain`.
- Первый прототип — доходы и себестоимость продукции. Граница и формулы — в `docs/domain.md`. Книга клиента — `inputs/finplan-february.xlsx`.
- Тестовый экран «Учёт» и поле `probe` удалены. Не возвращать.
- Категории, товары и планы не стирать из документа — мягкое удаление (`deletedAt`). Продажу и запись выпуска удаляют насовсем. Правило — `.cursor/rules/soft-delete.mdc`.
- Интерфейс русский, в основном чёрно-белый, с боковым меню. Плотность и меню — в правиле интерфейса.
- После крупных правок запусти `npm run lint` и `npm run format` (Biome).

## Cursor Cloud specific instructions

- `portless` в `npm run dev` требует Node.js 24. Бинарник среды — `/opt/node-v24/bin`; его нужно ставить первым в `PATH`. Образ по умолчанию даёт Node 22, и с ним `portless` не стартует.
- `npm ci` на текущем lockfile не проходит: нет необязательных `@emnapi/core` и `@emnapi/runtime`. Ставить зависимости так: `npm install`, затем вернуть `package-lock.json` из git.
- Без TTY прокси не занимает 443. Скрипт старта поднимает HTTP-прокси на порту 1355. Приложение: http://food-proto.localhost:1355
- Серверного учёта нет: числа живут в `localStorage`. Проверка — `npm run lint` и `npm run build`. Отдельного тест-раннера нет.
