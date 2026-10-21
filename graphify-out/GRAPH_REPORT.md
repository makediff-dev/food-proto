# Graph Report - food-proto  (2026-10-21)

## Corpus Check
- 155 files · ~92,962 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1459 nodes · 5316 edges · 57 communities (50 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c872310`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- MaterialReceiptFormTable.tsx
- sales-plan.ts
- movement-plan.ts
- mock-document.ts
- keepWithNext
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- monthKeyFromDate
- compilerOptions
- index.ts
- PageFrame
- FinishedGoodsMonthTable.tsx
- SummaryScreen.tsx
- ProductionFactTable.tsx
- mock-materials.ts
- use-materials.ts
- sales/text.ts
- materials.ts
- ProductionEntryScreen.tsx
- sales-fact.ts
- Флоу товара
- SummaryTable.tsx
- AppShell.tsx
- document.ts
- MaterialJournalScreen.tsx
- MaterialsNormsScreen.tsx
- MaterialDocumentScreen.tsx
- Единицы
- production-fact.ts
- DocumentProvider.tsx
- ProductionJournalFactScreen.tsx
- production-plan.ts
- materials/text.ts
- FinishedGoodsFactScreen.tsx
- Отчет общий сырья
- postcss.config.mjs
- amountExVat
- Отчет общий движения
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
- Icons.tsx

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
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Единицы` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Единицы` --references--> `productionFactForLens()`  [INFERRED]
  docs/architecture.md → src/domain/production-fact.ts

## Import Cycles
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (57 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.12
Nodes (39): SalesPlan, averageAmount(), percentHundredths(), ratioRound(), vatPercentHundredths(), dayTotals(), rowMetrics(), salesPlanTotals (+31 more)

### Community 1 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (50): react, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+42 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.05
Nodes (87): nextConfig, next, Home(), metadata, metadata, PlanningArchivePage(), metadata, PlanningPage() (+79 more)

### Community 3 - "movement-plan.ts"
Cohesion: 0.14
Nodes (29): commitDocumentUpdate(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingReferencedProductIds(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+21 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.08
Nodes (22): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+14 more)

### Community 5 - "keepWithNext"
Cohesion: 0.12
Nodes (39): ProductUnitPrice(), CategoryBlock(), Pieces(), ProductionJournalFactTable(), ProductRow(), RowCell(), TotalCell(), visibleDayRows() (+31 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (34): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+26 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.14
Nodes (36): LEGACY_OPENING_SCHEMA, migrateDocument(), FinishedGoodsOpening, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups() (+28 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (63): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+55 more)

### Community 11 - "monthKeyFromDate"
Cohesion: 0.19
Nodes (21): activeCategories(), maxSaleOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), MaterialMonthBar(), InventoryScreen() (+13 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.10
Nodes (60): MaterialMovementRow, MaterialMovementTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), COLUMNS, ColumnKey (+52 more)

### Community 14 - "PageFrame"
Cohesion: 0.09
Nodes (33): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, metadata, QuestionsPage() (+25 more)

### Community 15 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (40): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, ArrowButton(), CategoryBlock(), DayLabel(), dayOfMonth(), FinishedGoodsFactTable() (+32 more)

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.20
Nodes (22): recommendedVolumePiecesForMonths(), ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref(), productionFactPageTitle() (+14 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.12
Nodes (15): defaultMax(), LineOverride, materialNorms, materialPlan(), materials, mockMaterials, priceWithVat, q() (+7 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.21
Nodes (22): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isVatPercent(), materialById(), materialNameRejection (+14 more)

### Community 20 - "sales/text.ts"
Cohesion: 0.11
Nodes (26): SalesPlanRejection, OperatingExpenseRejection, OperatingExpenseSide, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal() (+18 more)

### Community 21 - "materials.ts"
Cohesion: 0.10
Nodes (40): MaterialReceiptLine, MaterialWarehouseId, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+32 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (69): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+61 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.12
Nodes (28): Удаление, Product, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds() (+20 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.18
Nodes (19): CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), GridText(), PLAN_ASSIGNED, planColumnKind(), ProductRow() (+11 more)

### Community 26 - "AppShell.tsx"
Cohesion: 0.06
Nodes (46): metadata, onest, RootLayout(), unbounded, metadata, MovementFactPage(), metadata, MovementInventoryPage() (+38 more)

### Community 27 - "document.ts"
Cohesion: 0.12
Nodes (17): catalogCategories(), DeletableRecord, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpeningLine, Material, MATERIAL_GROUPS, MATERIAL_UNITS (+9 more)

### Community 28 - "MaterialJournalScreen.tsx"
Cohesion: 0.26
Nodes (10): MaterialReceiptsPage(), metadata, MATERIAL_WAREHOUSES, materialReceiptsInMonth(), ProductionEntryRejection, MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref() (+2 more)

### Community 29 - "MaterialsNormsScreen.tsx"
Cohesion: 0.33
Nodes (8): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, activeMaterials(), materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (26): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), occurredOnOpen() (+18 more)

### Community 31 - "Единицы"
Cohesion: 0.39
Nodes (8): Единицы, costWithVat(), amountWithVat(), priceWithVatFromExVat(), actualRangeSummary(), calendarDays(), rangeSummary(), summaryForLens()

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.23
Nodes (14): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+6 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.17
Nodes (19): useDocumentStore(), recommendedDayKey(), recommendedVolumeByDay(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactHref(), DayDateControl(), onKeyDown() (+11 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.12
Nodes (31): ProductionPlan, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+23 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.18
Nodes (10): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NORM_ERROR (+2 more)

### Community 41 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.12
Nodes (32): isOccurredOn(), defaultProductionEntryDay(), defaultSaleDay(), defaultSalesFactDay(), monthDates(), salesFactGridProducts(), salesFactMonth(), DayDateControl() (+24 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 45 - "amountExVat"
Cohesion: 0.20
Nodes (14): costExVat(), unitCost, amountExVat(), productSide(), productionPlanLineMetrics, SalesFactRow, priceExVatTenThousandths(), profitabilityHundredths() (+6 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 49 - "MaterialsSummaryTable.tsx"
Cohesion: 0.12
Nodes (27): MaterialNormDeviation(), PlanCell(), PlanTotal(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, consumptionEditable() (+19 more)

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

### Community 63 - "Icons.tsx"
Cohesion: 0.26
Nodes (14): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), Glyph() (+6 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 332 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `MaterialReceiptFormTable.tsx` to `sales-plan.ts`, `keepWithNext`, `package.json`, `SaleScreen.tsx`, `monthKeyFromDate`, `index.ts`, `PageFrame`, `FinishedGoodsMonthTable.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `ProductionEntryScreen.tsx`, `SummaryTable.tsx`, `AppShell.tsx`, `MaterialJournalScreen.tsx`, `MaterialDocumentScreen.tsx`, `DocumentProvider.tsx`, `ProductionJournalFactScreen.tsx`, `production-plan.ts`, `FinishedGoodsFactScreen.tsx`, `MaterialsSummaryTable.tsx`, `Icons.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11962833914053426 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `production-fact.ts`, `production-plan.ts`, `amountExVat`, `Ввод плана (производство)`, `Единицы`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `MaterialReceiptFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08166969147005444 - nodes in this community are weakly interconnected._
- **Why does `Что пишется` connect `Ввод плана (производство)` to `finished-goods.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050853548966756514 - nodes in this community are weakly interconnected._