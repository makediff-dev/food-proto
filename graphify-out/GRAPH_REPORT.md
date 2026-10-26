# Graph Report - food-proto  (2026-10-26)

## Corpus Check
- 180 files · ~105,890 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1682 nodes · 6270 edges · 73 communities (66 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `674e3ad0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- ProductionEntryFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- MaterialDocumentScreen.tsx
- DerivativeCreateScreen.tsx
- compilerOptions
- DerivativeForm
- ProductionFactTable.tsx
- movement-plan.ts
- index.ts
- FinishedGoodsMonthScreen.tsx
- mock-materials.ts
- materials.ts
- document.ts
- MaterialsPlanTable.tsx
- FinishedProductEditScreen.tsx
- sales-fact.ts
- Флоу товара
- Icons.tsx
- DocumentProvider.tsx
- sales-plan.ts
- SummaryTable.tsx
- monthKeyFromDate
- FinishedGoodsFactScreen.tsx
- useDocumentStore
- next
- production-fact.ts
- FinishedGoodsMonthTable.tsx
- materials/paths.ts
- ProductionJournalFactScreen.tsx
- SaleScreen.tsx
- production-plan.ts
- MovementPlanScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- MaterialJournalScreen.tsx
- postcss.config.mjs
- Архитектура прототипа
- PlanningScreen.tsx
- Отчет общий движения
- layout.tsx
- ColumnLabel
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
- MaterialsPlanScreen.tsx
- DerivativeMovementSummaryScreen.tsx
- SummaryScreen.tsx
- materials/text.ts
- AGENTS.md
- recipe-yield.ts
- MaterialsNormsScreen
- MaterialReceiptFormTable.tsx
- IconFullscreen
- PageFrame
- migrate-document.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 72 edges
2. `PageFrame()` - 63 edges
3. `next` - 62 edges
4. `planMonthOpen()` - 56 edges
5. `keepWithNext()` - 55 edges
6. `react` - 53 edges
7. `VatMoneyCell()` - 49 edges
8. `useDocumentStore()` - 39 edges
9. `shiftMonth()` - 38 edges
10. `IconChevronDown()` - 37 edges

## Surprising Connections (you probably didn't know these)
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Удаление` --references--> `finishedGoodsGridProducts()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Единицы` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/recipe-consumption.ts -> src/domain/derivatives.ts`
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (73 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (46): SalesPlan, percentHundredths(), vatPercentHundredths(), daysInMonth(), planPhase, salesPlanTotals, actualRangeSummary(), applyFactScale() (+38 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.08
Nodes (46): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductCategory, ProductionEntryLine, addProductionEntry(), addProductionEntryRejection() (+38 more)

### Community 2 - "products.ts"
Cohesion: 0.08
Nodes (54): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+46 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.16
Nodes (21): costForQuantity(), derivativeConsumptionPrice(), derivativeMovementMonth(), DerivativeMovementMonthView, DerivativeMovementRow, DerivativeMovementSection, derivativePriceInternal(), factConsumptionQuantityForDerivative() (+13 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (28): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+20 more)

### Community 5 - "ProductionEntryFormTable.tsx"
Cohesion: 0.09
Nodes (27): GridInput(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormTotals, formatKopecks(), GridInput() (+19 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство) (+15 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.12
Nodes (44): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+36 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "MaterialDocumentScreen.tsx"
Cohesion: 0.19
Nodes (18): metadata, NewMaterialReceiptPage(), activeMaterials(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse(), draftsForWarehouse() (+10 more)

### Community 11 - "DerivativeCreateScreen.tsx"
Cohesion: 0.13
Nodes (29): DerivativePage(), metadata, metadata, NewDerivativePage(), activeDerivatives(), addDerivative(), derivativeByIdOrNull(), derivativeCompositionLines() (+21 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.13
Nodes (36): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), lineAmountWithVat(), quantityForAmount(), rowMetrics(), commit(), formatQuantityDraft(), parseQuantityInput() (+28 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.18
Nodes (28): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+20 more)

### Community 15 - "movement-plan.ts"
Cohesion: 0.18
Nodes (23): hasStoredInventoryLine(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), buildRow(), emptyNormLine(), emptyTotals(), FinishedGoodsNormField, FinishedGoodsNormRejection (+15 more)

### Community 16 - "index.ts"
Cohesion: 0.09
Nodes (61): adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+53 more)

### Community 17 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.27
Nodes (13): metadata, MovementPage(), activeCategories(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle() (+5 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.07
Nodes (75): MaterialGroupId, MaterialReceiptLine, MaterialUnit, MaterialWeightPair, addMaterial(), addMoney(), addMoneyNullable(), bookClosingQuantity() (+67 more)

### Community 20 - "document.ts"
Cohesion: 0.12
Nodes (18): DeletableRecord, Derivative, DERIVATIVE_UNITS, DERIVATIVE_WORKSHOPS, DerivativeUnit, FinishedGoodsNormLine, FinishedGoodsOpeningLine, Material (+10 more)

### Community 21 - "MaterialsPlanTable.tsx"
Cohesion: 0.13
Nodes (25): MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS, MaterialsPlanTable(), materialUnitHint(), PlanCell() (+17 more)

### Community 22 - "FinishedProductEditScreen.tsx"
Cohesion: 0.19
Nodes (13): FinishedProductRecipePage(), metadata, DerivativeAddRejection, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), DerivativeLineDraft (+5 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.11
Nodes (25): costExVat(), unitCost, Product, PrototypeDocument, dayTotals(), ProductionJournalFactDayView, ProductionJournalFactGroup, productionJournalFactGroups() (+17 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "Icons.tsx"
Cohesion: 0.17
Nodes (16): react, COLUMN_GROUPS, columnEdgeClass(), ColumnKey, COLUMNS, DerivativeMovementSummaryTable(), DerivativeRow(), GROUP_END_KEYS (+8 more)

### Community 26 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (12): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+4 more)

### Community 27 - "sales-plan.ts"
Cohesion: 0.18
Nodes (21): Единицы, costWithVat(), amountWithVat(), ratioRound(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines() (+13 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (49): RowCell(), TotalCell(), RowCell(), TotalCell(), Pieces(), RowCell(), RowCell(), TotalsCell() (+41 more)

### Community 29 - "monthKeyFromDate"
Cohesion: 0.14
Nodes (29): productionEntryPieces(), workingProductionEntriesInMonth(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), resolveMonth(), InventoryScreen() (+21 more)

### Community 30 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.13
Nodes (30): isOccurredOn(), defaultSalesFactDay(), salesFactGridProducts(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay() (+22 more)

### Community 31 - "useDocumentStore"
Cohesion: 0.18
Nodes (19): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), useDocumentStore(), productCompositionLines(), productRecipeSections(), DerivativesScreen() (+11 more)

### Community 32 - "next"
Cohesion: 0.25
Nodes (10): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+2 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.13
Nodes (32): amountExVat(), periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale() (+24 more)

### Community 34 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.08
Nodes (59): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, GroupBlock(), MaterialRow() (+51 more)

### Community 35 - "materials/paths.ts"
Cohesion: 0.19
Nodes (15): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, materialMovementMonth, MaterialsInventoryScreen(), MaterialsSummaryScreen(), MaterialsWarehouseBlocks() (+7 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.08
Nodes (35): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+27 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (77): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+69 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.11
Nodes (34): Удаление, commitDocumentUpdate(), ProductionPlan, dayGridProducts(), periodGridCategories(), periodGridProducts(), activeProductionPlans(), addMissingProductionPlanLines() (+26 more)

### Community 40 - "MovementPlanScreen.tsx"
Cohesion: 0.13
Nodes (20): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FinishedGoodsFactScreen(), MovementPlanScreen() (+12 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.11
Nodes (23): MOVEMENT_SECTION_TITLE, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, RECIPES_SECTION_TITLE, SALES_SECTION_TITLE, AppShell(), currentNavLabel(), DERIVATIVE_MOVEMENT_NAV (+15 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "MaterialJournalScreen.tsx"
Cohesion: 0.23
Nodes (11): MaterialReceiptPage(), metadata, MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref() (+3 more)

### Community 45 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 46 - "PlanningScreen.tsx"
Cohesion: 0.18
Nodes (17): metadata, PlanningPage(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), planningHref(), AddCategoryDialog(), submit() (+9 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "layout.tsx"
Cohesion: 0.33
Nodes (4): metadata, onest, RootLayout(), unbounded

### Community 49 - "ColumnLabel"
Cohesion: 0.11
Nodes (24): Подсказки заголовков таблицы, FinishedGoodsFactTable(), visibleDayRows(), FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS (+16 more)

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

### Community 62 - "MaterialsPlanScreen.tsx"
Cohesion: 0.29
Nodes (8): MaterialsPlanPage(), metadata, MATERIAL_WAREHOUSES, AddMaterialDialog(), MaterialsPlanScreen(), materialUnitHint(), MATERIALS_PLAN_TITLE, formatMaterialWeightPair()

### Community 63 - "DerivativeMovementSummaryScreen.tsx"
Cohesion: 0.29
Nodes (10): DerivativeMovementPage(), metadata, DerivativeMovementSummaryScreen(), DERIVATIVE_MOVEMENT_SECTION_TITLE, DERIVATIVE_MOVEMENT_SUMMARY_HREF, DERIVATIVE_MOVEMENT_SUMMARY_TITLE, derivativeMovementSummaryHref(), parseDerivativeMovementMonthQuery() (+2 more)

### Community 64 - "SummaryScreen.tsx"
Cohesion: 0.15
Nodes (26): SalesPlanRejection, ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection, productionFactHref(), productionFactPageTitle() (+18 more)

### Community 65 - "materials/text.ts"
Cohesion: 0.20
Nodes (9): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR, MATERIAL_NORM_ERROR, MATERIAL_OPENING_ERROR (+1 more)

### Community 66 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 67 - "recipe-yield.ts"
Cohesion: 0.33
Nodes (9): applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef, recipeYieldRejection() (+1 more)

### Community 68 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 69 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.27
Nodes (9): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), groupTotals() (+1 more)

### Community 70 - "IconFullscreen"
Cohesion: 0.36
Nodes (10): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+2 more)

### Community 71 - "PageFrame"
Cohesion: 0.39
Nodes (4): metadata, QuestionsPage(), ProductionPlaceholderScreen(), PageFrame()

### Community 72 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 366 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `products.ts`, `package.json`, `MaterialDocumentScreen.tsx`, `DerivativeCreateScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `FinishedProductEditScreen.tsx`, `Icons.tsx`, `monthKeyFromDate`, `FinishedGoodsFactScreen.tsx`, `useDocumentStore`, `materials/paths.ts`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `AppShell.tsx`, `MaterialJournalScreen.tsx`, `PlanningScreen.tsx`, `layout.tsx`, `MaterialsPlanScreen.tsx`, `DerivativeMovementSummaryScreen.tsx`, `SummaryScreen.tsx`, `MaterialsNormsScreen`, `PageFrame`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10638297872340426 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `ProductionEntryScreen.tsx`, `products.ts`, `ProductionEntryFormTable.tsx`, `package.json`, `MaterialDocumentScreen.tsx`, `DerivativeCreateScreen.tsx`, `ProductionFactTable.tsx`, `index.ts`, `FinishedGoodsMonthScreen.tsx`, `MaterialsPlanTable.tsx`, `FinishedProductEditScreen.tsx`, `DocumentProvider.tsx`, `SummaryTable.tsx`, `monthKeyFromDate`, `FinishedGoodsFactScreen.tsx`, `useDocumentStore`, `next`, `FinishedGoodsMonthTable.tsx`, `materials/paths.ts`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `AppShell.tsx`, `MaterialJournalScreen.tsx`, `PlanningScreen.tsx`, `ColumnLabel`, `MaterialsPlanScreen.tsx`, `DerivativeMovementSummaryScreen.tsx`, `SummaryScreen.tsx`, `MaterialReceiptFormTable.tsx`, `PageFrame`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08490566037735849 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `production-fact.ts`, `derivative-movement.ts`, `production-plan.ts`, `materials.ts`, `Ввод плана (производство)`, `sales-plan.ts`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0847457627118644 - nodes in this community are weakly interconnected._