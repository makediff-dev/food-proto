# Graph Report - food-proto  (2026-10-26)

## Corpus Check
- 174 files · ~103,221 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1635 nodes · 6063 edges · 67 communities (60 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ab303e0d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
- AppShell.tsx
- mock-document.ts
- MaterialReceiptFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- MaterialDocumentScreen.tsx
- derivatives.ts
- compilerOptions
- FinishedProductEditScreen.tsx
- SalesFactTable.tsx
- recipe-yield.ts
- InventoryScreen.tsx
- ProductionFactTable.tsx
- mock-materials.ts
- materials.ts
- MaterialsPlanScreen.tsx
- index.ts
- SalesFactScreen.tsx
- sales-plan.ts
- Флоу товара
- FinishedGoodsFactScreen.tsx
- use-materials.ts
- production-journal-fact.ts
- SummaryTable.tsx
- monthKeyFromDate
- IconFullscreen
- Icons.tsx
- document.ts
- production-fact.ts
- ColumnLabel
- materials/paths.ts
- ProductionJournalFactScreen.tsx
- SaleScreen.tsx
- production-plan.ts
- MovementPlanScreen.tsx
- DocumentProvider.tsx
- Отчет общий сырья
- useDocumentStore
- postcss.config.mjs
- DerivativeCreateScreen.tsx
- FinishedGoodsMonthTable.tsx
- Отчет общий движения
- recipes/text.ts
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
- commitDocumentUpdate
- ProductionPlanScreen.tsx
- SummaryScreen.tsx
- PageFrame
- MaterialJournalScreen.tsx

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

## Communities (67 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.12
Nodes (40): Единицы, factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, salesPlanLineMetrics, actualRangeSummary(), applyPlanScale() (+32 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (66): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+58 more)

### Community 2 - "products.ts"
Cohesion: 0.07
Nodes (67): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+59 more)

### Community 3 - "AppShell.tsx"
Cohesion: 0.11
Nodes (22): metadata, onest, RootLayout(), unbounded, MOVEMENT_SECTION_TITLE, AppShell(), currentNavLabel(), MATERIALS_NAV (+14 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (49): react, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+41 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (35): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+27 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.07
Nodes (81): metadata, MovementPage(), FinishedGoodsNormLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups() (+73 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "MaterialDocumentScreen.tsx"
Cohesion: 0.18
Nodes (17): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), occurredOnOpen() (+9 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.21
Nodes (19): activeDerivatives(), addDerivative(), derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById(), isDerivativeUnit() (+11 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.11
Nodes (39): FinishedProductRecipePage(), metadata, activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), changeWarehouse(), draftsForWarehouse(), lineAmountWithVat() (+31 more)

### Community 14 - "SalesFactTable.tsx"
Cohesion: 0.15
Nodes (41): TotalCell(), MetricCell(), RowCell(), TotalsCell(), TotalCell(), ProductUnitPrice(), Pieces(), RowCell() (+33 more)

### Community 15 - "recipe-yield.ts"
Cohesion: 0.33
Nodes (9): applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef, recipeYieldRejection() (+1 more)

### Community 16 - "InventoryScreen.tsx"
Cohesion: 0.19
Nodes (13): metadata, MovementFactPage(), metadata, MovementInventoryPage(), InventoryScreen(), resolveMonth(), Workspace(), open() (+5 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.12
Nodes (22): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+14 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (39): MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+31 more)

### Community 20 - "MaterialsPlanScreen.tsx"
Cohesion: 0.10
Nodes (25): MaterialsPlanPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MATERIAL_WAREHOUSES, MaterialUnit, MaterialWeightPair, deletedMaterials() (+17 more)

### Community 21 - "index.ts"
Cohesion: 0.10
Nodes (46): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+38 more)

### Community 22 - "SalesFactScreen.tsx"
Cohesion: 0.22
Nodes (15): isOccurredOn(), defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+7 more)

### Community 23 - "sales-plan.ts"
Cohesion: 0.10
Nodes (40): costExVat(), unitCost, PrototypeDocument, SalesPlan, SalesPlanLine, amountWithVat(), averageAmount(), percentHundredths() (+32 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.23
Nodes (13): DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS, Workspace() (+5 more)

### Community 26 - "use-materials.ts"
Cohesion: 0.18
Nodes (27): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair() (+19 more)

### Community 27 - "production-journal-fact.ts"
Cohesion: 0.17
Nodes (20): Удаление, Product, dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds(), productionFactGridProducts(), dayTotals() (+12 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.17
Nodes (19): CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), PLAN_ASSIGNED, planColumnKind(), ProductRow(), sectionRightClass() (+11 more)

### Community 29 - "monthKeyFromDate"
Cohesion: 0.42
Nodes (9): maxProductionEntryOccurredOn(), maxSaleOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), FinishedGoodsFactScreen(), resolveMonth(), resolveRange() (+1 more)

### Community 30 - "IconFullscreen"
Cohesion: 0.36
Nodes (10): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+2 more)

### Community 31 - "Icons.tsx"
Cohesion: 0.09
Nodes (43): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, GroupBlock(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+35 more)

### Community 32 - "document.ts"
Cohesion: 0.13
Nodes (15): catalogCategories(), DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNorm, FinishedGoodsOpeningLine, Material, MaterialMonthPlanLine, MaterialNorm (+7 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.13
Nodes (33): amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts() (+25 more)

### Community 34 - "ColumnLabel"
Cohesion: 0.13
Nodes (23): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders() (+15 more)

### Community 35 - "materials/paths.ts"
Cohesion: 0.15
Nodes (20): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialWarehouseId, MaterialPlanField, MaterialWarehouseMovement, MaterialMonthBar() (+12 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.22
Nodes (13): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), ProductionJournalFactScreen(), resolveDay() (+5 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.05
Nodes (84): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+76 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.15
Nodes (22): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+14 more)

### Community 40 - "MovementPlanScreen.tsx"
Cohesion: 0.23
Nodes (11): metadata, MovementPlanPage(), FullscreenToggle(), MovementPlanScreen(), resolveMonth(), Workspace(), open(), movementPlanNormRangeInvalid() (+3 more)

### Community 41 - "DocumentProvider.tsx"
Cohesion: 0.17
Nodes (17): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+9 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "useDocumentStore"
Cohesion: 0.14
Nodes (25): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), useDocumentStore(), derivativeCompositionLines(), derivativeSections(), outputPieceThousandthsOf() (+17 more)

### Community 45 - "DerivativeCreateScreen.tsx"
Cohesion: 0.16
Nodes (14): DerivativePage(), metadata, metadata, NewDerivativePage(), isDerivativeWorkshopId(), Derivative, DERIVATIVE_WORKSHOPS, MAX_QUANTITY_THOUSANDTHS (+6 more)

### Community 46 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.23
Nodes (12): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+4 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "recipes/text.ts"
Cohesion: 0.29
Nodes (5): DerivativeAddRejection, ProductRecipeLine, ProductRecipeRejection, DERIVATIVE_ADD_ERROR, PRODUCT_RECIPE_ERROR

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.12
Nodes (35): costWithVat(), MaterialMovementTotals, MaterialNormDeviation(), COLUMNS, MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS (+27 more)

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

### Community 62 - "commitDocumentUpdate"
Cohesion: 0.67
Nodes (5): commitDocumentUpdate(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), openPlan(), useProductionPlan()

### Community 63 - "ProductionPlanScreen.tsx"
Cohesion: 0.20
Nodes (13): metadata, ProductionPlanPage(), missingProductionPlanProducts(), parseProductionPlanQuery(), PRODUCTION_PLAN_TITLE, productionPlanHref(), FullscreenToggle(), ProductionPlanScreen() (+5 more)

### Community 64 - "SummaryScreen.tsx"
Cohesion: 0.12
Nodes (36): Home(), metadata, activeCategories(), SalesPlanRejection, displayedOperatingExpense(), ensureRangeIncludesMonth(), lastHorizonMonth(), monthOperatingExpenseAmounts() (+28 more)

### Community 66 - "PageFrame"
Cohesion: 0.15
Nodes (14): nextConfig, next, MaterialsNormsPage(), metadata, metadata, PlanPage(), metadata, QuestionsPage() (+6 more)

### Community 73 - "MaterialJournalScreen.tsx"
Cohesion: 0.23
Nodes (12): MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref(), MATERIALS_RECEIPTS_TITLE, AddCategoryDialog() (+4 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 359 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `PageFrame` to `ProductionEntryScreen.tsx`, `products.ts`, `AppShell.tsx`, `finished-goods.ts`, `package.json`, `MaterialDocumentScreen.tsx`, `FinishedProductEditScreen.tsx`, `InventoryScreen.tsx`, `MaterialsPlanScreen.tsx`, `SalesFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `Icons.tsx`, `materials/paths.ts`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `useDocumentStore`, `DerivativeCreateScreen.tsx`, `ProductionPlanScreen.tsx`, `SummaryScreen.tsx`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11614401858304298 - nodes in this community are weakly interconnected._
- **Why does `react` connect `MaterialReceiptFormTable.tsx` to `ProductionEntryScreen.tsx`, `products.ts`, `AppShell.tsx`, `finished-goods.ts`, `package.json`, `MaterialDocumentScreen.tsx`, `FinishedProductEditScreen.tsx`, `SalesFactTable.tsx`, `InventoryScreen.tsx`, `ProductionFactTable.tsx`, `MaterialsPlanScreen.tsx`, `index.ts`, `SalesFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SummaryTable.tsx`, `Icons.tsx`, `ColumnLabel`, `materials/paths.ts`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `DocumentProvider.tsx`, `useDocumentStore`, `DerivativeCreateScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `MaterialsPlanTable.tsx`, `ProductionPlanScreen.tsx`, `SummaryScreen.tsx`, `PageFrame`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05960705960705961 - nodes in this community are weakly interconnected._
- **Why does `Архитектура прототипа` connect `Предметная область` to `summary.ts`, `production-journal-fact.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06626706626706627 - nodes in this community are weakly interconnected._