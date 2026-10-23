# Graph Report - food-proto  (2026-10-23)

## Corpus Check
- 173 files · ~100,928 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1613 nodes · 5952 edges · 62 communities (55 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `971769e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
- monthKeyFromDate
- mock-document.ts
- MaterialReceiptFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- FinishedProductEditScreen.tsx
- DerivativeCreateScreen.tsx
- compilerOptions
- index.ts
- AppShell.tsx
- SaleScreen.tsx
- Icons.tsx
- ProductionFactTable.tsx
- document.ts
- materials.ts
- FinishedGoodsMonthScreen.tsx
- Workspace
- FinishedGoodsFactScreen.tsx
- sales-fact.ts
- Флоу товара
- SalesJournalScreen.tsx
- use-materials.ts
- sales-plan.ts
- SummaryTable.tsx
- movement-plan.ts
- MaterialDocumentScreen.tsx
- FinishedGoodsMonthTable.tsx
- MaterialsNormsScreen.tsx
- production-fact.ts
- ColumnLabel
- PageFrame
- ProductionJournalFactScreen.tsx
- setFinishedGoodsOpeningRejection
- production-plan.ts
- materials/text.ts
- DocumentProvider.tsx
- Отчет общий сырья
- RecipeJournalsTable.tsx
- postcss.config.mjs
- recipes/paths.ts
- recipes/new/page.tsx
- Отчет общий движения
- ProductionPlanTable.tsx
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
- next

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

## Communities (62 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.10
Nodes (43): unitCost, PROFIT_TAX_PERCENT, SalesPlan, percentHundredths(), vatPercentHundredths(), ProductionJournalFactRow, SalesFactRow, planPhase (+35 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (60): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPage() (+52 more)

### Community 2 - "products.ts"
Cohesion: 0.08
Nodes (51): Home(), metadata, metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+43 more)

### Community 3 - "monthKeyFromDate"
Cohesion: 0.11
Nodes (30): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), activeCategories(), monthKeyFromDate(), planMonthOpen(), resolveMonth() (+22 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (59): MATERIAL_GROUPS, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+51 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (35): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+27 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.15
Nodes (36): FinishedGoodsOpeningLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics() (+28 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "FinishedProductEditScreen.tsx"
Cohesion: 0.12
Nodes (31): FinishedProductRecipePage(), metadata, ProductRecipeLine, save(), lineAmountWithVat(), quantityForAmount(), rowMetrics(), commit() (+23 more)

### Community 11 - "DerivativeCreateScreen.tsx"
Cohesion: 0.14
Nodes (28): DerivativePage(), metadata, activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection (+20 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.08
Nodes (60): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+52 more)

### Community 14 - "AppShell.tsx"
Cohesion: 0.06
Nodes (43): metadata, onest, RootLayout(), unbounded, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata (+35 more)

### Community 15 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (74): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+66 more)

### Community 16 - "Icons.tsx"
Cohesion: 0.12
Nodes (32): SalesPlanRejection, OperatingExpenseRejection, FullscreenToggle(), FullscreenToggle(), productionFactHref(), FullscreenToggle(), productionFactPageTitle(), ProductionFactScreen() (+24 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 18 - "document.ts"
Cohesion: 0.08
Nodes (34): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+26 more)

### Community 19 - "materials.ts"
Cohesion: 0.09
Nodes (45): costExVat(), MATERIAL_UNITS, MaterialGroupId, MaterialOpeningLine, MaterialReceiptLine, MaterialWarehouseId, addMoney(), addMoneyNullable() (+37 more)

### Community 20 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.18
Nodes (18): metadata, MovementFactPage(), metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsFactScreen() (+10 more)

### Community 21 - "Workspace"
Cohesion: 0.27
Nodes (13): Единицы, actualRangeSummary(), calendarDays(), ensureRangeIncludesMonth(), factOperatingExpenseStoredFromInput(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange() (+5 more)

### Community 22 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.14
Nodes (25): defaultSalesFactDay(), monthDates(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+17 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.12
Nodes (30): Удаление, Product, dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds(), productionFactGridProducts(), dayTotals() (+22 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SalesJournalScreen.tsx"
Cohesion: 0.15
Nodes (24): useDocumentStore(), productionEntryPieces(), workingProductionEntriesInMonth(), shiftMonth(), saleTotals, workingSalesInMonth(), lastHorizonMonth(), productionEntryHref() (+16 more)

### Community 26 - "use-materials.ts"
Cohesion: 0.17
Nodes (28): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice() (+20 more)

### Community 27 - "sales-plan.ts"
Cohesion: 0.14
Nodes (30): costWithVat(), amountExVat(), amountWithVat(), ratioRound(), productionPlanLineMetrics, activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection() (+22 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.16
Nodes (35): TotalCell(), ProductUnitPrice(), ProductionPlanTable(), TotalsCell(), AverageCost(), Pieces(), RowCell(), TotalCell() (+27 more)

### Community 29 - "movement-plan.ts"
Cohesion: 0.16
Nodes (25): FinishedGoodsNormLine, FinishedGoodsOpeningRejection, hasStoredInventoryLine(), storedInventoryPiecesForProduct(), buildRow(), emptyNormLine(), emptyTotals(), FinishedGoodsNormField (+17 more)

### Community 30 - "MaterialDocumentScreen.tsx"
Cohesion: 0.23
Nodes (14): metadata, NewMaterialReceiptPage(), activeMaterials(), materialReceiptById(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), setLine() (+6 more)

### Community 31 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (42): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell() (+34 more)

### Community 32 - "MaterialsNormsScreen.tsx"
Cohesion: 0.36
Nodes (7): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 34 - "ColumnLabel"
Cohesion: 0.12
Nodes (24): OperatingExpenseSide, FINISHED_GOODS_CLOSING_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders(), ReportSubBannerGroup (+16 more)

### Community 35 - "PageFrame"
Cohesion: 0.15
Nodes (22): react, metadata, QuestionsPage(), MATERIAL_WAREHOUSES, deletedMaterials(), materialMovementMonth, materialReceiptsInMonth(), MaterialJournalScreen() (+14 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.18
Nodes (15): metadata, ProductionFactPage(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth() (+7 more)

### Community 37 - "setFinishedGoodsOpeningRejection"
Cohesion: 0.33
Nodes (6): finishedGoodsOpeningsList(), isOpeningPieces(), openingReferencedProductIds(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), workingFinishedGoodsOpening()

### Community 39 - "production-plan.ts"
Cohesion: 0.12
Nodes (33): ProductionPlan, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+25 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.17
Nodes (11): MaterialWeightPair, MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR (+3 more)

### Community 41 - "DocumentProvider.tsx"
Cohesion: 0.18
Nodes (18): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+10 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RecipeJournalsTable.tsx"
Cohesion: 0.31
Nodes (9): componentLabel(), CompositionLine(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection, SectionBlock() (+1 more)

### Community 45 - "recipes/paths.ts"
Cohesion: 0.18
Nodes (18): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), derivativeCompositionLines(), derivativeSections(), productCompositionLines(), productRecipeSections() (+10 more)

### Community 46 - "recipes/new/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, NewDerivativePage(), DerivativeCreateScreen(), NEW_DERIVATIVE_TITLE

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 49 - "ProductionPlanTable.tsx"
Cohesion: 0.10
Nodes (43): MaterialUnit, MaterialMovementRow, MaterialMovementTotals, MaterialPlanField, MaterialNormDeviation(), COLUMNS, MaterialsInventoryTable(), ColumnKey (+35 more)

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

### Community 66 - "next"
Cohesion: 0.11
Nodes (29): nextConfig, next, metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts() (+21 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 356 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `PageFrame` to `ProductionEntryScreen.tsx`, `products.ts`, `monthKeyFromDate`, `MaterialReceiptFormTable.tsx`, `package.json`, `FinishedProductEditScreen.tsx`, `DerivativeCreateScreen.tsx`, `index.ts`, `AppShell.tsx`, `SaleScreen.tsx`, `Icons.tsx`, `ProductionFactTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesJournalScreen.tsx`, `SummaryTable.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `ColumnLabel`, `ProductionJournalFactScreen.tsx`, `production-plan.ts`, `DocumentProvider.tsx`, `RecipeJournalsTable.tsx`, `ProductionPlanTable.tsx`, `next`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09696969696969697 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `products.ts`, `monthKeyFromDate`, `package.json`, `FinishedProductEditScreen.tsx`, `DerivativeCreateScreen.tsx`, `AppShell.tsx`, `SaleScreen.tsx`, `Icons.tsx`, `FinishedGoodsMonthScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesJournalScreen.tsx`, `MaterialDocumentScreen.tsx`, `MaterialsNormsScreen.tsx`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `production-plan.ts`, `RecipeJournalsTable.tsx`, `recipes/paths.ts`, `recipes/new/page.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0635814889336016 - nodes in this community are weakly interconnected._
- **Why does `Архитектура прототипа` connect `Предметная область` to `Workspace`, `sales-fact.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08182349503214495 - nodes in this community are weakly interconnected._