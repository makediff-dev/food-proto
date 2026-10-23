# Graph Report - food-proto  (2026-10-23)

## Corpus Check
- 162 files · ~94,573 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1508 nodes · 5507 edges · 71 communities (63 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e4913866`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionPlanScreen.tsx
- products.ts
- PlanningScreen.tsx
- mock-document.ts
- MaterialReceiptFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- AppShell.tsx
- compilerOptions
- index.ts
- MaterialsPlanScreen.tsx
- SummaryHeadlineTable.tsx
- SummaryScreen.tsx
- ProductionFactTable.tsx
- mock-materials.ts
- use-materials.ts
- sales-fact.ts
- materials.ts
- ProductionEntryScreen.tsx
- production-journal-fact.ts
- Флоу товара
- PageFrame
- movement/paths.ts
- layout.tsx
- SummaryTable.tsx
- next
- MaterialDocumentScreen.tsx
- FinishedGoodsMonthTable.tsx
- Icons.tsx
- production-fact.ts
- DocumentProvider.tsx
- monthKeyFromDate
- ProductionJournalFactScreen.tsx
- finished/page.tsx
- production-plan.ts
- materials/text.ts
- ProductionEntryFormTable.tsx
- Отчет общий сырья
- SalesFactScreen.tsx
- postcss.config.mjs
- movement-plan.ts
- sales-plan.ts
- Отчет общий движения
- document.ts
- MaterialsPlanTable.tsx
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
- sales.ts
- Архитектура прототипа
- useDocumentStore
- FinishedGoodsMonthScreen.tsx
- AGENTS.md
- MaterialsNormsScreen
- movement/page.tsx
- ProductCategory
- ProductionPlan

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `planMonthOpen()` - 56 edges
3. `PageFrame()` - 55 edges
4. `next` - 53 edges
5. `keepWithNext()` - 51 edges
6. `react` - 47 edges
7. `VatMoneyCell()` - 46 edges
8. `shiftMonth()` - 38 edges
9. `TableNumber()` - 38 edges
10. `useSales()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Единицы` --references--> `costWithVat()`  [INFERRED]
  docs/architecture.md → src/domain/cost.ts
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Единицы` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (71 total, 8 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (40): Единицы, SalesPlan, salesPlanTotals, saleLineAmountWithVat(), actualRangeSummary(), applyFactScale(), applyPlanScale(), applySummaryLens() (+32 more)

### Community 1 - "ProductionPlanScreen.tsx"
Cohesion: 0.13
Nodes (20): metadata, ProductionFactPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), parseProductionFactQuery(), parseProductionJournalFactQuery() (+12 more)

### Community 2 - "products.ts"
Cohesion: 0.13
Nodes (37): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+29 more)

### Community 3 - "PlanningScreen.tsx"
Cohesion: 0.13
Nodes (23): metadata, PlanningPage(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), planningHref(), AddCategoryDialog(), submit() (+15 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.08
Nodes (22): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+14 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (31): react, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+23 more)

### Community 6 - "Предметная область"
Cohesion: 0.10
Nodes (21): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство), Отчет подневный (производство) (+13 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.14
Nodes (36): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyRangeView(), emptyTotals() (+28 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (73): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+65 more)

### Community 11 - "AppShell.tsx"
Cohesion: 0.15
Nodes (17): SALES_SECTION_TITLE, AppShell(), currentNavLabel(), MATERIALS_NAV, MockReset(), MOVEMENT_NAV, NavGroup(), NavItem (+9 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.10
Nodes (56): adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+48 more)

### Community 14 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (31): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+23 more)

### Community 15 - "SummaryHeadlineTable.tsx"
Cohesion: 0.29
Nodes (10): OperatingExpenseSide, SummaryLens, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS (+2 more)

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.13
Nodes (30): recommendedVolumePiecesForMonths(), productionFactForLens(), rangeProductionFact(), SalesPlanRejection, displayedOperatingExpense(), ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange() (+22 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.23
Nodes (20): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+12 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.13
Nodes (21): defaultMax(), LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials, MaterialSeed (+13 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.21
Nodes (23): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isPrice(), isVatPercent(), materialById() (+15 more)

### Community 20 - "sales-fact.ts"
Cohesion: 0.16
Nodes (22): costWithVat(), unitCost, amountExVat(), amountWithVat(), averageAmount(), percentHundredths(), ratioRound(), vatPercentHundredths() (+14 more)

### Community 21 - "materials.ts"
Cohesion: 0.08
Nodes (45): costExVat(), MATERIAL_GROUPS, MATERIAL_UNITS, MaterialReceiptLine, MaterialUnit, addMoney(), addMoneyNullable(), bookClosingQuantity() (+37 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (45): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), isOccurredOn(), ProductionEntryLine, occurredOnOpen(), addProductionEntry() (+37 more)

### Community 23 - "production-journal-fact.ts"
Cohesion: 0.16
Nodes (20): Удаление, Product, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds() (+12 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "PageFrame"
Cohesion: 0.14
Nodes (21): metadata, ProductionJournalPage(), metadata, QuestionsPage(), productionEntryPieces(), workingProductionEntriesInMonth(), MaterialJournalScreen(), materialReceiptHref() (+13 more)

### Community 26 - "movement/paths.ts"
Cohesion: 0.17
Nodes (14): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FinishedGoodsFactView, MOVEMENT_FACT_TITLE (+6 more)

### Community 27 - "layout.tsx"
Cohesion: 0.33
Nodes (4): metadata, onest, RootLayout(), unbounded

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (50): RowCell(), RowCell(), Pieces(), RowCell(), TotalCell(), RowCell(), ArrowButton(), AverageCost() (+42 more)

### Community 29 - "next"
Cohesion: 0.23
Nodes (11): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+3 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.12
Nodes (26): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), materialReceiptsInMonth() (+18 more)

### Community 31 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.08
Nodes (52): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), FinishedGoodsFactTable() (+44 more)

### Community 32 - "Icons.tsx"
Cohesion: 0.18
Nodes (19): DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS (+11 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (30): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+22 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.16
Nodes (20): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+12 more)

### Community 35 - "monthKeyFromDate"
Cohesion: 0.14
Nodes (29): activeCategories(), maxSaleOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), MaterialMonthBar(), FinishedGoodsFactScreen() (+21 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.20
Nodes (18): recommendedDayKey(), recommendedVolumeByDay(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactMonth(), monthDates(), productionJournalFactHref(), DayDateControl() (+10 more)

### Community 37 - "finished/page.tsx"
Cohesion: 0.16
Nodes (16): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), DERIVATIVE_SECTIONS, FINISHED_SECTIONS, QuantityUnit, RecipeItem (+8 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.17
Nodes (22): activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+14 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.20
Nodes (9): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_NAME_ERROR, MATERIAL_NORM_ERROR (+1 more)

### Community 41 - "ProductionEntryFormTable.tsx"
Cohesion: 0.12
Nodes (24): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders() (+16 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "SalesFactScreen.tsx"
Cohesion: 0.22
Nodes (14): defaultSalesFactDay(), salesFactGridProducts(), salesFactHref(), SalesFactView, DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth() (+6 more)

### Community 45 - "movement-plan.ts"
Cohesion: 0.23
Nodes (19): closingInventoryDeviationPieces(), hasStoredInventoryLine(), storedInventoryPiecesForProduct(), buildRow(), emptyNormLine(), emptyTotals(), finishedGoodsNormsList(), isNormPieces() (+11 more)

### Community 46 - "sales-plan.ts"
Cohesion: 0.17
Nodes (24): productionPlanLineMetrics, activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan() (+16 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "document.ts"
Cohesion: 0.12
Nodes (17): catalogCategories(), DeletableRecord, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpeningLine, Material, MaterialOpening, MaterialOpeningLine (+9 more)

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.14
Nodes (27): MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS, MaterialsPlanTable() (+19 more)

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

### Community 62 - "sales.ts"
Cohesion: 0.37
Nodes (13): SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales(), saleById() (+5 more)

### Community 63 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 64 - "useDocumentStore"
Cohesion: 0.29
Nodes (9): commitDocumentUpdate(), useDocumentStore(), FinishedGoodsOpeningRejection, isOpeningPieces(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, FinishedGoodsNormRejection, useMovementPlan() (+1 more)

### Community 65 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.47
Nodes (8): clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace(), open(), finishedGoodsSummaryHref()

### Community 66 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 67 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 68 - "movement/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, MovementPage(), MOVEMENT_SUMMARY_TITLE, parseFinishedGoodsSummaryQuery()

### Community 69 - "ProductCategory"
Cohesion: 0.67
Nodes (3): ProductCategory, EntryFormGroup, SaleFormGroup

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 340 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionPlanScreen.tsx`, `products.ts`, `PlanningScreen.tsx`, `package.json`, `SaleScreen.tsx`, `AppShell.tsx`, `MaterialsPlanScreen.tsx`, `SummaryScreen.tsx`, `ProductionEntryScreen.tsx`, `PageFrame`, `movement/paths.ts`, `layout.tsx`, `MaterialDocumentScreen.tsx`, `Icons.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `finished/page.tsx`, `SalesFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `MaterialsNormsScreen`, `movement/page.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1091753774680604 - nodes in this community are weakly interconnected._
- **Why does `react` connect `MaterialReceiptFormTable.tsx` to `ProductionPlanScreen.tsx`, `products.ts`, `PlanningScreen.tsx`, `package.json`, `SaleScreen.tsx`, `AppShell.tsx`, `index.ts`, `MaterialsPlanScreen.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `ProductionEntryScreen.tsx`, `PageFrame`, `SummaryTable.tsx`, `next`, `MaterialDocumentScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `Icons.tsx`, `DocumentProvider.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `ProductionEntryFormTable.tsx`, `SalesFactScreen.tsx`, `MaterialsPlanTable.tsx`, `FinishedGoodsMonthScreen.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `ProductionPlanScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1282051282051282 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `production-plan.ts`, `sales-plan.ts`, `sales-fact.ts`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12846068660022147 - nodes in this community are weakly interconnected._