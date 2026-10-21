# Graph Report - food-proto  (2026-10-21)

## Corpus Check
- 155 files · ~92,045 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1435 nodes · 5246 edges · 65 communities (56 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e64f1075`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- MaterialReceiptFormTable.tsx
- products.ts
- AppShell.tsx
- mock-document.ts
- MovementPlanTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- MovementPlanScreen.tsx
- compilerOptions
- index.ts
- PageFrame
- FinishedGoodsMonthTable.tsx
- DocumentProvider.tsx
- ProductionFactTable.tsx
- mock-materials.ts
- use-materials.ts
- PlanningScreen.tsx
- materials.ts
- ProductionEntryScreen.tsx
- production-journal-fact.ts
- Флоу товара
- SummaryTable.tsx
- sales-fact.ts
- FinishedGoodsMonthScreen.tsx
- MaterialsSummaryTable.tsx
- movement-plan.ts
- MaterialDocumentScreen.tsx
- monthKeyFromDate
- Архитектура прототипа
- production-fact.ts
- production-journal.ts
- production/paths.ts
- ProductionJournalFactScreen.tsx
- MaterialsNormsScreen.tsx
- production-plan.ts
- materials/text.ts
- Icons.tsx
- Отчет общий сырья
- document.ts
- postcss.config.mjs
- sales-plan.ts
- SalesFactScreen.tsx
- Отчет общий движения
- MaterialJournalScreen.tsx
- ColumnLabel
- Инвентаризация
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- Отчет подневный производства
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- AGENTS.md
- ProductionPlan
- SalesPlan

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `planMonthOpen()` - 56 edges
3. `PageFrame()` - 53 edges
4. `next` - 51 edges
5. `keepWithNext()` - 51 edges
6. `react` - 45 edges
7. `VatMoneyCell()` - 45 edges
8. `shiftMonth()` - 38 edges
9. `TableNumber()` - 36 edges
10. `useSales()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Единицы` --references--> `costWithVat()`  [INFERRED]
  docs/architecture.md → src/domain/cost.ts
- `Удаление` --references--> `finishedGoodsGridProducts()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Единицы` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (65 total, 9 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.05
Nodes (93): Home(), metadata, metadata, PlanPage(), actualRangeProductionFact(), productionFactForLens(), rangeProductionFact(), planPhase (+85 more)

### Community 1 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (48): ProductCategory, buildGroups(), ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+40 more)

### Community 2 - "products.ts"
Cohesion: 0.12
Nodes (41): commitDocumentUpdate(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey() (+33 more)

### Community 3 - "AppShell.tsx"
Cohesion: 0.12
Nodes (20): metadata, onest, RootLayout(), unbounded, MOVEMENT_SECTION_TITLE, PRODUCTION_SECTION_TITLE, AppShell(), currentNavLabel() (+12 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.08
Nodes (22): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+14 more)

### Community 5 - "MovementPlanTable.tsx"
Cohesion: 0.10
Nodes (33): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, GroupBlock(), MaterialRow(), CategoryBlock(), FinishedGoodsFactTable(), groupEndClass() (+25 more)

### Community 6 - "Предметная область"
Cohesion: 0.10
Nodes (21): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство), Отчет подневный (производство) (+13 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.13
Nodes (43): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+35 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (69): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+61 more)

### Community 11 - "MovementPlanScreen.tsx"
Cohesion: 0.09
Nodes (33): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), useDocumentStore(), activeCategories() (+25 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.13
Nodes (46): adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, ColumnKey, COLUMNS, DayLabel(), dayOfMonth() (+38 more)

### Community 14 - "PageFrame"
Cohesion: 0.12
Nodes (27): nextConfig, next, react, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage() (+19 more)

### Community 15 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.18
Nodes (24): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MetricCell(), CategoryBlock(), COLUMN_GROUPS, ColumnKey, COLUMNS (+16 more)

### Community 16 - "DocumentProvider.tsx"
Cohesion: 0.23
Nodes (13): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+5 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (17): defaultMax(), LineOverride, materialNorms, materialPlan(), materials, mockMaterials, priceWithVat, q() (+9 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.22
Nodes (21): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isVatPercent(), materialById(), materialNameRejection (+13 more)

### Community 20 - "PlanningScreen.tsx"
Cohesion: 0.11
Nodes (28): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+20 more)

### Community 21 - "materials.ts"
Cohesion: 0.09
Nodes (40): MaterialGroupId, MaterialReceiptLine, addMoney(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials(), emptyPlanLine() (+32 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.13
Nodes (26): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), productionEntryByIdOrNull(), ProductionEntryRejection, productionLineAmountWithVat(), NEW_PRODUCTION_ENTRY_TITLE (+18 more)

### Community 23 - "production-journal-fact.ts"
Cohesion: 0.12
Nodes (25): Удаление, Product, PrototypeDocument, dayGridProducts(), periodGridProducts(), periodReferencedProductIds(), productionFactGridProducts(), dayTotals() (+17 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.14
Nodes (38): TotalCell(), ProductUnitPrice(), RowCell(), TotalCell(), ProductionPlanTable(), TotalsCell(), AverageCost(), Pieces() (+30 more)

### Community 26 - "sales-fact.ts"
Cohesion: 0.19
Nodes (22): costExVat(), costWithVat(), unitCost, amountExVat(), amountWithVat(), averageAmount(), percentHundredths(), ratioRound() (+14 more)

### Community 27 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 28 - "MaterialsSummaryTable.tsx"
Cohesion: 0.16
Nodes (24): MaterialUnit, MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), ColumnKey, COLUMNS, MaterialsPlanTable() (+16 more)

### Community 29 - "movement-plan.ts"
Cohesion: 0.20
Nodes (18): FinishedGoodsNormLine, emptyNormLine(), emptyTotals(), FinishedGoodsNormRejection, finishedGoodsNormsList(), isNormPieces(), movementPlanGridProducts(), movementPlanMetrics() (+10 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.15
Nodes (22): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), materialReceiptRejection(), occurredOnOpen(), maxProductionEntryOccurredOn() (+14 more)

### Community 31 - "monthKeyFromDate"
Cohesion: 0.17
Nodes (26): productionEntryPieces(), workingProductionEntriesInMonth(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), saleTotals, workingSalesInMonth(), lastHorizonMonth() (+18 more)

### Community 32 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.16
Nodes (24): applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+16 more)

### Community 34 - "production-journal.ts"
Cohesion: 0.29
Nodes (15): isOccurredOn(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), defaultProductionEntryDay(), deleteProductionEntry(), entryById(), isLinePrice() (+7 more)

### Community 35 - "production/paths.ts"
Cohesion: 0.15
Nodes (17): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+9 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.20
Nodes (14): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), ProductionJournalFactView, DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth() (+6 more)

### Community 37 - "MaterialsNormsScreen.tsx"
Cohesion: 0.33
Nodes (8): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, activeMaterials(), materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 39 - "production-plan.ts"
Cohesion: 0.16
Nodes (23): Единицы, plannedProductionVolumePieces(), targetClosingPiecesFromNorm(), activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+15 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.20
Nodes (9): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NORM_ERROR (+1 more)

### Community 41 - "Icons.tsx"
Cohesion: 0.14
Nodes (24): DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS (+16 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "document.ts"
Cohesion: 0.11
Nodes (19): LEGACY_OPENING_SCHEMA, catalogCategories(), DeletableRecord, FinishedGoodsNorm, FinishedGoodsOpening, FinishedGoodsOpeningLine, Material, MATERIAL_GROUPS (+11 more)

### Community 45 - "sales-plan.ts"
Cohesion: 0.20
Nodes (19): productSide(), productionPlanLineMetrics, activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), isPrice(), isVolume() (+11 more)

### Community 46 - "SalesFactScreen.tsx"
Cohesion: 0.22
Nodes (15): defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+7 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "MaterialJournalScreen.tsx"
Cohesion: 0.21
Nodes (13): metadata, MATERIAL_WAREHOUSES, materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref(), MATERIALS_RECEIPTS_TITLE, MATERIALS_SECTION_TITLE (+5 more)

### Community 49 - "ColumnLabel"
Cohesion: 0.27
Nodes (9): Подсказки заголовков таблицы, FinishedGoodsReportColumnHeaders(), SUB_BANNER_GROUPS, SUB_BANNER_KEYS, subBannerGroupForKey(), subBannerLastKey(), InventoryTable(), ColumnLabel() (+1 more)

### Community 50 - "Инвентаризация"
Cohesion: 0.67
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 51 - "Ввод плана движения"
Cohesion: 0.67
Nodes (3): Ввод плана движения, Колонки, Что пишется

### Community 52 - "Ввод факта (производство)"
Cohesion: 0.67
Nodes (3): Ввод факта (производство), Сетка записи, Список

### Community 53 - "Ввод плана (производство)"
Cohesion: 0.67
Nodes (3): Ввод плана (производство), Колонки строки товара, Что пишется

### Community 54 - "Ввод факта (продажи)"
Cohesion: 0.67
Nodes (3): Ввод факта (продажи), Сетка записи, Список

### Community 55 - "Ввод плана (продажи)"
Cohesion: 0.67
Nodes (3): Ввод плана (продажи), Колонки строки товара, Что пишется

### Community 56 - "Отчет общий продаж"
Cohesion: 0.67
Nodes (3): Верхний блок, Отчет общий продаж, Сетка

### Community 62 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 319 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `PageFrame` to `summary.ts`, `AppShell.tsx`, `production/paths.ts`, `MaterialsNormsScreen.tsx`, `ProductionJournalFactScreen.tsx`, `package.json`, `Icons.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `SalesFactScreen.tsx`, `MaterialJournalScreen.tsx`, `PlanningScreen.tsx`, `ProductionEntryScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `MaterialDocumentScreen.tsx`, `monthKeyFromDate`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05054945054945055 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `summary.ts`, `MaterialReceiptFormTable.tsx`, `AppShell.tsx`, `MovementPlanTable.tsx`, `package.json`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `index.ts`, `FinishedGoodsMonthTable.tsx`, `DocumentProvider.tsx`, `ProductionFactTable.tsx`, `PlanningScreen.tsx`, `ProductionEntryScreen.tsx`, `SummaryTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `MaterialsSummaryTable.tsx`, `MaterialDocumentScreen.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `Icons.tsx`, `SalesFactScreen.tsx`, `MaterialJournalScreen.tsx`, `ColumnLabel`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `MaterialReceiptFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07832080200501253 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `production-plan.ts` to `production-fact.ts`, `sales-plan.ts`, `Ввод плана (производство)`, `finished-goods.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1178743961352657 - nodes in this community are weakly interconnected._