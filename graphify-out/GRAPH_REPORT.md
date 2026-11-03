# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 193 files · ~116,664 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1813 nodes · 6805 edges · 72 communities (65 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `560146fa`
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
- ProductionFactTable.tsx
- Icons.tsx
- DerivativeMovementInventoryScreen.tsx
- monthKeyFromDate
- document.ts
- materials.ts
- ProductionEntryFormTable.tsx
- MaterialReceiptFormTable.tsx
- production-plan.ts
- production-journal-fact.ts
- Флоу товара
- SummaryTable.tsx
- index.ts
- useDocumentStore
- FinishedGoodsMonthTable.tsx
- SalesJournalScreen.tsx
- ProductionJournalFactScreen.tsx
- MaterialJournalScreen.tsx
- movement-plan.ts
- production-fact.ts
- layout.tsx
- MaterialsPlanScreen.tsx
- FinishedGoodsNormativeColumnHeading.tsx
- SaleScreen.tsx
- FinishedProductsScreen.tsx
- FinishedGoodsMonthScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- DerivativeMovementPlanScreen.tsx
- postcss.config.mjs
- orderLines
- PageFrame
- Отчет общий движения
- document-storage.ts
- recipes/paths.ts
- Инвентаризация
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- DerivativeCreateScreen.tsx
- Отчет общий движения производных
- MaterialDocumentScreen.tsx
- FinishedGoodsFactScreen.tsx
- RecipeJournalsTable.tsx
- MaterialsNormsScreen.tsx
- materials/paths.ts
- ProductionPlanScreen.tsx
- Отчет подневный производства
- migrate-document.ts
- DerivativeCompositionEditor

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

## Communities (72 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.08
Nodes (65): Единицы, unitCost, SalesPlan, amountWithVat(), averageAmount(), percentHundredths(), ratioRound(), vatPercentHundredths() (+57 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (42): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry() (+34 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.08
Nodes (60): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+52 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.10
Nodes (38): buildRow(), costForQuantity(), derivativeConsumptionPrice(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList() (+30 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (26): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+18 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.08
Nodes (49): DerivativeMovementRow, DerivativeMovementSection, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeRow(), RowCell() (+41 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (34): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки (+26 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.10
Nodes (51): isMonthKey(), bookClosingReferencedProductIds(), buildGroups(), clampSummaryMonth(), closingInventoryDeviationPieces(), closingNormMetrics(), emptyPlanSide(), emptyRangeView() (+43 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.20
Nodes (26): addMaterial(), deleteMaterial(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent(), materialById() (+18 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.14
Nodes (31): activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection (+23 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.13
Nodes (35): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent(), enableByPiece() (+27 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 15 - "Icons.tsx"
Cohesion: 0.11
Nodes (34): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+26 more)

### Community 16 - "DerivativeMovementInventoryScreen.tsx"
Cohesion: 0.24
Nodes (9): DerivativeMovementInventoryPage(), metadata, DerivativeMovementInventoryScreen(), DerivativeMovementInventoryTable(), DERIVATIVE_MOVEMENT_INVENTORY_TITLE, derivativeMovementInventoryHref(), parseDerivativeMovementInventoryQuery(), DERIVATIVE_NORM_ERROR (+1 more)

### Community 17 - "monthKeyFromDate"
Cohesion: 0.11
Nodes (34): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), activeCategories(), activeProducts() (+26 more)

### Community 18 - "document.ts"
Cohesion: 0.08
Nodes (36): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+28 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (45): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials(), deleteMaterialReceipt() (+37 more)

### Community 20 - "ProductionEntryFormTable.tsx"
Cohesion: 0.08
Nodes (52): WorkshopBlock(), DerivativeMovementPlanTable(), WorkshopBlock(), GroupBlock(), CategoryBlock(), InventoryTable(), buildGroups(), CategoryBlock() (+44 more)

### Community 21 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (38): OperatingExpenseSide, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+30 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (25): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+17 more)

### Community 23 - "production-journal-fact.ts"
Cohesion: 0.08
Nodes (35): Архитектура прототипа, Поток данных, Слои, Удаление, Чего не делать, DocumentState, DocumentStoreValue, Product (+27 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (43): costWithVat(), TotalCell(), TotalCell(), ProductUnitPrice(), ProductionJournalFactTable(), RowCell(), TotalCell(), visibleDayRows() (+35 more)

### Community 26 - "index.ts"
Cohesion: 0.10
Nodes (60): react, adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+52 more)

### Community 27 - "useDocumentStore"
Cohesion: 0.29
Nodes (7): commitDocumentUpdate(), DocumentSource, DocumentStoreContext, useDocumentStore(), FinishedGoodsNormField, useProductionPlan(), MockReset()

### Community 28 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.09
Nodes (44): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock() (+36 more)

### Community 29 - "SalesJournalScreen.tsx"
Cohesion: 0.16
Nodes (20): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, parseSalesFactQuery(), parseSalesJournalQuery(), saleHref() (+12 more)

### Community 30 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.17
Nodes (16): metadata, ProductionFactPage(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), ProductionJournalFactView, DayDateControl() (+8 more)

### Community 31 - "MaterialJournalScreen.tsx"
Cohesion: 0.24
Nodes (10): MaterialReceiptPage(), metadata, MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref() (+2 more)

### Community 32 - "movement-plan.ts"
Cohesion: 0.16
Nodes (27): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookOpeningPiecesForProduct(), closingStockPieces(), hasStoredInventoryLine(), storedInventoryPiecesForProduct(), workingFinishedGoodsOpening(), buildRow() (+19 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.15
Nodes (30): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+22 more)

### Community 34 - "layout.tsx"
Cohesion: 0.33
Nodes (4): metadata, onest, RootLayout(), unbounded

### Community 35 - "MaterialsPlanScreen.tsx"
Cohesion: 0.13
Nodes (17): MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialGroupMovement, MaterialMovementRow (+9 more)

### Community 36 - "FinishedGoodsNormativeColumnHeading.tsx"
Cohesion: 0.15
Nodes (14): FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS (+6 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.09
Nodes (50): metadata, SalePage(), metadata, NewSalePage(), SaleLine, addSale(), addSaleRejection(), deleteSale() (+42 more)

### Community 39 - "FinishedProductsScreen.tsx"
Cohesion: 0.29
Nodes (10): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE, productPrintModel() (+2 more)

### Community 40 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.17
Nodes (20): metadata, MovementPage(), resolveSummaryMonthRange(), FullscreenToggle(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace(), open() (+12 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.11
Nodes (25): DerivativeMovementPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE, DERIVATIVE_MOVEMENT_SUMMARY_HREF, DERIVATIVE_MOVEMENT_SUMMARY_TITLE, parseDerivativeMovementMonthQuery() (+17 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.22
Nodes (14): DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), sumMoney(), DerivativeMovementPlanScreen(), derivativeNormRangeInvalid(), DerivativeMovementSummaryScreen(), DerivativeMovementSummaryTable() (+6 more)

### Community 45 - "orderLines"
Cohesion: 0.67
Nodes (3): orderLines(), productionFromOrders(), salesFromOrders()

### Community 46 - "PageFrame"
Cohesion: 0.10
Nodes (32): nextConfig, next, Home(), metadata, metadata, PlanPage(), metadata, QuestionsPage() (+24 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "document-storage.ts"
Cohesion: 0.31
Nodes (8): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), createMockDocument()

### Community 49 - "recipes/paths.ts"
Cohesion: 0.15
Nodes (15): DerivativePage(), metadata, metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), isDerivativeWorkshopId(), DerivativeCreateScreen() (+7 more)

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

### Community 62 - "DerivativeCreateScreen.tsx"
Cohesion: 0.13
Nodes (31): DERIVATIVE_WORKSHOPS, ProductRecipeLine, ProductRecipeRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths() (+23 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.14
Nodes (11): Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется, Остаток на конец, Остаток на начало (+3 more)

### Community 65 - "MaterialDocumentScreen.tsx"
Cohesion: 0.14
Nodes (22): metadata, NewMaterialReceiptPage(), FinishedProductRecipePage(), metadata, MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), DocumentForm() (+14 more)

### Community 66 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.12
Nodes (32): isOccurredOn(), defaultProductionEntryDay(), defaultSaleDay(), defaultSalesFactDay(), monthDates(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle() (+24 more)

### Community 67 - "RecipeJournalsTable.tsx"
Cohesion: 0.19
Nodes (16): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+8 more)

### Community 68 - "MaterialsNormsScreen.tsx"
Cohesion: 0.36
Nodes (7): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 70 - "materials/paths.ts"
Cohesion: 0.12
Nodes (23): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialsInventoryScreen(), MaterialsInventoryTable() (+15 more)

### Community 71 - "ProductionPlanScreen.tsx"
Cohesion: 0.11
Nodes (27): metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), productionEntryPieces(), workingProductionEntriesInMonth() (+19 more)

### Community 74 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

### Community 76 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `PageFrame` to `ProductionEntryScreen.tsx`, `package.json`, `derivatives.ts`, `Icons.tsx`, `DerivativeMovementInventoryScreen.tsx`, `monthKeyFromDate`, `SalesJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `MaterialJournalScreen.tsx`, `layout.tsx`, `MaterialsPlanScreen.tsx`, `SaleScreen.tsx`, `FinishedProductsScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `AppShell.tsx`, `DerivativeMovementPlanScreen.tsx`, `recipes/paths.ts`, `DerivativeCreateScreen.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialsNormsScreen.tsx`, `materials/paths.ts`, `ProductionPlanScreen.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07908902691511387 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `ProductionEntryScreen.tsx`, `MaterialsSummaryTable.tsx`, `package.json`, `ProductionFactTable.tsx`, `Icons.tsx`, `DerivativeMovementInventoryScreen.tsx`, `monthKeyFromDate`, `ProductionEntryFormTable.tsx`, `MaterialReceiptFormTable.tsx`, `SummaryTable.tsx`, `useDocumentStore`, `FinishedGoodsMonthTable.tsx`, `SalesJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `MaterialJournalScreen.tsx`, `MaterialsPlanScreen.tsx`, `FinishedGoodsNormativeColumnHeading.tsx`, `SaleScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `AppShell.tsx`, `DerivativeMovementPlanScreen.tsx`, `PageFrame`, `DerivativeCreateScreen.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `materials/paths.ts`, `ProductionPlanScreen.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09438775510204081 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `movement-plan.ts`, `production-fact.ts`, `derivative-movement.ts`, `materials.ts`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08269230769230769 - nodes in this community are weakly interconnected._