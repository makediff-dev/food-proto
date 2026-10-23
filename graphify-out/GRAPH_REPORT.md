# Graph Report - food-proto  (2026-10-23)

## Corpus Check
- 174 files · ~102,052 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1623 nodes · 6011 edges · 73 communities (66 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3ee9808f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- use-sales.ts
- monthKeyFromDate
- mock-document.ts
- ProductionEntryFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- FinishedProductEditScreen.tsx
- DerivativeCreateScreen.tsx
- compilerOptions
- SalesFactTable.tsx
- AppShell.tsx
- SaleScreen.tsx
- SummaryScreen.tsx
- ProductionFactTable.tsx
- mock-materials.ts
- materials.ts
- movement/paths.ts
- index.ts
- FinishedGoodsFactScreen.tsx
- sales-fact.ts
- Флоу товара
- planMonthOpen
- use-materials.ts
- amountExVat
- SummaryTable.tsx
- production/paths.ts
- MaterialDocumentScreen.tsx
- keepWithNext
- MaterialsNormsScreen
- production-fact.ts
- ColumnLabel
- MaterialsPlanScreen.tsx
- ProductionJournalFactScreen.tsx
- SalesJournalScreen.tsx
- production-plan.ts
- products.ts
- DocumentProvider.tsx
- Отчет общий сырья
- PageFrame
- postcss.config.mjs
- recipes/paths.ts
- document.ts
- Отчет общий движения
- MaterialReceiptFormTable.tsx
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
- production-journal.ts
- sales-plan.ts
- next
- Архитектура прототипа
- PlanningScreen.tsx
- movementRow
- Icons.tsx
- setMaterialPlanField
- migrate-document.ts
- AGENTS.md
- openingFor

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `PageFrame()` - 61 edges
3. `next` - 60 edges
4. `planMonthOpen()` - 56 edges
5. `keepWithNext()` - 53 edges
6. `react` - 51 edges
7. `VatMoneyCell()` - 46 edges
8. `shiftMonth()` - 38 edges
9. `useDocumentStore()` - 37 edges
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

## Communities (73 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.12
Nodes (40): Единицы, SalesPlan, percentHundredths(), vatPercentHundredths(), dayTotals(), salesPlanTotals, actualRangeSummary(), applyFactScale() (+32 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.15
Nodes (23): metadata, NewProductionEntryPage(), defaultProductionEntryDay(), ProductionEntryRejection, productionLineAmountWithVat(), NEW_PRODUCTION_ENTRY_TITLE, productionJournalHref(), emptyProductionEntryLineDraft() (+15 more)

### Community 2 - "use-sales.ts"
Cohesion: 0.15
Nodes (31): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+23 more)

### Community 3 - "monthKeyFromDate"
Cohesion: 0.13
Nodes (29): activeCategories(), monthKeyFromDate(), shiftMonth(), lastHorizonMonth(), FullscreenToggle(), InventoryScreen(), resolveMonth(), Workspace() (+21 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (28): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+20 more)

### Community 5 - "ProductionEntryFormTable.tsx"
Cohesion: 0.07
Nodes (55): react, CategoryBlock(), editableFieldNear(), ProductRow(), CategoryBlock(), editableFieldNear(), ProductRow(), buildGroups() (+47 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство) (+15 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.07
Nodes (74): metadata, MovementPage(), FinishedGoodsNormLine, FinishedGoodsOpeningLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct() (+66 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "FinishedProductEditScreen.tsx"
Cohesion: 0.18
Nodes (21): FinishedProductRecipePage(), metadata, activeMaterials(), formatQuantity(), formatQuantityDraft(), draftsFromLines(), buildGroups(), componentDraftKey() (+13 more)

### Community 11 - "DerivativeCreateScreen.tsx"
Cohesion: 0.12
Nodes (38): metadata, NewDerivativePage(), activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection (+30 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "SalesFactTable.tsx"
Cohesion: 0.09
Nodes (40): FinishedGoodsRow, FinishedGoodsTotals, adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+32 more)

### Community 14 - "AppShell.tsx"
Cohesion: 0.14
Nodes (18): RECIPES_SECTION_TITLE, SALES_SECTION_TITLE, AppShell(), currentNavLabel(), MATERIALS_NAV, MockReset(), MOVEMENT_NAV, NavGroup() (+10 more)

### Community 15 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (64): metadata, SalePage(), metadata, NewSalePage(), SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection() (+56 more)

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.13
Nodes (31): recommendedVolumePiecesForMonths(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection, productionFactHref(), productionFactPageTitle() (+23 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.19
Nodes (19): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+11 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (23): MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialOpeningLine, MaterialReceiptLine, NORMED_MATERIAL_GROUP_ID, addMoney(), addMoneyNullable() (+15 more)

### Community 20 - "movement/paths.ts"
Cohesion: 0.17
Nodes (14): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FinishedGoodsFactView, MOVEMENT_FACT_TITLE (+6 more)

### Community 21 - "index.ts"
Cohesion: 0.14
Nodes (39): MovementPlanGroup, COLUMNS, COLUMN_KIND, ColumnKey, COLUMNS, COLUMN_KIND, ColumnKey, COLUMNS (+31 more)

### Community 22 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.13
Nodes (28): isOccurredOn(), defaultSalesFactDay(), monthDates(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle() (+20 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.13
Nodes (29): Удаление, Product, PrototypeDocument, averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds() (+21 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "planMonthOpen"
Cohesion: 0.22
Nodes (17): useDocumentStore(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, setFinishedGoodsNorm(), setFinishedGoodsNormRejection(), productionEntryPieces(), workingProductionEntriesInMonth() (+9 more)

### Community 26 - "use-materials.ts"
Cohesion: 0.19
Nodes (25): addMaterial(), deleteMaterial(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent(), materialById() (+17 more)

### Community 27 - "amountExVat"
Cohesion: 0.17
Nodes (18): costExVat(), costWithVat(), unitCost, moneyOf(), amountExVat(), amountWithVat(), ratioRound(), ProductionJournalFactRow (+10 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.15
Nodes (21): SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind() (+13 more)

### Community 29 - "production/paths.ts"
Cohesion: 0.11
Nodes (21): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPage() (+13 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.16
Nodes (19): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse() (+11 more)

### Community 31 - "keepWithNext"
Cohesion: 0.11
Nodes (52): FinishedGoodsGroup, TotalCell(), MetricCell(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+44 more)

### Community 32 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 33 - "production-fact.ts"
Cohesion: 0.16
Nodes (29): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+21 more)

### Community 34 - "ColumnLabel"
Cohesion: 0.13
Nodes (24): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders() (+16 more)

### Community 35 - "MaterialsPlanScreen.tsx"
Cohesion: 0.08
Nodes (43): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+35 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.20
Nodes (15): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth(), productionJournalFactPageTitle() (+7 more)

### Community 37 - "SalesJournalScreen.tsx"
Cohesion: 0.17
Nodes (19): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, parseSalesFactQuery(), parseSalesJournalQuery(), saleHref() (+11 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.15
Nodes (26): commitDocumentUpdate(), plannedProductionVolumePieces(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+18 more)

### Community 40 - "products.ts"
Cohesion: 0.13
Nodes (27): ProductRecipeLine, addProduct(), appendProductionPlanLines(), appendSalesPlanLines(), FieldRejection, isUnitCost(), isWarehouseId(), lineKey() (+19 more)

### Community 41 - "DocumentProvider.tsx"
Cohesion: 0.16
Nodes (16): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+8 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "PageFrame"
Cohesion: 0.24
Nodes (8): metadata, QuestionsPage(), ProductionPlaceholderScreen(), RecipeJournalsScreen(), RecipeJournalsTable(), RecipeListSection, useNameColumnWidth(), PageFrame()

### Community 45 - "recipes/paths.ts"
Cohesion: 0.13
Nodes (22): metadata, RecipeFinishedPage(), DerivativePage(), metadata, metadata, RecipeDerivativesPage(), derivativeCompositionLines(), derivativeSections() (+14 more)

### Community 46 - "document.ts"
Cohesion: 0.12
Nodes (16): DeletableRecord, Material, MATERIAL_WAREHOUSES, MaterialUnit, MaterialWeightPair, MonthOperatingExpense, PRODUCT_CATEGORIES, ProductCategory (+8 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.20
Nodes (16): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+8 more)

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.14
Nodes (26): MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS, MaterialsPlanTable() (+18 more)

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

### Community 62 - "production-journal.ts"
Cohesion: 0.32
Nodes (14): ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection(), productionEntryByIdOrNull() (+6 more)

### Community 63 - "sales-plan.ts"
Cohesion: 0.25
Nodes (15): activeProducts(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), isPrice(), isVolume(), lineNumbersRejection() (+7 more)

### Community 64 - "next"
Cohesion: 0.25
Nodes (9): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+1 more)

### Community 65 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 66 - "PlanningScreen.tsx"
Cohesion: 0.15
Nodes (24): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+16 more)

### Community 67 - "movementRow"
Cohesion: 0.26
Nodes (12): bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), gridMaterials(), inventoryQuantityFor(), movementMetrics(), movementRow() (+4 more)

### Community 68 - "Icons.tsx"
Cohesion: 0.38
Nodes (8): Glyph(), IconClose(), IconEye(), IconFact(), IconList(), IconMenu(), IconPlan(), IconUndo()

### Community 69 - "setMaterialPlanField"
Cohesion: 0.25
Nodes (9): emptyPlanLine(), liveNorms(), materialConsumptionIsNormed(), materialMonthPlansList(), materialNormQuantity(), materialNormsList(), planFor(), referencedMaterialIds() (+1 more)

### Community 70 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

### Community 71 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 72 - "openingFor"
Cohesion: 0.67
Nodes (4): hasStoredMaterialInventoryLine(), materialOpeningsList(), openingFor(), setMaterialOpening()

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 358 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `ProductionEntryFormTable.tsx` to `ProductionEntryScreen.tsx`, `monthKeyFromDate`, `finished-goods.ts`, `package.json`, `FinishedProductEditScreen.tsx`, `DerivativeCreateScreen.tsx`, `SalesFactTable.tsx`, `AppShell.tsx`, `SaleScreen.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `index.ts`, `FinishedGoodsFactScreen.tsx`, `planMonthOpen`, `SummaryTable.tsx`, `MaterialDocumentScreen.tsx`, `keepWithNext`, `ColumnLabel`, `MaterialsPlanScreen.tsx`, `ProductionJournalFactScreen.tsx`, `SalesJournalScreen.tsx`, `DocumentProvider.tsx`, `PageFrame`, `MaterialReceiptFormTable.tsx`, `MaterialsPlanTable.tsx`, `next`, `PlanningScreen.tsx`, `Icons.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12195121951219512 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `monthKeyFromDate`, `ProductionEntryFormTable.tsx`, `finished-goods.ts`, `package.json`, `FinishedProductEditScreen.tsx`, `DerivativeCreateScreen.tsx`, `AppShell.tsx`, `SaleScreen.tsx`, `SummaryScreen.tsx`, `movement/paths.ts`, `FinishedGoodsFactScreen.tsx`, `planMonthOpen`, `production/paths.ts`, `MaterialDocumentScreen.tsx`, `MaterialsNormsScreen`, `MaterialsPlanScreen.tsx`, `ProductionJournalFactScreen.tsx`, `SalesJournalScreen.tsx`, `DocumentProvider.tsx`, `PageFrame`, `recipes/paths.ts`, `PlanningScreen.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `summary.ts`, `production-fact.ts`, `ProductionEntryScreen.tsx`, `MaterialsPlanScreen.tsx`, `PlanningScreen.tsx`, `ProductionJournalFactScreen.tsx`, `SalesJournalScreen.tsx`, `finished-goods.ts`, `next`, `SaleScreen.tsx`, `SummaryScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `sales-fact.ts`, `production-journal.ts`, `planMonthOpen`, `MaterialDocumentScreen.tsx`, `sales-plan.ts`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `use-sales.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14616755793226383 - nodes in this community are weakly interconnected._