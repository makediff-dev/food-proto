# Graph Report - food-proto  (2026-10-22)

## Corpus Check
- 156 files · ~93,209 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1471 nodes · 5391 edges · 60 communities (53 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edddae3f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- MaterialReceiptFormTable.tsx
- products.ts
- PlanningScreen.tsx
- mock-document.ts
- ProductionEntryFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- MovementPlanScreen.tsx
- compilerOptions
- index.ts
- MaterialsPlanScreen.tsx
- IconChevronDown
- SummaryScreen.tsx
- ProductionFactTable.tsx
- document.ts
- materials.ts
- monthKeyFromDate
- movementRow
- ProductionEntryScreen.tsx
- sales-fact.ts
- Флоу товара
- ProductionJournalScreen.tsx
- AppShell.tsx
- useDocumentStore
- SummaryTable.tsx
- PageFrame
- MaterialJournalScreen.tsx
- FinishedGoodsMonthTable.tsx
- MaterialsNormsScreen
- production-fact.ts
- DocumentProvider.tsx
- planMonthOpen
- ProductionJournalFactScreen.tsx
- sumRows
- production-plan.ts
- materials/text.ts
- Отчет общий сырья
- postcss.config.mjs
- sales-plan.ts
- Отчет общий движения
- layout.tsx
- MaterialsSummaryTable.tsx
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
- IconFullscreen

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `planMonthOpen()` - 56 edges
3. `PageFrame()` - 53 edges
4. `next` - 51 edges
5. `keepWithNext()` - 51 edges
6. `react` - 46 edges
7. `VatMoneyCell()` - 46 edges
8. `shiftMonth()` - 38 edges
9. `entityNameRowClassName()` - 38 edges
10. `TableNumber()` - 36 edges

## Surprising Connections (you probably didn't know these)
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Единицы` --references--> `costWithVat()`  [INFERRED]
  docs/architecture.md → src/domain/cost.ts
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Удаление` --references--> `finishedGoodsGridProducts()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (60 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (42): Единицы, PROFIT_TAX_PERCENT, factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, actualRangeSummary(), applyFactScale() (+34 more)

### Community 1 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.19
Nodes (16): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+8 more)

### Community 2 - "products.ts"
Cohesion: 0.10
Nodes (45): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+37 more)

### Community 3 - "PlanningScreen.tsx"
Cohesion: 0.18
Nodes (16): metadata, PlanningPage(), missingPlanProducts(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), AddCategoryDialog(), submit() (+8 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (27): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+19 more)

### Community 5 - "ProductionEntryFormTable.tsx"
Cohesion: 0.11
Nodes (33): buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormTotals, formatKopecks(), GridInput() (+25 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (29): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Движение готовой продукции (+21 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.08
Nodes (69): commitDocumentUpdate(), FinishedGoodsNormLine, FinishedGoodsOpeningLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups() (+61 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.05
Nodes (78): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+70 more)

### Community 11 - "MovementPlanScreen.tsx"
Cohesion: 0.17
Nodes (15): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), MovementPlanScreen(), resolveMonth(), Workspace(), open() (+7 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.10
Nodes (55): react, adjacentDay(), COLUMNS, ColumnKey, COLUMNS, COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+47 more)

### Community 14 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (28): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+20 more)

### Community 15 - "IconChevronDown"
Cohesion: 0.13
Nodes (23): ArrowButton(), CategoryBlock(), DayLabel(), dayOfMonth(), FinishedGoodsFactTable(), groupEndClass(), MetricCell(), ProductRow() (+15 more)

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.22
Nodes (22): activeCategories(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, planningHref(), productionFactHref(), productionFactPageTitle() (+14 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.17
Nodes (28): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+20 more)

### Community 18 - "document.ts"
Cohesion: 0.08
Nodes (28): defaultMax(), LineOverride, materialNorms, materialPlan(), materials, priceWithVat, q(), septemberPlanW1 (+20 more)

### Community 19 - "materials.ts"
Cohesion: 0.11
Nodes (44): MaterialReceiptLine, MaterialUnit, addMaterial(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine(), isMaterialGroupId() (+36 more)

### Community 20 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (38): metadata, MovementFactPage(), isOccurredOn(), defaultSaleDay(), defaultSalesFactDay(), monthDates(), maxSaleOccurredOn(), monthKeyFromDate() (+30 more)

### Community 21 - "movementRow"
Cohesion: 0.20
Nodes (16): costExVat(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), gridMaterials(), inventoryQuantityFor(), materialReceiptsList() (+8 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (73): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage() (+65 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.08
Nodes (42): Архитектура прототипа, Поток данных, Слои, Удаление, Чего не делать, unitCost, Product, averageAmount() (+34 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ProductionJournalScreen.tsx"
Cohesion: 0.15
Nodes (21): metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), productionEntryPieces(), workingProductionEntriesInMonth() (+13 more)

### Community 26 - "AppShell.tsx"
Cohesion: 0.15
Nodes (18): MOVEMENT_SECTION_TITLE, PRODUCTION_FACT_TITLE, PRODUCTION_SECTION_TITLE, PRODUCTION_SUMMARY_TITLE, SALES_SECTION_TITLE, currentNavLabel(), MATERIALS_NAV, MOVEMENT_NAV (+10 more)

### Community 27 - "useDocumentStore"
Cohesion: 0.27
Nodes (13): metadata, MovementPage(), useDocumentStore(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle() (+5 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.09
Nodes (51): costWithVat(), MaterialsPlanTable(), PlanCell(), planColumnKind(), PlanTotal(), RowCell(), Pieces(), RowCell() (+43 more)

### Community 29 - "PageFrame"
Cohesion: 0.16
Nodes (14): nextConfig, next, Home(), metadata, metadata, PlanPage(), metadata, QuestionsPage() (+6 more)

### Community 30 - "MaterialJournalScreen.tsx"
Cohesion: 0.48
Nodes (6): MATERIAL_WAREHOUSES, materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref(), formatProductionEntryDate()

### Community 31 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (42): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_GROUPS (+34 more)

### Community 32 - "MaterialsNormsScreen"
Cohesion: 0.22
Nodes (9): MaterialsNormsPage(), metadata, liveNorms(), materialConsumptionIsNormed(), materialNormQuantity(), materialNormsList(), referencedMaterialIds(), MaterialsNormsScreen() (+1 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.17
Nodes (27): amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts() (+19 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.18
Nodes (16): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+8 more)

### Community 35 - "planMonthOpen"
Cohesion: 0.17
Nodes (20): missingProductionPlanProducts(), activeProducts(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), MaterialMonthBar(), InventoryScreen(), resolveMonth() (+12 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.16
Nodes (17): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), productionJournalFactHref(), ProductionJournalFactView, DayDateControl() (+9 more)

### Community 37 - "sumRows"
Cohesion: 0.67
Nodes (4): addMoney(), addMoneyNullable(), emptyTotals(), sumRows()

### Community 39 - "production-plan.ts"
Cohesion: 0.15
Nodes (25): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+17 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.18
Nodes (10): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR (+2 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 46 - "sales-plan.ts"
Cohesion: 0.15
Nodes (25): SalesPlan, SalesPlanLine, amountWithVat(), percentHundredths(), ratioRound(), vatPercentHundredths(), activeSalesPlans(), addSalesPlan() (+17 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "layout.tsx"
Cohesion: 0.20
Nodes (6): metadata, onest, RootLayout(), unbounded, AppShell(), MockReset()

### Community 49 - "MaterialsSummaryTable.tsx"
Cohesion: 0.10
Nodes (29): Подсказки заголовков таблицы, MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+21 more)

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

### Community 63 - "IconFullscreen"
Cohesion: 0.33
Nodes (11): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+3 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 337 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `index.ts` to `MaterialReceiptFormTable.tsx`, `products.ts`, `PlanningScreen.tsx`, `ProductionEntryFormTable.tsx`, `package.json`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `MaterialsPlanScreen.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `monthKeyFromDate`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `AppShell.tsx`, `useDocumentStore`, `SummaryTable.tsx`, `PageFrame`, `MaterialJournalScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `DocumentProvider.tsx`, `planMonthOpen`, `ProductionJournalFactScreen.tsx`, `MaterialsSummaryTable.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11205073995771671 - nodes in this community are weakly interconnected._
- **Why does `next` connect `PageFrame` to `MaterialsNormsScreen`, `products.ts`, `PlanningScreen.tsx`, `ProductionJournalFactScreen.tsx`, `planMonthOpen`, `package.json`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `MaterialsPlanScreen.tsx`, `layout.tsx`, `SummaryScreen.tsx`, `monthKeyFromDate`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `AppShell.tsx`, `useDocumentStore`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10196078431372549 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `production-plan.ts`, `Ввод плана (производство)`, `sales-fact.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `mock-document.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06653225806451613 - nodes in this community are weakly interconnected._