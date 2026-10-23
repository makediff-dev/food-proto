# Graph Report - food-proto  (2026-10-23)

## Corpus Check
- 173 files · ~100,316 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1605 nodes · 5920 edges · 68 communities (61 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8aa8873c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
- IconFullscreen
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
- PageFrame
- SaleScreen.tsx
- SummaryScreen.tsx
- ProductionFactTable.tsx
- mock-materials.ts
- materials.ts
- movement/paths.ts
- daysInMonth
- FinishedGoodsFactScreen.tsx
- FinishedGoodsMonthScreen.tsx
- Флоу товара
- MaterialsNormsScreen
- SalesFactScreen.tsx
- sales-plan.ts
- SummaryTable.tsx
- IconArrowLeft
- next
- FinishedGoodsMonthTable.tsx
- monthKeyFromDate
- production-fact.ts
- ColumnLabel
- document.ts
- ProductionJournalFactScreen.tsx
- PlanRedirect.tsx
- production-plan.ts
- materials/text.ts
- DocumentProvider.tsx
- Отчет общий сырья
- FinishedProductsScreen.tsx
- postcss.config.mjs
- recipes/paths.ts
- MovementPlanTable.tsx
- Отчет общий движения
- AppShell.tsx
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
- FinishedGoodsFactTable
- Архитектура прототипа
- useDocumentStore
- AGENTS.md
- Icons.tsx
- migrate-document.ts

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
- `Единицы` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (68 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.09
Nodes (48): unitCost, SalesPlan, averageAmount(), percentHundredths(), vatPercentHundredths(), periodGridProducts(), ProductionJournalFactRow, dayTotals() (+40 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (71): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+63 more)

### Community 2 - "products.ts"
Cohesion: 0.07
Nodes (60): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+52 more)

### Community 3 - "IconFullscreen"
Cohesion: 0.33
Nodes (11): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+3 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (44): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+36 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство) (+15 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.07
Nodes (83): Удаление, isMonthKey(), Product, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces() (+75 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "FinishedProductEditScreen.tsx"
Cohesion: 0.12
Nodes (34): isDerivativeUnit(), activeMaterials(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), setLine(), emptyMaterialReceiptLineDraft() (+26 more)

### Community 11 - "DerivativeCreateScreen.tsx"
Cohesion: 0.19
Nodes (22): activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById() (+14 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.09
Nodes (61): react, adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+53 more)

### Community 14 - "PageFrame"
Cohesion: 0.11
Nodes (35): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+27 more)

### Community 15 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (79): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+71 more)

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (30): recommendedVolumePiecesForMonths(), SalesPlanRejection, displayedOperatingExpense(), ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection (+22 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.12
Nodes (22): defaultMax(), LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials, MaterialSeed (+14 more)

### Community 19 - "materials.ts"
Cohesion: 0.08
Nodes (68): MaterialGroupId, MaterialReceiptLine, addMaterial(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity() (+60 more)

### Community 20 - "movement/paths.ts"
Cohesion: 0.16
Nodes (15): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FinishedGoodsFactScreen(), FinishedGoodsFactView (+7 more)

### Community 21 - "daysInMonth"
Cohesion: 0.26
Nodes (15): Единицы, factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, actualRangeSummary(), applySummaryLens(), calendarDays() (+7 more)

### Community 22 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.27
Nodes (11): DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS, Workspace() (+3 more)

### Community 23 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 26 - "SalesFactScreen.tsx"
Cohesion: 0.27
Nodes (12): isOccurredOn(), defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), salesFactPageTitle() (+4 more)

### Community 27 - "sales-plan.ts"
Cohesion: 0.17
Nodes (24): costExVat(), PrototypeDocument, amountExVat(), amountWithVat(), ratioRound(), productionPlanLineMetrics, activeSalesPlans(), addSalesPlan() (+16 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (59): TotalCell(), MetricCell(), RowCell(), TotalsCell(), InventoryTable(), RowCell(), TotalsCell(), ProductUnitPrice() (+51 more)

### Community 29 - "IconArrowLeft"
Cohesion: 0.24
Nodes (8): FinishedProductRecipePage(), metadata, DerivativePage(), metadata, DerivativeEditScreen(), FinishedProductEditScreen(), useFinishedRecipes(), IconArrowLeft()

### Community 30 - "next"
Cohesion: 0.10
Nodes (24): nextConfig, next, MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), metadata, QuestionsPage() (+16 more)

### Community 31 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (36): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, GroupBlock(), MaterialRow(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND (+28 more)

### Community 32 - "monthKeyFromDate"
Cohesion: 0.12
Nodes (34): activeCategories(), missingProductionPlanProducts(), activeProducts(), missingPlanProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth() (+26 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.16
Nodes (26): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+18 more)

### Community 34 - "ColumnLabel"
Cohesion: 0.13
Nodes (22): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders() (+14 more)

### Community 35 - "document.ts"
Cohesion: 0.11
Nodes (19): catalogCategories(), DeletableRecord, Derivative, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpeningLine, Material, MATERIAL_GROUPS (+11 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.22
Nodes (13): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), productionJournalFactPageTitle() (+5 more)

### Community 37 - "PlanRedirect.tsx"
Cohesion: 0.24
Nodes (11): Home(), metadata, metadata, PlanPage(), SummaryLens, parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref() (+3 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): ProductionPlan, productionPieces(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+18 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.18
Nodes (10): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR (+2 more)

### Community 41 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (12): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+4 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "FinishedProductsScreen.tsx"
Cohesion: 0.24
Nodes (11): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE, RecipeJournalsScreen() (+3 more)

### Community 45 - "recipes/paths.ts"
Cohesion: 0.25
Nodes (9): metadata, NewDerivativePage(), isDerivativeWorkshopId(), DerivativeCreateScreen(), NEW_DERIVATIVE_TITLE, parseDerivativeWorkshopQuery(), RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF (+1 more)

### Community 46 - "MovementPlanTable.tsx"
Cohesion: 0.21
Nodes (14): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, EDITABLE_COLUMNS (+6 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "AppShell.tsx"
Cohesion: 0.11
Nodes (21): metadata, onest, RootLayout(), unbounded, MATERIALS_SECTION_TITLE, AppShell(), currentNavLabel(), MATERIALS_NAV (+13 more)

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.12
Nodes (30): costWithVat(), MaterialUnit, MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), ColumnKey (+22 more)

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

### Community 62 - "FinishedGoodsFactTable"
Cohesion: 0.60
Nodes (5): CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), ProductRow(), visibleDayRows()

### Community 63 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 64 - "useDocumentStore"
Cohesion: 0.33
Nodes (9): metadata, RecipeDerivativesPage(), useDocumentStore(), derivativeCompositionLines(), derivativeSections(), DerivativesScreen(), derivativeHref(), derivativeNewHref() (+1 more)

### Community 65 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 66 - "Icons.tsx"
Cohesion: 0.46
Nodes (7): Glyph(), IconChevronLeft(), IconClose(), IconEye(), IconList(), IconMenu(), IconTrash()

### Community 67 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 354 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `products.ts`, `package.json`, `FinishedProductEditScreen.tsx`, `DerivativeCreateScreen.tsx`, `PageFrame`, `SaleScreen.tsx`, `SummaryScreen.tsx`, `movement/paths.ts`, `FinishedGoodsFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `MaterialsNormsScreen`, `SalesFactScreen.tsx`, `IconArrowLeft`, `FinishedGoodsMonthTable.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `PlanRedirect.tsx`, `FinishedProductsScreen.tsx`, `recipes/paths.ts`, `AppShell.tsx`, `useDocumentStore`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09019607843137255 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `ProductionEntryScreen.tsx`, `products.ts`, `MaterialReceiptFormTable.tsx`, `package.json`, `FinishedProductEditScreen.tsx`, `DerivativeCreateScreen.tsx`, `PageFrame`, `SaleScreen.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `FinishedGoodsFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `SalesFactScreen.tsx`, `SummaryTable.tsx`, `next`, `FinishedGoodsMonthTable.tsx`, `monthKeyFromDate`, `ColumnLabel`, `ProductionJournalFactScreen.tsx`, `PlanRedirect.tsx`, `DocumentProvider.tsx`, `FinishedProductsScreen.tsx`, `MovementPlanTable.tsx`, `AppShell.tsx`, `MaterialsPlanTable.tsx`, `Icons.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05393000573723465 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `production-fact.ts`, `production-plan.ts`, `Ввод плана (производство)`, `daysInMonth`, `sales-plan.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07203751065643649 - nodes in this community are weakly interconnected._