# Graph Report - food-proto  (2026-10-23)

## Corpus Check
- 156 files · ~93,743 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1482 nodes · 5430 edges · 65 communities (58 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20e22dde`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- MaterialReceiptFormTable.tsx
- products.ts
- PlanningScreen.tsx
- mock-document.ts
- SaleFormTable.tsx
- Предметная область
- movement-plan.ts
- package.json
- biome.json
- SaleScreen.tsx
- InventoryScreen.tsx
- compilerOptions
- index.ts
- next
- finished-goods.ts
- ProductionFactScreen.tsx
- ProductionFactTable.tsx
- document.ts
- use-materials.ts
- FinishedGoodsFactScreen.tsx
- materials.ts
- ProductionEntryScreen.tsx
- sales-fact.ts
- Флоу товара
- ProductionJournalScreen.tsx
- AppShell.tsx
- PageFrame
- SummaryTable.tsx
- PlanRedirect.tsx
- MaterialDocumentScreen.tsx
- FinishedGoodsMonthTable.tsx
- MaterialsNormsScreen
- production-fact.ts
- DocumentProvider.tsx
- monthKeyFromDate
- ProductionJournalFactScreen.tsx
- sales/text.ts
- production-plan.ts
- materials/text.ts
- ColumnLabel
- Отчет общий сырья
- SalesFactScreen.tsx
- postcss.config.mjs
- elapsedDaysInMonth
- sales-plan.ts
- Отчет общий движения
- layout.tsx
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
- SummaryScreen.tsx
- IconFullscreen
- migrate-document.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `planMonthOpen()` - 56 edges
3. `PageFrame()` - 53 edges
4. `next` - 51 edges
5. `keepWithNext()` - 51 edges
6. `react` - 46 edges
7. `VatMoneyCell()` - 46 edges
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

## Communities (65 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.13
Nodes (30): Единицы, SalesPlan, actualRangeSummary(), calendarDays(), emptyFactSide(), factFromRows(), factTotalsFromRows(), headlineSide() (+22 more)

### Community 1 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.23
Nodes (11): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, GroupBlock(), groupTotals() (+3 more)

### Community 2 - "products.ts"
Cohesion: 0.12
Nodes (40): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+32 more)

### Community 3 - "PlanningScreen.tsx"
Cohesion: 0.11
Nodes (33): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+25 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (27): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+19 more)

### Community 5 - "SaleFormTable.tsx"
Cohesion: 0.09
Nodes (32): adjacentDay(), ArrowButton(), CategoryBlock(), DayLabel(), dayOfMonth(), FinishedGoodsFactTable(), groupEndClass(), ProductRow() (+24 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (33): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+25 more)

### Community 7 - "movement-plan.ts"
Cohesion: 0.11
Nodes (36): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), closingInventoryDeviationPieces(), finishedGoodsGridProducts(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine() (+28 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (74): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+66 more)

### Community 11 - "InventoryScreen.tsx"
Cohesion: 0.18
Nodes (14): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), InventoryScreen(), resolveMonth(), Workspace(), open() (+6 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.12
Nodes (49): react, COLUMNS, COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, GROUP_END_KEYS, COLUMN_KIND (+41 more)

### Community 14 - "next"
Cohesion: 0.09
Nodes (40): nextConfig, next, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+32 more)

### Community 15 - "finished-goods.ts"
Cohesion: 0.15
Nodes (34): isMonthKey(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyRangeView(), emptyTotals(), factualClosingPiecesThrough(), FinishedGoodsDayView (+26 more)

### Community 16 - "ProductionFactScreen.tsx"
Cohesion: 0.32
Nodes (13): recommendedVolumePiecesForMonths(), actualRangeProductionFact(), productionFactForLens(), rangeProductionFact(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), productionFactHref() (+5 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.12
Nodes (37): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+29 more)

### Community 18 - "document.ts"
Cohesion: 0.08
Nodes (33): defaultMax(), LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials, MaterialSeed (+25 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.18
Nodes (27): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isPrice() (+19 more)

### Community 20 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.17
Nodes (16): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+8 more)

### Community 21 - "materials.ts"
Cohesion: 0.11
Nodes (38): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+30 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (42): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection() (+34 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.13
Nodes (31): Удаление, unitCost, Product, PrototypeDocument, averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+23 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ProductionJournalScreen.tsx"
Cohesion: 0.13
Nodes (24): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), productionEntryPieces(), workingProductionEntriesInMonth() (+16 more)

### Community 26 - "AppShell.tsx"
Cohesion: 0.19
Nodes (14): MATERIALS_SECTION_TITLE, SALES_SECTION_TITLE, currentNavLabel(), MATERIALS_NAV, MOVEMENT_NAV, NavItem, navItemIsCurrent(), navItemLinkClassName() (+6 more)

### Community 27 - "PageFrame"
Cohesion: 0.18
Nodes (16): metadata, MovementPage(), metadata, QuestionsPage(), useDocumentStore(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange() (+8 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.08
Nodes (59): formatRubles(), GridInput(), RowCell(), TotalCell(), buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey (+51 more)

### Community 29 - "PlanRedirect.tsx"
Cohesion: 0.26
Nodes (10): Home(), metadata, metadata, PlanPage(), SummaryLens, parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref() (+2 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (26): MaterialReceiptPage(), metadata, NewMaterialReceiptPage(), activeMaterials(), materialReceiptById(), occurredOnOpen(), maxProductionEntryOccurredOn(), DocumentForm() (+18 more)

### Community 31 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.11
Nodes (40): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+32 more)

### Community 32 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 33 - "production-fact.ts"
Cohesion: 0.12
Nodes (33): amountExVat(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+25 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (12): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+4 more)

### Community 35 - "monthKeyFromDate"
Cohesion: 0.12
Nodes (31): metadata, ProductionPlanPage(), activeCategories(), missingProductionPlanProducts(), activeProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth() (+23 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.19
Nodes (16): defaultProductionJournalFactDay(), finishedGoodsFactPageTitle(), productionJournalFactHref(), ProductionJournalFactView, DayDateControl(), onKeyDown(), mondayLeadForMonth(), productionJournalFactPageTitle() (+8 more)

### Community 37 - "sales/text.ts"
Cohesion: 0.14
Nodes (19): SalesPlanRejection, OperatingExpenseRejection, OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable() (+11 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): ProductionPlan, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+16 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.18
Nodes (10): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR (+2 more)

### Community 41 - "ColumnLabel"
Cohesion: 0.18
Nodes (14): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders() (+6 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "SalesFactScreen.tsx"
Cohesion: 0.25
Nodes (13): isOccurredOn(), defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+5 more)

### Community 45 - "elapsedDaysInMonth"
Cohesion: 0.24
Nodes (12): planPhase, applyFactScale(), applyPlanScale(), applySummaryLens(), elapsedDaysInMonth(), factVolumeScale(), operatingExpenseDisplayScale(), planSideAtVolume() (+4 more)

### Community 46 - "sales-plan.ts"
Cohesion: 0.20
Nodes (20): amountWithVat(), percentHundredths(), ratioRound(), vatPercentHundredths(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines() (+12 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "layout.tsx"
Cohesion: 0.20
Nodes (6): metadata, onest, RootLayout(), unbounded, AppShell(), MockReset()

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.14
Nodes (27): costWithVat(), MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS (+19 more)

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

### Community 62 - "SummaryScreen.tsx"
Cohesion: 0.33
Nodes (9): displayedOperatingExpense(), factOperatingExpenseStoredFromInput(), monthOperatingExpenseAmounts(), FullscreenToggle(), summaryPageTitle(), Workspace(), daysPhrase(), formatMonthNameGenitive() (+1 more)

### Community 63 - "IconFullscreen"
Cohesion: 0.36
Nodes (10): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+2 more)

### Community 64 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 336 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `index.ts` to `MaterialReceiptFormTable.tsx`, `PlanningScreen.tsx`, `SaleFormTable.tsx`, `package.json`, `SaleScreen.tsx`, `InventoryScreen.tsx`, `next`, `ProductionFactScreen.tsx`, `ProductionFactTable.tsx`, `FinishedGoodsFactScreen.tsx`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `AppShell.tsx`, `PageFrame`, `SummaryTable.tsx`, `PlanRedirect.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `DocumentProvider.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `ColumnLabel`, `SalesFactScreen.tsx`, `MaterialsPlanTable.tsx`, `SummaryScreen.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13306451612903225 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `MaterialsNormsScreen`, `PlanningScreen.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `package.json`, `SaleScreen.tsx`, `InventoryScreen.tsx`, `SalesFactScreen.tsx`, `layout.tsx`, `ProductionFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `ProductionEntryScreen.tsx`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `AppShell.tsx`, `PageFrame`, `PlanRedirect.tsx`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11733615221987315 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `movement-plan.ts`, `production-plan.ts`, `sales-plan.ts`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `PlanningScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10741971207087486 - nodes in this community are weakly interconnected._