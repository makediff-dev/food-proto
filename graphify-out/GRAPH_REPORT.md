# Graph Report - food-proto  (2026-10-27)

## Corpus Check
- 192 files · ~115,663 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1809 nodes · 6778 edges · 81 communities (73 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c8a3a4eb`
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
- FinishedProductEditScreen.tsx
- keepWithNext
- monthKeyFromDate
- DerivativeMovementInventoryScreen.tsx
- ProductionPlanScreen.tsx
- document.ts
- materials.ts
- MaterialReceiptFormTable.tsx
- production-journal-fact.ts
- production-plan.ts
- sales-fact.ts
- Флоу товара
- SummaryTable.tsx
- SalesFactTable.tsx
- PlanningScreen.tsx
- MovementPlanTable.tsx
- SalesJournalScreen.tsx
- ProductionJournalFactScreen.tsx
- Архитектура прототипа
- movement-plan.ts
- production-fact.ts
- useDocumentStore
- materials/text.ts
- FinishedGoodsNormativeColumnHeading.tsx
- SaleScreen.tsx
- flow.md
- formatQuantity
- FinishedGoodsMonthScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- DerivativeMovementPlanScreen.tsx
- postcss.config.mjs
- sales-fact/text.ts
- next
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
- SaleScreen
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- recipe-yield.ts
- Отчет общий движения производных
- ColumnLabel
- MaterialDocumentScreen.tsx
- FinishedGoodsFactScreen.tsx
- RecipePrint.tsx
- PageFrame
- index.ts
- MaterialsPlanScreen.tsx
- planMonthOpen
- Icons.tsx
- AGENTS.md
- migrate-document.ts
- sales.ts
- componentDraftKey
- orderLines
- SaleFormTable.tsx
- MaterialGroupId
- MaterialReceiptLine

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 76 edges
2. `PageFrame()` - 67 edges
3. `next` - 66 edges
4. `planMonthOpen()` - 59 edges
5. `keepWithNext()` - 59 edges
6. `react` - 58 edges
7. `VatMoneyCell()` - 49 edges
8. `DerivativeForm()` - 43 edges
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
- `Единицы` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/recipe-consumption.ts -> src/domain/derivatives.ts`
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (81 total, 8 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.09
Nodes (47): Единицы, SalesPlan, factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, priceWithVatFromExVat(), profitabilityHundredths() (+39 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.11
Nodes (38): metadata, ProductionEntryPage(), isOccurredOn(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), defaultProductionEntryDay(), deleteProductionEntry() (+30 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.08
Nodes (62): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+54 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (36): buildRow(), costForQuantity(), derivativeConsumptionPrice(), DerivativeMovementMonthView, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+28 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (26): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+18 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.08
Nodes (51): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey (+43 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (26): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение производных (+18 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.12
Nodes (46): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+38 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.19
Nodes (25): addMaterial(), deleteMaterial(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isVatPercent(), materialById() (+17 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.11
Nodes (35): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeByIdOrNull(), derivativeCompositionLines(), DerivativeCompositionLineView (+27 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.10
Nodes (47): FinishedProductRecipePage(), metadata, activeMaterials(), productByIdOrNull(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), commit() (+39 more)

### Community 14 - "keepWithNext"
Cohesion: 0.15
Nodes (37): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+29 more)

### Community 15 - "monthKeyFromDate"
Cohesion: 0.09
Nodes (35): metadata, NewProductionEntryPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), monthKeyFromDate(), monthsInRange() (+27 more)

### Community 16 - "DerivativeMovementInventoryScreen.tsx"
Cohesion: 0.15
Nodes (19): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, derivativeMovementMonth(), sumMoney(), DerivativeMovementInventoryScreen(), DerivativeMovementSummaryScreen() (+11 more)

### Community 17 - "ProductionPlanScreen.tsx"
Cohesion: 0.15
Nodes (25): activeCategories(), missingProductionPlanProducts(), activeProducts(), shiftMonth(), lastHorizonMonth(), FullscreenToggle(), FullscreenToggle(), Workspace() (+17 more)

### Community 18 - "document.ts"
Cohesion: 0.07
Nodes (42): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+34 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (41): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials(), deleteMaterialReceipt() (+33 more)

### Community 20 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (46): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+38 more)

### Community 21 - "production-journal-fact.ts"
Cohesion: 0.14
Nodes (21): Удаление, Product, finishedGoodsGridProducts(), finishedGoodsOpeningsList(), openingReferencedProductIds(), workingFinishedGoodsOpening(), dayGridProducts(), periodGridCategories() (+13 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.15
Nodes (22): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+14 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.15
Nodes (26): unitCost, PrototypeDocument, amountExVat(), amountWithVat(), averageAmount(), percentHundredths(), ratioRound(), vatPercentHundredths() (+18 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.16
Nodes (23): costWithVat(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), PLAN_ASSIGNED, PlanCell(), planColumnKind() (+15 more)

### Community 26 - "SalesFactTable.tsx"
Cohesion: 0.09
Nodes (41): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS (+33 more)

### Community 27 - "PlanningScreen.tsx"
Cohesion: 0.15
Nodes (22): metadata, PlanningPage(), missingPlanProducts(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), planningHref(), AddCategoryDialog() (+14 more)

### Community 28 - "MovementPlanTable.tsx"
Cohesion: 0.12
Nodes (32): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), FinishedGoodsMonthTable(), groupEndClass(), ProductRow(), RowCell() (+24 more)

### Community 29 - "SalesJournalScreen.tsx"
Cohesion: 0.17
Nodes (20): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, workingSalesInMonth(), parseSalesFactQuery(), parseSalesJournalQuery() (+12 more)

### Community 30 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (18): metadata, ProductionFactPage(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), ProductionJournalFactView, DayDateControl() (+10 more)

### Community 31 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 32 - "movement-plan.ts"
Cohesion: 0.17
Nodes (24): closingInventoryDeviationPieces(), hasStoredInventoryLine(), openingDeviationPieces(), storedInventoryPiecesForProduct(), buildRow(), emptyNormLine(), emptyTotals(), FinishedGoodsNormRejection (+16 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.13
Nodes (32): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+24 more)

### Community 34 - "useDocumentStore"
Cohesion: 0.35
Nodes (10): commitDocumentUpdate(), useDocumentStore(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), openPlan() (+2 more)

### Community 35 - "materials/text.ts"
Cohesion: 0.14
Nodes (16): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, MaterialDocumentRejection, materialNormQuantity(), MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection (+8 more)

### Community 36 - "FinishedGoodsNormativeColumnHeading.tsx"
Cohesion: 0.15
Nodes (14): FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS (+6 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.27
Nodes (19): saleLineAmountWithVat(), saleLinePriceWithVat(), emptySaleLineDraft(), rowMetrics(), initialDrafts(), lineDraftFromSale(), SaleForm(), parsedLines() (+11 more)

### Community 39 - "formatQuantity"
Cohesion: 0.18
Nodes (16): metadata, RecipeFinishedPage(), DerivativeAddRejection, productCompositionLines(), productRecipeSections(), formatQuantity(), FinishedProductsScreen(), finishedProductHref() (+8 more)

### Community 40 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.13
Nodes (24): metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage(), clampSummaryMonth(), lastSummaryMonth() (+16 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.10
Nodes (23): metadata, onest, RootLayout(), unbounded, MOVEMENT_SECTION_TITLE, SALES_SECTION_TITLE, AppShell(), currentNavLabel() (+15 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.29
Nodes (8): DerivativeMovementPlanPage(), metadata, DerivativeNormField, DerivativeMovementPlanScreen(), derivativeNormRangeInvalid(), DERIVATIVE_MOVEMENT_PLAN_TITLE, derivativeMovementPlanHref(), parseDerivativeMovementPlanQuery()

### Community 45 - "sales-fact/text.ts"
Cohesion: 0.26
Nodes (11): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), parseDecimal(), roundKopecksToRubles(), SALE_ERROR, parseMoneyInput() (+3 more)

### Community 46 - "next"
Cohesion: 0.25
Nodes (10): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+2 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (12): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+4 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.21
Nodes (13): DerivativePage(), metadata, metadata, NewDerivativePage(), isDerivativeWorkshopId(), DerivativeCreateScreen(), DerivativeEditScreen(), DerivativeFormEmpty() (+5 more)

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

### Community 58 - "SaleScreen"
Cohesion: 0.24
Nodes (8): metadata, SalePage(), metadata, NewSalePage(), defaultSaleDay(), saleByIdOrNull(), NEW_SALE_TITLE, SaleScreen()

### Community 62 - "recipe-yield.ts"
Cohesion: 0.19
Nodes (15): ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths() (+7 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.15
Nodes (10): Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется, Остаток на конец, Остаток на начало (+2 more)

### Community 64 - "ColumnLabel"
Cohesion: 0.16
Nodes (21): OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SummaryHeadlineTable() (+13 more)

### Community 65 - "MaterialDocumentScreen.tsx"
Cohesion: 0.17
Nodes (19): MaterialReceiptPage(), metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), occurredOnOpen(), maxProductionEntryOccurredOn() (+11 more)

### Community 66 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.10
Nodes (34): metadata, MovementFactPage(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth() (+26 more)

### Community 67 - "RecipePrint.tsx"
Cohesion: 0.14
Nodes (21): react-dom, MATERIAL_WAREHOUSES, DerivativeLineDraft, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable() (+13 more)

### Community 68 - "PageFrame"
Cohesion: 0.39
Nodes (4): metadata, QuestionsPage(), ProductionPlaceholderScreen(), PageFrame()

### Community 69 - "index.ts"
Cohesion: 0.13
Nodes (40): react, COLUMNS, COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, GROUP_END_KEYS, COLUMN_KIND (+32 more)

### Community 70 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (33): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, metadata, MaterialReceiptsPage() (+25 more)

### Community 71 - "planMonthOpen"
Cohesion: 0.25
Nodes (13): metadata, ProductionJournalPage(), productionEntryPieces(), workingProductionEntriesInMonth(), planMonthOpen(), parseProductionJournalQuery(), productionEntryHref(), productionEntryNewHref() (+5 more)

### Community 72 - "Icons.tsx"
Cohesion: 0.52
Nodes (6): Glyph(), IconChevronLeft(), IconEye(), IconFact(), IconList(), IconMenu()

### Community 73 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 74 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

### Community 75 - "sales.ts"
Cohesion: 0.30
Nodes (15): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), maxSaleOccurredOn(), normalizeCustomer() (+7 more)

### Community 76 - "componentDraftKey"
Cohesion: 0.25
Nodes (5): buildCandidateGroups(), componentDraftKey(), RecipeComponentSearch(), selectedGroups(), draftsFromSavedLines()

### Community 77 - "orderLines"
Cohesion: 0.67
Nodes (3): orderLines(), productionFromOrders(), salesFromOrders()

### Community 78 - "SaleFormTable.tsx"
Cohesion: 0.16
Nodes (19): ProductCategory, EntryFormGroup, buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, formatKopecks() (+11 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 395 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `package.json`, `derivatives.ts`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `DerivativeMovementInventoryScreen.tsx`, `ProductionPlanScreen.tsx`, `PlanningScreen.tsx`, `SalesJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `materials/text.ts`, `SaleScreen.tsx`, `formatQuantity`, `FinishedGoodsMonthScreen.tsx`, `AppShell.tsx`, `DerivativeMovementPlanScreen.tsx`, `DerivativeCreateScreen.tsx`, `SaleScreen`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipePrint.tsx`, `PageFrame`, `MaterialsPlanScreen.tsx`, `planMonthOpen`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09438775510204081 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `MaterialsSummaryTable.tsx`, `package.json`, `FinishedProductEditScreen.tsx`, `keepWithNext`, `monthKeyFromDate`, `DerivativeMovementInventoryScreen.tsx`, `ProductionPlanScreen.tsx`, `MaterialReceiptFormTable.tsx`, `SummaryTable.tsx`, `SalesFactTable.tsx`, `PlanningScreen.tsx`, `MovementPlanTable.tsx`, `SalesJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `FinishedGoodsNormativeColumnHeading.tsx`, `SaleScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `AppShell.tsx`, `DerivativeMovementPlanScreen.tsx`, `next`, `DocumentProvider.tsx`, `DerivativeCreateScreen.tsx`, `ColumnLabel`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipePrint.tsx`, `PageFrame`, `MaterialsPlanScreen.tsx`, `planMonthOpen`, `Icons.tsx`, `SaleFormTable.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11205073995771671 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `derivative-movement.ts`, `materials.ts`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._