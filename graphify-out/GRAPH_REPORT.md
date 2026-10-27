# Graph Report - food-proto  (2026-10-27)

## Corpus Check
- 193 files · ~115,994 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1812 nodes · 6803 edges · 77 communities (70 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `680243bf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- MaterialsSummaryTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- use-materials.ts
- derivatives.ts
- compilerOptions
- DerivativeForm
- keepWithNext
- monthKeyFromDate
- DerivativeMovementInventoryScreen.tsx
- Icons.tsx
- mock-materials.ts
- materials.ts
- MaterialReceiptFormTable.tsx
- ratioRound
- production-plan.ts
- sales-fact.ts
- Флоу товара
- SummaryTable.tsx
- index.ts
- production-journal.ts
- MovementPlanTable.tsx
- useDocumentStore
- ProductionJournalFactScreen.tsx
- MaterialJournalScreen.tsx
- movement-plan.ts
- production-fact.ts
- DerivativesScreen.tsx
- MaterialsPlanScreen.tsx
- DerivativeFormTable.tsx
- SaleScreen.tsx
- FinishedProductsScreen.tsx
- sales/text.ts
- AppShell.tsx
- Отчет общий сырья
- next
- postcss.config.mjs
- use-derivative-movement.ts
- PageFrame
- Отчет общий движения
- DocumentProvider.tsx
- DerivativeCreateScreen.tsx
- Инвентаризация
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- isOccurredOn
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- FinishedProductEditScreen.tsx
- Отчет общий движения производных
- DerivativeMovementSummaryScreen.tsx
- MaterialDocumentScreen.tsx
- FinishedGoodsFactScreen.tsx
- RecipeJournalsTable.tsx
- MaterialsNormsScreen
- FinishedGoodsMonthTable.tsx
- materials/paths.ts
- planMonthOpen
- Отчет подневный производства
- migrate-document.ts
- sales.ts
- DerivativeCompositionEditor
- document.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 76 edges
2. `PageFrame()` - 67 edges
3. `next` - 66 edges
4. `planMonthOpen()` - 59 edges
5. `keepWithNext()` - 59 edges
6. `react` - 58 edges
7. `VatMoneyCell()` - 49 edges
8. `DerivativeForm()` - 45 edges
9. `IconChevronDown()` - 43 edges
10. `IconChevronRight()` - 42 edges

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
- 3-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/recipe-consumption.ts -> src/domain/derivatives.ts`
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (77 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (39): SalesPlan, percentHundredths(), vatPercentHundredths(), maxSaleOccurredOn(), daysInMonth(), salesPlanLineMetrics, salesPlanTotals, applyFactScale() (+31 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.13
Nodes (25): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), defaultProductionEntryDay(), productionLineAmountWithVat(), NEW_PRODUCTION_ENTRY_TITLE, PRODUCTION_JOURNAL_TITLE (+17 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.06
Nodes (87): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+79 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.13
Nodes (28): buildRow(), costForQuantity(), derivativeConsumptionPrice(), DerivativeMovementMonthView, derivativeNormMetrics(), derivativeOpeningsList(), derivativePriceInternal(), factConsumptionQuantityForDerivative() (+20 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.08
Nodes (58): costWithVat(), DerivativeMovementRow, DerivativeMovementSection, MaterialMovementRow, MaterialMovementTotals, DerivativeRow(), COLUMN_KIND, ColumnKey (+50 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (38): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+30 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.13
Nodes (40): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+32 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.18
Nodes (27): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+19 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.14
Nodes (25): activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById() (+17 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.11
Nodes (37): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm() (+29 more)

### Community 14 - "keepWithNext"
Cohesion: 0.15
Nodes (35): RowCell(), TotalsCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell() (+27 more)

### Community 15 - "monthKeyFromDate"
Cohesion: 0.16
Nodes (32): Единицы, activeCategories(), monthKeyFromDate(), planPhase, actualRangeSummary(), calendarDays(), displayedOperatingExpense(), elapsedDaysInMonth() (+24 more)

### Community 16 - "DerivativeMovementInventoryScreen.tsx"
Cohesion: 0.24
Nodes (10): DerivativeMovementInventoryPage(), metadata, DerivativeMovementInventoryScreen(), DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE, DERIVATIVE_MOVEMENT_SUMMARY_HREF (+2 more)

### Community 17 - "Icons.tsx"
Cohesion: 0.10
Nodes (31): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FullscreenToggle(), FullscreenToggle(), InventoryScreen(), resolveMonth() (+23 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.12
Nodes (22): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+14 more)

### Community 19 - "materials.ts"
Cohesion: 0.09
Nodes (46): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+38 more)

### Community 20 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (41): react, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+33 more)

### Community 21 - "ratioRound"
Cohesion: 0.17
Nodes (21): plannedProductionVolumePieces(), priceAverage(), rangePlanProduction(), rangePlanSales(), targetClosingPiecesFromNorm(), amountExVat(), ratioRound(), productSide() (+13 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.11
Nodes (32): Удаление, unitCost, Product, amountWithVat(), averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+24 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (46): OperatingExpenseSide, TotalCell(), TotalCell(), RowCell(), TotalCell(), Pieces(), RowCell(), headlineKind() (+38 more)

### Community 26 - "index.ts"
Cohesion: 0.08
Nodes (63): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+55 more)

### Community 27 - "production-journal.ts"
Cohesion: 0.27
Nodes (16): ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection() (+8 more)

### Community 28 - "MovementPlanTable.tsx"
Cohesion: 0.11
Nodes (37): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, DerivativeMovementInventoryTable(), WorkshopBlock(), GroupBlock(), SectionBlock(), CategoryBlock() (+29 more)

### Community 29 - "useDocumentStore"
Cohesion: 0.15
Nodes (23): metadata, SalesJournalPage(), metadata, SalesFactPage(), useDocumentStore(), saleTotals, workingSalesInMonth(), parseSalesFactQuery() (+15 more)

### Community 30 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.12
Nodes (28): metadata, ProductionFactPage(), metadata, ProductionPage(), recommendedDayKey(), recommendedVolumeByDay(), defaultProductionJournalFactDay(), productionJournalFactGridProducts() (+20 more)

### Community 31 - "MaterialJournalScreen.tsx"
Cohesion: 0.23
Nodes (11): MaterialReceiptPage(), metadata, MaterialReceiptsPage(), metadata, materialById(), materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref() (+3 more)

### Community 32 - "movement-plan.ts"
Cohesion: 0.15
Nodes (26): FinishedGoodsNormLine, FinishedGoodsOpeningRejection, hasStoredInventoryLine(), isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), buildRow(), emptyNormLine() (+18 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.13
Nodes (30): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+22 more)

### Community 34 - "DerivativesScreen.tsx"
Cohesion: 0.28
Nodes (11): metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes(), derivativeSections(), outputPieceThousandthsOf(), DerivativesScreen() (+3 more)

### Community 35 - "MaterialsPlanScreen.tsx"
Cohesion: 0.15
Nodes (14): MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialWeightPair, MaterialDocumentRejection, MaterialGroupMovement, MaterialNormRejection, MaterialOpeningRejection (+6 more)

### Community 36 - "DerivativeFormTable.tsx"
Cohesion: 0.10
Nodes (25): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS (+17 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.15
Nodes (31): saleLineAmountWithVat(), saleLinePriceWithVat(), formatRubles(), fromRubles(), fromRublesUpTo(), parseDecimal(), roundKopecksToRubles(), emptySaleLineDraft() (+23 more)

### Community 39 - "FinishedProductsScreen.tsx"
Cohesion: 0.18
Nodes (13): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductEditScreen(), FinishedProductsScreen() (+5 more)

### Community 40 - "sales/text.ts"
Cohesion: 0.14
Nodes (21): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), SalesPlanRejection, OperatingExpenseRejection, FinishedGoodsMonthScreen() (+13 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.11
Nodes (22): metadata, onest, RootLayout(), unbounded, RECIPES_SECTION_TITLE, AppShell(), currentNavLabel(), DERIVATIVE_MOVEMENT_NAV (+14 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "next"
Cohesion: 0.23
Nodes (9): nextConfig, next, DerivativeMovementPlanPage(), metadata, DerivativeNormField, DerivativeMovementPlanScreen(), DERIVATIVE_MOVEMENT_PLAN_TITLE, derivativeMovementPlanHref() (+1 more)

### Community 45 - "use-derivative-movement.ts"
Cohesion: 0.26
Nodes (11): DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection, normForMonth(), setDerivativeNorm(), setDerivativeNormRejection(), setDerivativeOpening(), setDerivativeOpeningRejection() (+3 more)

### Community 46 - "PageFrame"
Cohesion: 0.18
Nodes (12): Home(), metadata, metadata, PlanPage(), metadata, QuestionsPage(), ProductionPlaceholderScreen(), parseSummaryQuery() (+4 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (13): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+5 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.21
Nodes (13): DerivativePage(), metadata, metadata, NewDerivativePage(), isDerivativeWorkshopId(), DERIVATIVE_WORKSHOPS, DerivativeCreateScreen(), DerivativeEditScreen() (+5 more)

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

### Community 58 - "isOccurredOn"
Cohesion: 0.24
Nodes (9): metadata, SalePage(), metadata, NewSalePage(), isOccurredOn(), occurredOnOpen(), defaultSaleDay(), NEW_SALE_TITLE (+1 more)

### Community 62 - "FinishedProductEditScreen.tsx"
Cohesion: 0.19
Nodes (23): ProductRecipeLine, ProductRecipeRejection, applyHeatTreatmentYield(), recipeComponentsKilogramThousandths(), formatQuantity(), componentDraftKey(), DerivativeLineDraft, draftsFromLines() (+15 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.15
Nodes (10): Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется, Остаток на конец, Остаток на начало (+2 more)

### Community 64 - "DerivativeMovementSummaryScreen.tsx"
Cohesion: 0.31
Nodes (9): DerivativeMovementPage(), metadata, derivativeMovementMonth(), sumMoney(), DerivativeMovementSummaryScreen(), DerivativeMovementSummaryTable(), DERIVATIVE_MOVEMENT_SUMMARY_TITLE, derivativeMovementSummaryHref() (+1 more)

### Community 65 - "MaterialDocumentScreen.tsx"
Cohesion: 0.18
Nodes (19): metadata, NewMaterialReceiptPage(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save() (+11 more)

### Community 66 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.11
Nodes (30): metadata, MovementFactPage(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth() (+22 more)

### Community 67 - "RecipeJournalsTable.tsx"
Cohesion: 0.20
Nodes (15): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+7 more)

### Community 68 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 69 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.23
Nodes (12): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+4 more)

### Community 70 - "materials/paths.ts"
Cohesion: 0.12
Nodes (23): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, resolveMaterialMonth(), MaterialsInventoryScreen() (+15 more)

### Community 71 - "planMonthOpen"
Cohesion: 0.10
Nodes (34): metadata, ProductionJournalPage(), metadata, ProductionPlanPage(), ProductionEntry, productionEntryPieces(), workingProductionEntriesInMonth(), missingProductionPlanProducts() (+26 more)

### Community 74 - "migrate-document.ts"
Cohesion: 0.33
Nodes (6): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, MaterialUnit, SCHEMA_VERSION

### Community 75 - "sales.ts"
Cohesion: 0.30
Nodes (15): SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales(), saleById() (+7 more)

### Community 76 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 78 - "document.ts"
Cohesion: 0.12
Nodes (18): catalogCategories(), DeletableRecord, Derivative, FinishedGoodsNorm, FinishedGoodsOpeningLine, Material, MaterialMonthPlan, MaterialOpeningLine (+10 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `package.json`, `monthKeyFromDate`, `DerivativeMovementInventoryScreen.tsx`, `Icons.tsx`, `useDocumentStore`, `ProductionJournalFactScreen.tsx`, `MaterialJournalScreen.tsx`, `DerivativesScreen.tsx`, `MaterialsPlanScreen.tsx`, `SaleScreen.tsx`, `FinishedProductsScreen.tsx`, `sales/text.ts`, `AppShell.tsx`, `PageFrame`, `DerivativeCreateScreen.tsx`, `isOccurredOn`, `FinishedProductEditScreen.tsx`, `DerivativeMovementSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialsNormsScreen`, `materials/paths.ts`, `planMonthOpen`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11341463414634147 - nodes in this community are weakly interconnected._
- **Why does `react` connect `MaterialReceiptFormTable.tsx` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `MaterialsSummaryTable.tsx`, `package.json`, `keepWithNext`, `monthKeyFromDate`, `DerivativeMovementInventoryScreen.tsx`, `Icons.tsx`, `SummaryTable.tsx`, `index.ts`, `MovementPlanTable.tsx`, `useDocumentStore`, `ProductionJournalFactScreen.tsx`, `MaterialJournalScreen.tsx`, `MaterialsPlanScreen.tsx`, `DerivativeFormTable.tsx`, `SaleScreen.tsx`, `sales/text.ts`, `AppShell.tsx`, `next`, `PageFrame`, `DocumentProvider.tsx`, `DerivativeCreateScreen.tsx`, `FinishedProductEditScreen.tsx`, `DerivativeMovementSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `FinishedGoodsMonthTable.tsx`, `materials/paths.ts`, `planMonthOpen`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1310344827586207 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `ratioRound` to `production-fact.ts`, `derivative-movement.ts`, `finished-goods.ts`, `monthKeyFromDate`, `materials.ts`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.056070913213770356 - nodes in this community are weakly interconnected._