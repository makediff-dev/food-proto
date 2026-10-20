# Graph Report - food-proto  (2026-10-15)

## Corpus Check
- 126 files · ~76,506 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1184 nodes · 4224 edges · 50 communities (43 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `79dc1253`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryFormTable.tsx
- products.ts
- AppShell.tsx
- mock-document.ts
- TableNumber
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- monthKeyFromDate
- compilerOptions
- SummaryTable.tsx
- ratioRound
- ProductionJournalFactTable.tsx
- DocumentProvider.tsx
- ProductionFactTable.tsx
- document.ts
- production-fact.ts
- PlanningScreen.tsx
- unitCost
- ProductionEntryScreen.tsx
- sales-fact.ts
- Флоу товара
- SummaryHeadlineTable.tsx
- production-plan.ts
- sales-plan.ts
- sales/text.ts
- SummaryScreen.tsx
- InventoryTable.tsx
- production-journal.ts
- ProductionJournalFactScreen.tsx
- PageFrame
- FinishedGoodsFactScreen.tsx
- postcss.config.mjs
- Отчет общий движения
- Инвентаризация
- Ввод плана движения
- Ввод производства
- Ввод плана производства
- Ввод продаж
- Ввод плана продаж
- Отчет общий продаж
- Отчет подневный движения
- Отчет подневный производства
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 60 edges
2. `planMonthOpen()` - 50 edges
3. `keepWithNext()` - 43 edges
4. `PageFrame()` - 40 edges
5. `next` - 39 edges
6. `react` - 37 edges
7. `VatMoneyCell()` - 36 edges
8. `shiftMonth()` - 32 edges
9. `useSales()` - 32 edges
10. `TableNumber()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Удаление` --references--> `finishedGoodsGridProducts()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Единицы` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Единицы` --references--> `productionFactForLens()`  [INFERRED]
  docs/architecture.md → src/domain/production-fact.ts
- `Единицы` --references--> `productionJournalFactMonth()`  [INFERRED]
  docs/architecture.md → src/domain/production-journal-fact.ts

## Import Cycles
- None detected.

## Communities (50 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.10
Nodes (47): SalesPlan, factVolumeScale(), planVolumeScale(), daysInMonth(), PLAN_HORIZON_MONTHS, planPhase, salesPlanTotals, actualRangeSummary() (+39 more)

### Community 1 - "ProductionEntryFormTable.tsx"
Cohesion: 0.10
Nodes (43): ProductCategory, buildGroups(), CategoryBlock(), ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+35 more)

### Community 2 - "products.ts"
Cohesion: 0.20
Nodes (24): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+16 more)

### Community 3 - "AppShell.tsx"
Cohesion: 0.07
Nodes (36): metadata, onest, RootLayout(), unbounded, metadata, MovementFactPage(), metadata, MovementInventoryPage() (+28 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings, goulash (+16 more)

### Community 5 - "TableNumber"
Cohesion: 0.16
Nodes (23): MetricCell(), RowCell(), TotalsCell(), RowCell(), RowCell(), TotalsCell(), NormDeviationCell(), Pieces() (+15 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (31): This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки, Ввод плана (движение) (+23 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.08
Nodes (69): commitDocumentUpdate(), isMonthKey(), bookOpeningPiecesForProduct(), bookOpeningReferencedProductIds(), buildGroups(), clampSummaryMonth(), closingNormMetrics(), closingStockPieces() (+61 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (79): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+71 more)

### Community 11 - "monthKeyFromDate"
Cohesion: 0.11
Nodes (33): monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), FullscreenToggle(), InventoryScreen(), resolveMonth(), Workspace() (+25 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "SummaryTable.tsx"
Cohesion: 0.12
Nodes (45): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, COLUMN_GROUPS, ColumnKey, COLUMNS, GROUP_END_KEYS, COLUMN_GROUPS (+37 more)

### Community 14 - "ratioRound"
Cohesion: 0.29
Nodes (10): ratioRound(), priceExVatTenThousandths(), profitabilityHundredths(), revenueExVat(), revenueWithVat(), salesPlanLineMetrics, applyPlanScale(), planSide() (+2 more)

### Community 15 - "ProductionJournalFactTable.tsx"
Cohesion: 0.13
Nodes (19): adjacentDay(), ArrowButton(), DayLabel(), dayOfMonth(), ArrowButton(), CategoryBlock(), ColumnKey, COLUMNS (+11 more)

### Community 16 - "DocumentProvider.tsx"
Cohesion: 0.23
Nodes (13): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+5 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.13
Nodes (35): FinishedGoodsReportColumnHeaders(), NORMATIVE_COLUMN_KEYS, MovementPlanTable(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS (+27 more)

### Community 18 - "document.ts"
Cohesion: 0.13
Nodes (14): catalogCategories(), DeletableRecord, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpening, FinishedGoodsOpeningLine, MonthOperatingExpense, PRODUCT_CATEGORIES (+6 more)

### Community 19 - "production-fact.ts"
Cohesion: 0.16
Nodes (27): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), groupVariance(), mergeFactRows(), mergeMonthProductionFacts() (+19 more)

### Community 20 - "PlanningScreen.tsx"
Cohesion: 0.12
Nodes (30): react, metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery() (+22 more)

### Community 21 - "unitCost"
Cohesion: 0.23
Nodes (11): Единицы, costExVat(), costWithVat(), unitCost, amountExVat(), amountWithVat(), ProductionFactRow, ProductionJournalFactRow (+3 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (38): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPlanPage() (+30 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.12
Nodes (33): Удаление, Product, PrototypeDocument, averageAmount(), percentHundredths(), vatPercentHundredths(), dayGridProducts(), periodGridCategories() (+25 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (16): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+8 more)

### Community 25 - "SummaryHeadlineTable.tsx"
Cohesion: 0.25
Nodes (13): ProductName(), ProductRow(), RowCell(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS (+5 more)

### Community 26 - "production-plan.ts"
Cohesion: 0.17
Nodes (25): ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+17 more)

### Community 27 - "sales-plan.ts"
Cohesion: 0.22
Nodes (20): activeProducts(), activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan() (+12 more)

### Community 28 - "sales/text.ts"
Cohesion: 0.24
Nodes (11): SalesPlanRejection, OperatingExpenseRejection, productionFactPageTitle(), summaryPageTitle(), daysPhrase(), formatMonth(), formatMonthName(), formatMonthNameGenitive() (+3 more)

### Community 29 - "SummaryScreen.tsx"
Cohesion: 0.17
Nodes (23): metadata, ProductionPage(), activeCategories(), ensureRangeIncludesMonth(), normalizeMonthRange(), SummaryLens, FullscreenToggle(), planningHref() (+15 more)

### Community 33 - "InventoryTable.tsx"
Cohesion: 0.12
Nodes (27): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), ProductRow(), visibleDayRows() (+19 more)

### Community 34 - "production-journal.ts"
Cohesion: 0.16
Nodes (25): ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLineCost(), lineRejection(), productionEntryByIdOrNull() (+17 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.16
Nodes (18): metadata, ProductionFactPage(), useDocumentStore(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), ProductionJournalFactView (+10 more)

### Community 39 - "PageFrame"
Cohesion: 0.16
Nodes (15): nextConfig, next, Home(), metadata, metadata, PlanPage(), metadata, QuestionsPage() (+7 more)

### Community 41 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.13
Nodes (27): isOccurredOn(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), FinishedGoodsFactScreen(), FullscreenToggle(), mondayLeadForMonth(), resolveDay() (+19 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 50 - "Инвентаризация"
Cohesion: 0.67
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 51 - "Ввод плана движения"
Cohesion: 0.67
Nodes (3): Ввод плана движения, Колонки, Что пишется

### Community 52 - "Ввод производства"
Cohesion: 0.67
Nodes (3): Ввод производства, Сетка записи, Список

### Community 53 - "Ввод плана производства"
Cohesion: 0.67
Nodes (3): Ввод плана производства, Колонки строки товара, Что пишется

### Community 54 - "Ввод продаж"
Cohesion: 0.67
Nodes (3): Ввод продаж, Сетка записи, Список

### Community 55 - "Ввод плана продаж"
Cohesion: 0.67
Nodes (3): Ввод плана продаж, Колонки строки товара, Что пишется

### Community 56 - "Отчет общий продаж"
Cohesion: 0.67
Nodes (3): Верхний блок, Отчет общий продаж, Сетка

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 275 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Архитектура прототипа` connect `Предметная область` to `unitCost`, `sales-fact.ts`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09608843537414966 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PlanningScreen.tsx` to `InventoryTable.tsx`, `ProductionEntryFormTable.tsx`, `AppShell.tsx`, `ProductionJournalFactScreen.tsx`, `TableNumber`, `PageFrame`, `package.json`, `FinishedGoodsFactScreen.tsx`, `SaleScreen.tsx`, `monthKeyFromDate`, `SummaryTable.tsx`, `ProductionJournalFactTable.tsx`, `DocumentProvider.tsx`, `ProductionFactTable.tsx`, `ProductionEntryScreen.tsx`, `SummaryScreen.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `ProductionEntryFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10144927536231885 - nodes in this community are weakly interconnected._
- **Why does `next` connect `PageFrame` to `AppShell.tsx`, `ProductionJournalFactScreen.tsx`, `package.json`, `FinishedGoodsFactScreen.tsx`, `SaleScreen.tsx`, `monthKeyFromDate`, `PlanningScreen.tsx`, `ProductionEntryScreen.tsx`, `SummaryScreen.tsx`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Should `AppShell.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07030527289546716 - nodes in this community are weakly interconnected._