# Graph Report - food-proto  (2026-10-21)

## Corpus Check
- 155 files · ~93,349 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1464 nodes · 5322 edges · 63 communities (56 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c2043206`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- MaterialReceiptFormTable.tsx
- sales-plan.ts
- PlanningScreen.tsx
- mock-document.ts
- ProductionEntryFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- monthKeyFromDate
- compilerOptions
- index.ts
- MaterialsPlanScreen.tsx
- FinishedGoodsFactTable
- SummaryScreen.tsx
- ProductionFactTable.tsx
- document.ts
- use-materials.ts
- SalesFactScreen.tsx
- materials.ts
- ProductionEntryScreen.tsx
- production-journal-fact.ts
- Флоу товара
- ProductionPlanScreen.tsx
- AppShell.tsx
- SaleFormTable.tsx
- SummaryTable.tsx
- PageFrame
- MaterialDocumentScreen.tsx
- FinishedGoodsMonthTable.tsx
- MaterialsNormsScreen.tsx
- production-fact.ts
- DocumentProvider.tsx
- ProductionJournalScreen.tsx
- ProductionJournalFactScreen.tsx
- daysInMonth
- production-plan.ts
- materials/text.ts
- QuantityCell.tsx
- Отчет общий сырья
- FinishedGoodsFactScreen.tsx
- postcss.config.mjs
- README.md
- ratioRound
- Отчет общий движения
- layout.tsx
- SummaryHeadlineTable.tsx
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
- ProductionFactScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `planMonthOpen()` - 56 edges
3. `PageFrame()` - 53 edges
4. `next` - 51 edges
5. `keepWithNext()` - 51 edges
6. `VatMoneyCell()` - 46 edges
7. `react` - 45 edges
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
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Удаление` --references--> `finishedGoodsGridProducts()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (63 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (32): unitCost, PROFIT_TAX_PERCENT, SalesPlan, ProductionJournalFactRow, SalesFactRow, planPhase, profitabilityHundredths(), salesPlanLineMetrics (+24 more)

### Community 1 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.13
Nodes (23): setLine(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, emptyMaterialReceiptLineDraft(), EntryFormGroup, EntryFormRow (+15 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.11
Nodes (49): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+41 more)

### Community 3 - "PlanningScreen.tsx"
Cohesion: 0.12
Nodes (32): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), activeProducts(), deletedProducts(), missingPlanProducts() (+24 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (27): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+19 more)

### Community 5 - "ProductionEntryFormTable.tsx"
Cohesion: 0.13
Nodes (35): TotalCell(), RowCell(), buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormTotals (+27 more)

### Community 6 - "Предметная область"
Cohesion: 0.10
Nodes (21): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство), Отчет подневный (производство) (+13 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.06
Nodes (83): metadata, MovementPage(), commitDocumentUpdate(), FinishedGoodsNormLine, FinishedGoodsOpeningLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds() (+75 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (76): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+68 more)

### Community 11 - "monthKeyFromDate"
Cohesion: 0.11
Nodes (33): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), monthKeyFromDate(), planMonthOpen() (+25 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.09
Nodes (62): react, MaterialMovementRow, MaterialMovementTotals, adjacentDay(), COLUMNS, ColumnKey, COLUMNS, COLUMN_GROUPS (+54 more)

### Community 14 - "MaterialsPlanScreen.tsx"
Cohesion: 0.10
Nodes (33): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+25 more)

### Community 15 - "FinishedGoodsFactTable"
Cohesion: 0.60
Nodes (6): CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell(), ProductRow(), visibleDayRows()

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.18
Nodes (20): Home(), metadata, displayedOperatingExpense(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), scaleOperatingExpense(), SummaryLens (+12 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.11
Nodes (45): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, RowCell(), CategoryBlock(), ColumnHeadings(), ColumnKey (+37 more)

### Community 18 - "document.ts"
Cohesion: 0.10
Nodes (24): defaultMax(), LineOverride, materialNorms, materialPlan(), materials, priceWithVat, q(), septemberPlanW1 (+16 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.21
Nodes (22): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isVatPercent(), materialById(), materialNameRejection (+14 more)

### Community 20 - "SalesFactScreen.tsx"
Cohesion: 0.15
Nodes (23): isOccurredOn(), dayGridProducts(), dayTotals(), defaultSalesFactDay(), productById(), rowMetrics(), SalesFactDayView, salesFactGridProducts() (+15 more)

### Community 21 - "materials.ts"
Cohesion: 0.10
Nodes (40): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+32 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.07
Nodes (55): Архитектура прототипа, Поток данных, Слои, Удаление, Чего не делать, ProductionEntryPage(), metadata, NewProductionEntryPage() (+47 more)

### Community 23 - "production-journal-fact.ts"
Cohesion: 0.24
Nodes (12): averageAmount(), periodGridCategories(), dayTotals(), ProductionJournalFactDayView, ProductionJournalFactGroup, productionJournalFactGroups(), productionJournalFactMonth(), ProductionJournalFactTotals (+4 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ProductionPlanScreen.tsx"
Cohesion: 0.13
Nodes (20): metadata, ProductionFactPage(), metadata, metadata, ProductionJournalPage(), metadata, ProductionPlanPage(), missingProductionPlanProducts() (+12 more)

### Community 26 - "AppShell.tsx"
Cohesion: 0.16
Nodes (17): MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, PRODUCTION_SECTION_TITLE, SALES_SECTION_TITLE, currentNavLabel(), MATERIALS_NAV, MOVEMENT_NAV, NavGroup() (+9 more)

### Community 27 - "SaleFormTable.tsx"
Cohesion: 0.12
Nodes (21): editableFieldNear(), ProductRow(), ProductRow(), ProductRow(), buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey (+13 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.12
Nodes (26): SalesPlanRejection, OperatingExpenseRejection, CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), GridText(), PLAN_ASSIGNED (+18 more)

### Community 29 - "PageFrame"
Cohesion: 0.20
Nodes (10): nextConfig, next, metadata, PlanPage(), metadata, QuestionsPage(), ProductionPlaceholderScreen(), SUMMARY_SECTION_TITLE (+2 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.20
Nodes (16): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), occurredOnOpen() (+8 more)

### Community 31 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (36): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_GROUPS (+28 more)

### Community 32 - "MaterialsNormsScreen.tsx"
Cohesion: 0.29
Nodes (9): MaterialsNormsPage(), metadata, MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID, activeMaterials(), materialNormQuantity(), MaterialsNormsScreen(), NormCell() (+1 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.18
Nodes (24): amountExVat(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta(), monthProductionFact() (+16 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.19
Nodes (17): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+9 more)

### Community 35 - "ProductionJournalScreen.tsx"
Cohesion: 0.23
Nodes (13): useDocumentStore(), productionEntryPieces(), workingProductionEntriesInMonth(), productionEntryHref(), productionEntryNewHref(), entryComposition(), groupEntriesByDay(), Workspace() (+5 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.20
Nodes (15): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactHref(), ProductionJournalFactView, DayDateControl(), onKeyDown(), mondayLeadForMonth() (+7 more)

### Community 37 - "daysInMonth"
Cohesion: 0.24
Nodes (17): Единицы, actualRangeProductionFact(), applyProductionFactLens(), factVolumeScale(), planVolumeScale(), productionFactForLens(), daysInMonth(), actualRangeSummary() (+9 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+18 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.20
Nodes (9): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NORM_ERROR (+1 more)

### Community 41 - "QuantityCell.tsx"
Cohesion: 0.21
Nodes (15): MaterialNormDeviation(), MaterialsInventoryTable(), MaterialsPlanTable(), PlanCell(), planColumnKind(), PlanTotal(), consumptionEditable(), groupEndClass() (+7 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.21
Nodes (14): DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS, Workspace() (+6 more)

### Community 45 - "README.md"
Cohesion: 0.18
Nodes (8): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Как собрать первый прототип, Порядок, Формула, Запуск, Куда смотреть

### Community 46 - "ratioRound"
Cohesion: 0.24
Nodes (11): costWithVat(), amountWithVat(), percentHundredths(), ratioRound(), vatPercentHundredths(), priceWithVatFromExVat(), applyFactScale(), applyPlanScale() (+3 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "layout.tsx"
Cohesion: 0.20
Nodes (6): metadata, onest, RootLayout(), unbounded, AppShell(), MockReset()

### Community 49 - "SummaryHeadlineTable.tsx"
Cohesion: 0.13
Nodes (22): Подсказки заголовков таблицы, OperatingExpenseSide, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS (+14 more)

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

### Community 63 - "ProductionFactScreen.tsx"
Cohesion: 0.16
Nodes (20): metadata, ProductionPage(), activeCategories(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), parseProductionFactQuery() (+12 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 336 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `production-fact.ts`, `Ввод плана (производство)`, `daysInMonth`, `production-plan.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11051693404634581 - nodes in this community are weakly interconnected._
- **Why does `Что пишется` connect `Ввод плана (производство)` to `finished-goods.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `MaterialReceiptFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13405797101449277 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `MaterialReceiptFormTable.tsx`, `PlanningScreen.tsx`, `ProductionEntryFormTable.tsx`, `finished-goods.ts`, `package.json`, `SaleScreen.tsx`, `monthKeyFromDate`, `MaterialsPlanScreen.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `SalesFactScreen.tsx`, `ProductionEntryScreen.tsx`, `ProductionPlanScreen.tsx`, `AppShell.tsx`, `SaleFormTable.tsx`, `SummaryTable.tsx`, `PageFrame`, `MaterialDocumentScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `DocumentProvider.tsx`, `ProductionJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `QuantityCell.tsx`, `FinishedGoodsFactScreen.tsx`, `SummaryHeadlineTable.tsx`, `ProductionFactScreen.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10621942697414395 - nodes in this community are weakly interconnected._