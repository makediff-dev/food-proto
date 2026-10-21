# Graph Report - food-proto  (2026-10-21)

## Corpus Check
- 155 files · ~92,495 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1454 nodes · 5299 edges · 59 communities (52 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29d3cb21`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- MaterialReceiptFormTable.tsx
- products.ts
- next
- mock-document.ts
- SaleFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- MovementPlanScreen.tsx
- compilerOptions
- index.ts
- MaterialsPlanScreen.tsx
- FinishedGoodsMonthTable.tsx
- SummaryScreen.tsx
- ProductionFactTable.tsx
- document.ts
- use-materials.ts
- PlanningScreen.tsx
- materials.ts
- ProductionEntryScreen.tsx
- sales-fact.ts
- Флоу товара
- SummaryTable.tsx
- ProductionPlanScreen.tsx
- ProductionJournalFactTable.tsx
- QuantityCell
- monthKeyFromDate
- MaterialDocumentScreen.tsx
- PageFrame
- SummaryHeadlineTable.tsx
- production-fact.ts
- useDocumentStore
- ProductionJournalFactScreen.tsx
- MaterialsNormsScreen.tsx
- production-plan.ts
- materials/text.ts
- FinishedGoodsFactScreen.tsx
- Отчет общий сырья
- postcss.config.mjs
- sales-plan.ts
- SalesFactScreen.tsx
- Отчет общий движения
- keepWithNext
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

## Communities (59 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (38): Единицы, SalesPlan, PLAN_HORIZON_MONTHS, priceWithVatFromExVat(), salesPlanTotals, actualRangeSummary(), applyPlanScale(), applySummaryLens() (+30 more)

### Community 1 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (54): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+46 more)

### Community 2 - "products.ts"
Cohesion: 0.13
Nodes (37): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+29 more)

### Community 3 - "next"
Cohesion: 0.05
Nodes (49): nextConfig, next, metadata, onest, RootLayout(), unbounded, Home(), metadata (+41 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (43): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+35 more)

### Community 5 - "SaleFormTable.tsx"
Cohesion: 0.15
Nodes (17): editableFieldNear(), ProductRow(), editableFieldNear(), ProductRow(), buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey (+9 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (33): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+25 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.07
Nodes (79): metadata, MovementPage(), isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), clampSummaryMonth() (+71 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (75): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+67 more)

### Community 11 - "MovementPlanScreen.tsx"
Cohesion: 0.15
Nodes (17): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FullscreenToggle(), MovementPlanScreen(), Workspace(), open() (+9 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.11
Nodes (53): react, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMNS, ColumnKey, COLUMNS, COLUMN_GROUPS (+45 more)

### Community 14 - "MaterialsPlanScreen.tsx"
Cohesion: 0.10
Nodes (33): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+25 more)

### Community 15 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.15
Nodes (29): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell(), ProductRow() (+21 more)

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.16
Nodes (28): activeCategories(), SalesPlanRejection, ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection, productionFactHref() (+20 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.23
Nodes (21): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+13 more)

### Community 18 - "document.ts"
Cohesion: 0.08
Nodes (29): defaultMax(), LineOverride, materialNorms, materialPlan(), materials, priceWithVat, q(), septemberPlanW1 (+21 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.16
Nodes (28): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isPrice() (+20 more)

### Community 20 - "PlanningScreen.tsx"
Cohesion: 0.12
Nodes (30): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+22 more)

### Community 21 - "materials.ts"
Cohesion: 0.12
Nodes (35): MaterialReceiptLine, MaterialUnit, addMoney(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), emptyTotals(), gridMaterials() (+27 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (45): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection() (+37 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.12
Nodes (35): Удаление, unitCost, Product, PrototypeDocument, averageAmount(), percentHundredths(), vatPercentHundredths(), dayGridProducts() (+27 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.18
Nodes (18): CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), GridText(), PLAN_ASSIGNED, planColumnKind(), ProductRow() (+10 more)

### Community 26 - "ProductionPlanScreen.tsx"
Cohesion: 0.15
Nodes (20): missingProductionPlanProducts(), activeProducts(), shiftMonth(), lastHorizonMonth(), FullscreenToggle(), InventoryScreen(), resolveMonth(), Workspace() (+12 more)

### Community 27 - "ProductionJournalFactTable.tsx"
Cohesion: 0.15
Nodes (23): adjacentDay(), ArrowButton(), DayLabel(), dayOfMonth(), ArrowButton(), CategoryBlock(), COLUMN_KIND, ColumnKey (+15 more)

### Community 28 - "QuantityCell"
Cohesion: 0.20
Nodes (15): MaterialNormDeviation(), MaterialsInventoryTable(), MaterialsPlanTable(), PlanCell(), planColumnKind(), PlanTotal(), consumptionEditable(), groupEndClass() (+7 more)

### Community 29 - "monthKeyFromDate"
Cohesion: 0.32
Nodes (12): monthKeyFromDate(), planMonthOpen(), resolveMonth(), resolveMonth(), resolveMonth(), ProductionFactScreen(), resolveRange(), resolveMonth() (+4 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.15
Nodes (23): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), DocumentForm(), save(), setLine() (+15 more)

### Community 31 - "PageFrame"
Cohesion: 0.20
Nodes (13): metadata, QuestionsPage(), productionEntryPieces(), workingProductionEntriesInMonth(), productionEntryHref(), productionEntryNewHref(), entryComposition(), groupEntriesByDay() (+5 more)

### Community 32 - "SummaryHeadlineTable.tsx"
Cohesion: 0.36
Nodes (9): OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SummaryHeadlineTable() (+1 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.13
Nodes (33): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+25 more)

### Community 34 - "useDocumentStore"
Cohesion: 0.50
Nodes (7): commitDocumentUpdate(), useDocumentStore(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), openPlan(), useMovementPlan(), useProductionPlan()

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.22
Nodes (13): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth(), productionJournalFactPageTitle() (+5 more)

### Community 37 - "MaterialsNormsScreen.tsx"
Cohesion: 0.29
Nodes (9): MaterialsNormsPage(), metadata, MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID, activeMaterials(), materialNormQuantity(), MaterialsNormsScreen(), NormCell() (+1 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.16
Nodes (21): ProductionPlan, activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan(), isVolume() (+13 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.18
Nodes (10): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NORM_ERROR (+2 more)

### Community 41 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.18
Nodes (17): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle(), mondayLeadForMonth() (+9 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 45 - "sales-plan.ts"
Cohesion: 0.16
Nodes (26): costExVat(), costWithVat(), amountExVat(), amountWithVat(), ratioRound(), productionPlanLineMetrics, activeSalesPlans(), addSalesPlan() (+18 more)

### Community 46 - "SalesFactScreen.tsx"
Cohesion: 0.21
Nodes (15): defaultSalesFactDay(), salesFactHref(), SalesFactView, DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth(), resolveDay() (+7 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 49 - "keepWithNext"
Cohesion: 0.14
Nodes (23): Подсказки заголовков таблицы, FinishedGoodsReportColumnHeaders(), SUB_BANNER_GROUPS, SUB_BANNER_KEYS, subBannerGroupForKey(), subBannerLastKey(), CategoryBlock(), InventoryTable() (+15 more)

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

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 332 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `production-plan.ts`, `sales-plan.ts`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11153846153846154 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `MaterialReceiptFormTable.tsx`, `next`, `mock-document.ts`, `SaleFormTable.tsx`, `finished-goods.ts`, `package.json`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `MaterialsPlanScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `PlanningScreen.tsx`, `ProductionEntryScreen.tsx`, `SummaryTable.tsx`, `ProductionPlanScreen.tsx`, `ProductionJournalFactTable.tsx`, `MaterialDocumentScreen.tsx`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesFactScreen.tsx`, `keepWithNext`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `MaterialReceiptFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08524590163934426 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ProductionJournalFactScreen.tsx`, `MaterialsNormsScreen.tsx`, `finished-goods.ts`, `package.json`, `FinishedGoodsFactScreen.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `MaterialsPlanScreen.tsx`, `SalesFactScreen.tsx`, `SummaryScreen.tsx`, `PlanningScreen.tsx`, `ProductionEntryScreen.tsx`, `ProductionPlanScreen.tsx`, `MaterialDocumentScreen.tsx`, `PageFrame`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13170731707317074 - nodes in this community are weakly interconnected._