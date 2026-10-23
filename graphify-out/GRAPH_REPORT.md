# Graph Report - food-proto  (2026-10-23)

## Corpus Check
- 169 files · ~97,991 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1567 nodes · 5746 edges · 74 communities (67 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ad11b46`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- production/paths.ts
- sales-plan.ts
- PlanningScreen.tsx
- mock-document.ts
- MaterialReceiptFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- DerivativeCreateScreen.tsx
- compilerOptions
- index.ts
- materials/paths.ts
- sales-fact/paths.ts
- ProductionFactScreen.tsx
- ProductionFactTable.tsx
- mock-materials.ts
- use-materials.ts
- sales-fact.ts
- materials.ts
- ProductionEntryScreen.tsx
- production-journal.ts
- Флоу товара
- ProductionJournalScreen.tsx
- FinishedGoodsFactScreen.tsx
- Cells.tsx
- SummaryTable.tsx
- sales.ts
- MaterialDocumentScreen.tsx
- FinishedGoodsMonthTable.tsx
- monthKeyFromDate
- production-fact.ts
- layout.tsx
- next
- ProductionJournalFactScreen.tsx
- Icons.tsx
- production-plan.ts
- materials/text.ts
- SalesFactTable.tsx
- Отчет общий сырья
- SalesFactScreen.tsx
- postcss.config.mjs
- SaleFormTable.tsx
- revenueExVat
- Отчет общий движения
- AppShell.tsx
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
- MovementPlanTable.tsx
- Архитектура прототипа
- document.ts
- useDocumentStore
- MaterialsInventoryScreen.tsx
- PageFrame
- DocumentProvider.tsx
- movementRow
- averageAmount
- MaterialsNormsScreen.tsx
- migrate-document.ts
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `next` - 57 edges
3. `PageFrame()` - 57 edges
4. `planMonthOpen()` - 56 edges
5. `keepWithNext()` - 53 edges
6. `react` - 50 edges
7. `VatMoneyCell()` - 46 edges
8. `shiftMonth()` - 38 edges
9. `TableNumber()` - 38 edges
10. `IconChevronDown()` - 35 edges

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

## Communities (74 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.12
Nodes (37): Единицы, SalesPlan, actualRangeSummary(), applyPlanScale(), applySummaryLens(), calendarDays(), displayedOperatingExpense(), emptyFactSide() (+29 more)

### Community 1 - "production/paths.ts"
Cohesion: 0.18
Nodes (13): metadata, ProductionFactPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), parseProductionFactQuery(), parseProductionJournalFactQuery() (+5 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.10
Nodes (50): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+42 more)

### Community 3 - "PlanningScreen.tsx"
Cohesion: 0.12
Nodes (27): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), missingProductionPlanProducts(), activeProducts(), deletedProducts() (+19 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (23): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+15 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (45): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+37 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (22): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство), Отчет подневный (производство) (+14 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.08
Nodes (68): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+60 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.25
Nodes (20): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), emptySaleLineDraft(), rowMetrics(), initialDrafts(), lineDraftFromSale(), SaleForm() (+12 more)

### Community 11 - "DerivativeCreateScreen.tsx"
Cohesion: 0.07
Nodes (54): metadata, RecipeFinishedPage(), metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative() (+46 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.10
Nodes (51): adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+43 more)

### Community 14 - "materials/paths.ts"
Cohesion: 0.14
Nodes (17): MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata, save(), MaterialsSummaryScreen() (+9 more)

### Community 15 - "sales-fact/paths.ts"
Cohesion: 0.10
Nodes (26): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+18 more)

### Community 16 - "ProductionFactScreen.tsx"
Cohesion: 0.25
Nodes (17): productionFactForLens(), rangeProductionFact(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref(), FullscreenToggle() (+9 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.12
Nodes (22): defaultMax(), LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials, MaterialSeed (+14 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.23
Nodes (22): addMaterial(), deleteMaterial(), isMaterialUnit(), isMaterialWarehouseId(), isPrice(), isVatPercent(), materialById(), materialNameRejection (+14 more)

### Community 20 - "sales-fact.ts"
Cohesion: 0.12
Nodes (27): Удаление, unitCost, Product, dayGridProducts(), periodGridCategories(), periodGridProducts(), dayTotals(), ProductionJournalFactDayView (+19 more)

### Community 21 - "materials.ts"
Cohesion: 0.11
Nodes (27): MaterialGroupId, MaterialReceiptLine, deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine(), isMaterialGroupId(), liveNorms(), materialConsumptionIsNormed() (+19 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.15
Nodes (22): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryRejection, NEW_PRODUCTION_ENTRY_TITLE, PRODUCTION_JOURNAL_TITLE, productionJournalHref() (+14 more)

### Community 23 - "production-journal.ts"
Cohesion: 0.21
Nodes (20): ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection() (+12 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ProductionJournalScreen.tsx"
Cohesion: 0.24
Nodes (13): metadata, ProductionJournalPage(), productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), productionEntryHref(), productionEntryNewHref(), entryComposition() (+5 more)

### Community 26 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.17
Nodes (18): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle(), mondayLeadForMonth() (+10 more)

### Community 27 - "Cells.tsx"
Cohesion: 0.15
Nodes (20): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), formatSaleDate() (+12 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (33): SalesPlanRejection, OperatingExpenseRejection, OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable() (+25 more)

### Community 29 - "sales.ts"
Cohesion: 0.28
Nodes (16): SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), PLAN_HORIZON_MONTHS, replaceSales() (+8 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.17
Nodes (18): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse() (+10 more)

### Community 31 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.13
Nodes (33): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell() (+25 more)

### Community 32 - "monthKeyFromDate"
Cohesion: 0.27
Nodes (14): defaultProductionEntryDay(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), MaterialMonthBar(), productionPlanHref(), ProductionPlanScreen() (+6 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.13
Nodes (32): amountExVat(), periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale() (+24 more)

### Community 34 - "layout.tsx"
Cohesion: 0.33
Nodes (4): metadata, onest, RootLayout(), unbounded

### Community 35 - "next"
Cohesion: 0.11
Nodes (23): nextConfig, next, metadata, MovementInventoryPage(), metadata, MovementPlanPage(), InventoryScreen(), resolveMonth() (+15 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.18
Nodes (17): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactHref(), DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth() (+9 more)

### Community 37 - "Icons.tsx"
Cohesion: 0.16
Nodes (22): Home(), metadata, metadata, PlanPage(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+14 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+18 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.18
Nodes (10): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR (+2 more)

### Community 41 - "SalesFactTable.tsx"
Cohesion: 0.18
Nodes (31): TotalCell(), ProductUnitPrice(), RowCell(), TotalCell(), ProductionPlanTable(), TotalsCell(), ArrowButton(), AverageCost() (+23 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "SalesFactScreen.tsx"
Cohesion: 0.22
Nodes (15): isOccurredOn(), defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth(), resolveDay() (+7 more)

### Community 45 - "SaleFormTable.tsx"
Cohesion: 0.17
Nodes (18): ProductCategory, EntryFormGroup, buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, formatKopecks() (+10 more)

### Community 46 - "revenueExVat"
Cohesion: 0.38
Nodes (7): productionPlanLineMetrics, profitabilityHundredths(), revenueExVat(), revenueWithVat(), salesPlanLineMetrics, planSide(), planSideAtVolume()

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "AppShell.tsx"
Cohesion: 0.14
Nodes (18): PRODUCTION_SECTION_TITLE, AppShell(), currentNavLabel(), MATERIALS_NAV, MockReset(), MOVEMENT_NAV, NavGroup(), NavItem (+10 more)

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.09
Nodes (36): MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), ColumnKey, COLUMNS, MaterialsPlanTable(), PlanCell() (+28 more)

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

### Community 62 - "MovementPlanTable.tsx"
Cohesion: 0.11
Nodes (33): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, GroupBlock(), CategoryBlock(), editableFieldNear(), ProductRow(), CategoryBlock() (+25 more)

### Community 63 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 64 - "document.ts"
Cohesion: 0.12
Nodes (18): catalogCategories(), DeletableRecord, Derivative, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpeningLine, Material, MATERIAL_GROUPS (+10 more)

### Community 65 - "useDocumentStore"
Cohesion: 0.22
Nodes (16): metadata, MovementPage(), useDocumentStore(), activeCategories(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen() (+8 more)

### Community 66 - "MaterialsInventoryScreen.tsx"
Cohesion: 0.20
Nodes (12): MaterialsInventoryPage(), metadata, addMoney(), addMoneyNullable(), emptyTotals(), materialMovementMonth, productionPieces(), sumRows() (+4 more)

### Community 67 - "PageFrame"
Cohesion: 0.15
Nodes (18): react, metadata, QuestionsPage(), deletedMaterials(), MaterialJournalScreen(), resolveMaterialMonth(), AddMaterialDialog(), MaterialsPlanScreen() (+10 more)

### Community 68 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (13): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+5 more)

### Community 69 - "movementRow"
Cohesion: 0.23
Nodes (14): costExVat(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), gridMaterials(), inventoryQuantityFor(), moneyOf() (+6 more)

### Community 70 - "averageAmount"
Cohesion: 0.29
Nodes (11): costWithVat(), amountWithVat(), averageAmount(), percentHundredths(), ratioRound(), vatPercentHundredths(), dayTotals(), rowMetrics() (+3 more)

### Community 71 - "MaterialsNormsScreen.tsx"
Cohesion: 0.29
Nodes (9): MaterialsNormsPage(), metadata, MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID, activeMaterials(), materialNormQuantity(), MaterialsNormsScreen(), NormCell() (+1 more)

### Community 72 - "migrate-document.ts"
Cohesion: 0.33
Nodes (6): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, MaterialUnit, SCHEMA_VERSION

### Community 73 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 349 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `production/paths.ts`, `PlanningScreen.tsx`, `package.json`, `SaleScreen.tsx`, `DerivativeCreateScreen.tsx`, `materials/paths.ts`, `sales-fact/paths.ts`, `ProductionFactScreen.tsx`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `MaterialDocumentScreen.tsx`, `monthKeyFromDate`, `layout.tsx`, `ProductionJournalFactScreen.tsx`, `Icons.tsx`, `SalesFactScreen.tsx`, `AppShell.tsx`, `MovementPlanTable.tsx`, `useDocumentStore`, `MaterialsInventoryScreen.tsx`, `PageFrame`, `MaterialsNormsScreen.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11875843454790823 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `PlanningScreen.tsx`, `MaterialReceiptFormTable.tsx`, `package.json`, `SaleScreen.tsx`, `DerivativeCreateScreen.tsx`, `index.ts`, `ProductionFactScreen.tsx`, `ProductionFactTable.tsx`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `Cells.tsx`, `SummaryTable.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `monthKeyFromDate`, `next`, `ProductionJournalFactScreen.tsx`, `Icons.tsx`, `SalesFactTable.tsx`, `SalesFactScreen.tsx`, `SaleFormTable.tsx`, `AppShell.tsx`, `MaterialsPlanTable.tsx`, `MovementPlanTable.tsx`, `useDocumentStore`, `MaterialsInventoryScreen.tsx`, `DocumentProvider.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10235690235690235 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `production-plan.ts`, `revenueExVat`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `PlanningScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11932773109243698 - nodes in this community are weakly interconnected._