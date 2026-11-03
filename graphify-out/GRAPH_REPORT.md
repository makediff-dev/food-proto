# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 212 files · ~123,511 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1945 nodes · 7341 edges · 71 communities (64 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3f6021c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- DerivativeMovementSummaryTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- RoleProvider.tsx
- DerivativeFormTable.tsx
- compilerOptions
- FinishedProductEditScreen.tsx
- keepWithNext
- movement-plan.ts
- SummaryTable.tsx
- monthKeyFromDate
- document.ts
- materials.ts
- ProductionJournalFactScreen.tsx
- index.ts
- production-plan.ts
- sales-fact.ts
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsMonthTable.tsx
- finished-product-cost.ts
- recipe-yield.ts
- PlanningScreen.tsx
- Icons.tsx
- materials/text.ts
- derivatives.ts
- production-fact.ts
- derivative-cost.ts
- DerivativeMovementPlanScreen.tsx
- FinishedGoodsMonthScreen.tsx
- SaleScreen.tsx
- flow.md
- FinishedProductsScreen.tsx
- next
- AppShell.tsx
- Отчет общий сырья
- MaterialsSummaryTable.tsx
- postcss.config.mjs
- sales-plan.ts
- FinishedGoodsFactScreen.tsx
- Отчет общий движения
- PageFrame
- DerivativeCreateScreen.tsx
- PrototypeDocument
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- DocumentForm
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- RecipeComponentSearch
- Отчет общий движения производных
- movementRow
- RecipePrint.tsx
- RecipeJournalsTable.tsx
- MaterialDocumentScreen.tsx
- Себестоимость готовой продукции
- useDocumentStore
- Отчет подневный производства

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 84 edges
2. `next` - 76 edges
3. `PageFrame()` - 75 edges
4. `react` - 65 edges
5. `keepWithNext()` - 63 edges
6. `planMonthOpen()` - 59 edges
7. `VatMoneyCell()` - 55 edges
8. `useDocumentStore()` - 49 edges
9. `IconChevronDown()` - 47 edges
10. `DerivativeForm()` - 46 edges

## Surprising Connections (you probably didn't know these)
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Единицы` --references--> `costWithVat()`  [INFERRED]
  docs/architecture.md → src/domain/cost.ts
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/recipe-consumption.ts -> src/domain/derivatives.ts`
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (71 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (41): SalesPlan, percentHundredths(), vatPercentHundredths(), daysInMonth(), planPhase, salesPlanTotals, applyFactScale(), applyPlanScale() (+33 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (58): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип (+50 more)

### Community 2 - "products.ts"
Cohesion: 0.09
Nodes (53): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+45 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.13
Nodes (28): buildRow(), costForQuantity(), DerivativeMovementMonthView, derivativeNormMetrics(), derivativeNormsList(), derivativeOpeningsList(), factConsumptionQuantityForDerivative(), factProductionVolumePiecesForProduct() (+20 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (37): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), burger (+29 more)

### Community 5 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.09
Nodes (54): costWithVat(), DerivativeMovementRow, DerivativeMovementSection, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeRow() (+46 more)

### Community 6 - "Предметная область"
Cohesion: 0.07
Nodes (28): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение производных (+20 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.13
Nodes (35): isOccurredOn(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), emptyPlanSide(), emptyRangeView() (+27 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.14
Nodes (21): metadata, RolesPage(), readRole(), ROLE_STORAGE_KEY, writeRole(), ROLES_HREF, ROLES_TITLE, RoleProvider() (+13 more)

### Community 11 - "DerivativeFormTable.tsx"
Cohesion: 0.08
Nodes (48): DerivativeMovementInventoryTable(), WorkshopBlock(), DerivativeMovementPlanTable(), WorkshopBlock(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+40 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.13
Nodes (38): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent() (+30 more)

### Community 14 - "keepWithNext"
Cohesion: 0.13
Nodes (40): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+32 more)

### Community 15 - "movement-plan.ts"
Cohesion: 0.15
Nodes (31): isMonthKey(), bookClosingPiecesForProduct(), closingStockPieces(), FinishedGoodsOpeningRejection, hasStoredInventoryLine(), isOpeningPieces(), openingPiecesForProduct(), setFinishedGoodsOpening() (+23 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (37): Подсказки заголовков таблицы, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SummaryHeadlineTable() (+29 more)

### Community 17 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (36): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), activeCategories(), monthKeyFromDate() (+28 more)

### Community 18 - "document.ts"
Cohesion: 0.07
Nodes (41): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+33 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (55): MaterialGroupId, MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine() (+47 more)

### Community 20 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.08
Nodes (34): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+26 more)

### Community 21 - "index.ts"
Cohesion: 0.09
Nodes (52): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+44 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.13
Nodes (29): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, plannedProductionVolumePieces(), targetClosingPiecesFromNorm(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection() (+21 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.12
Nodes (33): Удаление, unitCost, Product, productionSpendOn(), averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+25 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (48): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+40 more)

### Community 26 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (40): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_GROUPS (+32 more)

### Community 27 - "finished-product-cost.ts"
Cohesion: 0.22
Nodes (14): buildCostRow(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode, FinishedProductCostMonthView, FinishedProductCostRow, FinishedProductCostSection (+6 more)

### Community 28 - "recipe-yield.ts"
Cohesion: 0.17
Nodes (13): ProductRecipeLine, ProductRecipeRejection, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths() (+5 more)

### Community 29 - "PlanningScreen.tsx"
Cohesion: 0.10
Nodes (40): metadata, PlanningPage(), ProductionEntry, productionEntryPieces(), workingProductionEntriesInMonth(), missingProductionPlanProducts(), activeProducts(), maxSaleOccurredOn() (+32 more)

### Community 30 - "Icons.tsx"
Cohesion: 0.15
Nodes (31): Единицы, actualRangeSummary(), calendarDays(), ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), rangeSummary() (+23 more)

### Community 31 - "materials/text.ts"
Cohesion: 0.17
Nodes (11): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR (+3 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.12
Nodes (33): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeCompositionLines(), DerivativeCompositionLineView (+25 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.15
Nodes (27): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+19 more)

### Community 34 - "derivative-cost.ts"
Cohesion: 0.14
Nodes (30): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+22 more)

### Community 35 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.10
Nodes (30): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), DerivativeNormField (+22 more)

### Community 36 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (79): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+71 more)

### Community 38 - "flow.md"
Cohesion: 0.36
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "FinishedProductsScreen.tsx"
Cohesion: 0.19
Nodes (13): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductEditScreen(), FinishedProductsScreen() (+5 more)

### Community 40 - "next"
Cohesion: 0.17
Nodes (14): nextConfig, next, MaterialsNormsPage(), metadata, Home(), metadata, metadata, PlanPage() (+6 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.10
Nodes (24): metadata, onest, RootLayout(), unbounded, MOVEMENT_SECTION_TITLE, AppShell(), currentNavLabel(), DERIVATIVE_MOVEMENT_NAV (+16 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "MaterialsSummaryTable.tsx"
Cohesion: 0.10
Nodes (27): buildSections(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, GROUP_END_KEYS, groupEndClass(), MaterialRow() (+19 more)

### Community 45 - "sales-plan.ts"
Cohesion: 0.14
Nodes (30): planOpeningPrice(), priceAverage(), rangePlanProduction(), rangePlanSales(), amountExVat(), amountWithVat(), productSide(), productionLineAmountExVat() (+22 more)

### Community 46 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.09
Nodes (37): defaultSalesFactDay(), SalesPlanRejection, OperatingExpenseRejection, DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay() (+29 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "PageFrame"
Cohesion: 0.21
Nodes (16): react, MaterialsInventoryPage(), MaterialsPlanPage(), metadata, materialMovementMonth, MaterialMonthBar(), resolveMaterialMonth(), MaterialsInventoryScreen() (+8 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.23
Nodes (11): DerivativePage(), metadata, metadata, NewDerivativePage(), derivativeByIdOrNull(), DerivativeCreateScreen(), DerivativeEditScreen(), DerivativeFormEmpty() (+3 more)

### Community 50 - "PrototypeDocument"
Cohesion: 0.32
Nodes (7): DocumentState, DocumentStoreValue, LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, PrototypeDocument

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

### Community 58 - "DocumentForm"
Cohesion: 0.43
Nodes (7): activeMaterials(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), setLine(), emptyMaterialReceiptLineDraft()

### Community 62 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "movementRow"
Cohesion: 0.17
Nodes (18): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), emptyTotals(), gridMaterials() (+10 more)

### Community 65 - "RecipePrint.tsx"
Cohesion: 0.18
Nodes (18): Derivative, MATERIAL_WAREHOUSES, formatQuantity(), draftsFromLines(), componentDraftKey(), DerivativeLineDraft, draftsFromSavedLines(), formatPrintPercent() (+10 more)

### Community 67 - "RecipeJournalsTable.tsx"
Cohesion: 0.24
Nodes (13): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+5 more)

### Community 70 - "MaterialDocumentScreen.tsx"
Cohesion: 0.11
Nodes (26): metadata, MaterialsPage(), metadata, MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MaterialReceiptsPage() (+18 more)

### Community 75 - "useDocumentStore"
Cohesion: 0.12
Nodes (27): metadata, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage() (+19 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 426 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `products.ts`, `package.json`, `RoleProvider.tsx`, `DerivativeFormTable.tsx`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `PlanningScreen.tsx`, `Icons.tsx`, `derivatives.ts`, `DerivativeMovementPlanScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `SaleScreen.tsx`, `FinishedProductsScreen.tsx`, `AppShell.tsx`, `FinishedGoodsFactScreen.tsx`, `PageFrame`, `DerivativeCreateScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialDocumentScreen.tsx`, `useDocumentStore`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11295681063122924 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `ProductionEntryScreen.tsx`, `products.ts`, `DerivativeMovementSummaryTable.tsx`, `package.json`, `RoleProvider.tsx`, `DerivativeFormTable.tsx`, `FinishedProductEditScreen.tsx`, `keepWithNext`, `SummaryTable.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `index.ts`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsMonthTable.tsx`, `PlanningScreen.tsx`, `Icons.tsx`, `DerivativeMovementPlanScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `SaleScreen.tsx`, `next`, `AppShell.tsx`, `MaterialsSummaryTable.tsx`, `FinishedGoodsFactScreen.tsx`, `DerivativeCreateScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialDocumentScreen.tsx`, `useDocumentStore`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05432595573440644 - nodes in this community are weakly interconnected._
- **Why does `PageFrame()` connect `PageFrame` to `ProductionEntryScreen.tsx`, `products.ts`, `DerivativeMovementSummaryTable.tsx`, `RoleProvider.tsx`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `PlanningScreen.tsx`, `Icons.tsx`, `DerivativeMovementPlanScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `SaleScreen.tsx`, `FinishedProductsScreen.tsx`, `next`, `FinishedGoodsFactScreen.tsx`, `DerivativeCreateScreen.tsx`, `DocumentForm`, `RecipeJournalsTable.tsx`, `MaterialDocumentScreen.tsx`, `useDocumentStore`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08766803039158387 - nodes in this community are weakly interconnected._