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
- Категории, товары и планы не стирать из документа — мягкое удаление (`deletedAt`). Продажу удаляют насовсем. Правило — `.cursor/rules/soft-delete.mdc`.
- Интерфейс русский, в основном чёрно-белый, с боковым меню. Плотность и меню — в правиле интерфейса.
- После крупных правок запусти `npm run lint` и `npm run format` (Biome).
