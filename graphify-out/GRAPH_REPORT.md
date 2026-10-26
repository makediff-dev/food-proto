# Graph Report - food-proto  (2026-10-26)

## Corpus Check
- 181 files · ~107,426 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1704 nodes · 6406 edges · 67 communities (60 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49bd76ae`
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
- use-materials.ts
- document.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- ProductionFactTable.tsx
- ProductionJournalFactScreen.tsx
- index.ts
- FinishedGoodsMonthScreen.tsx
- mock-materials.ts
- materials.ts
- DerivativeEditScreen
- MaterialsSummaryTable.tsx
- MaterialsInventoryScreen.tsx
- sales-fact.ts
- Флоу товара
- RecipeJournalsTable.tsx
- Workspace
- use-finished-recipes.ts
- SummaryTable.tsx
- planMonthOpen
- FinishedGoodsFactScreen.tsx
- recipes/paths.ts
- PageFrame
- production-fact.ts
- MovementPlanTable.tsx
- MaterialJournalScreen.tsx
- FinishedGoodsMonthTable.tsx
- SaleScreen.tsx
- sales-plan.ts
- MovementPlanScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- MaterialsNormsScreen
- postcss.config.mjs
- Архитектура прототипа
- orderLines
- Отчет общий движения
- Icons.tsx
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
- monthKeyFromDate
- MaterialsPlanScreen.tsx
- AGENTS.md
- RecipePrint.tsx
- MaterialReceiptFormTable.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 72 edges
2. `PageFrame()` - 63 edges
3. `next` - 62 edges
4. `planMonthOpen()` - 56 edges
5. `keepWithNext()` - 55 edges
6. `react` - 54 edges
7. `VatMoneyCell()` - 49 edges
8. `DerivativeForm()` - 41 edges
9. `useDocumentStore()` - 39 edges
10. `IconChevronDown()` - 39 edges

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

## Communities (67 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.10
Nodes (47): Единицы, SalesPlan, finishedGoodsSummaryAsOfDate(), periodGridCategories(), factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase (+39 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.07
Nodes (60): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage() (+52 more)

### Community 2 - "products.ts"
Cohesion: 0.11
Nodes (43): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+35 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.16
Nodes (21): costForQuantity(), derivativeConsumptionPrice(), derivativeMovementMonth(), DerivativeMovementMonthView, DerivativeMovementRow, DerivativeMovementSection, derivativePriceInternal(), factConsumptionQuantityForDerivative() (+13 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (25): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+17 more)

### Community 5 - "ProductionEntryFormTable.tsx"
Cohesion: 0.09
Nodes (39): react, buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormTotals, formatKopecks() (+31 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Инвентаризация (движение), Отчет общий (производство) (+15 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.09
Nodes (66): Удаление, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics() (+58 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.20
Nodes (25): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+17 more)

### Community 11 - "document.ts"
Cohesion: 0.12
Nodes (29): activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), isDerivativeUnit() (+21 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.14
Nodes (42): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantity(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), enableByPiece() (+34 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.13
Nodes (43): MetricCell(), RowCell(), TotalsCell(), NormDeviationCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+35 more)

### Community 15 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.09
Nodes (32): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+24 more)

### Community 16 - "index.ts"
Cohesion: 0.09
Nodes (63): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+55 more)

### Community 17 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.17
Nodes (21): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+13 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.08
Nodes (50): costExVat(), Material, MaterialReceiptLine, MaterialUnit, MaterialWeightPair, addMoney(), addMoneyNullable(), bookClosingQuantity() (+42 more)

### Community 20 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

### Community 21 - "MaterialsSummaryTable.tsx"
Cohesion: 0.11
Nodes (31): costWithVat(), MaterialNormDeviation(), COLUMNS, MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS, MaterialsPlanTable() (+23 more)

### Community 22 - "MaterialsInventoryScreen.tsx"
Cohesion: 0.20
Nodes (10): MaterialsInventoryPage(), metadata, MaterialGroupId, MaterialWarehouseId, MaterialGroupMovement, MaterialWarehouseMovement, MaterialsInventoryScreen(), MaterialsWarehouseBlocks() (+2 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.10
Nodes (36): unitCost, Product, averageAmount(), percentHundredths(), vatPercentHundredths(), dayGridProducts(), periodGridProducts(), periodReferencedProductIds() (+28 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "RecipeJournalsTable.tsx"
Cohesion: 0.27
Nodes (11): componentLabel(), CompositionLine(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection, SectionBlock() (+3 more)

### Community 26 - "Workspace"
Cohesion: 0.27
Nodes (9): commitDocumentUpdate(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), missingProductionPlanProducts(), openPlan(), productionPlanHref(), Workspace(), open() (+1 more)

### Community 27 - "use-finished-recipes.ts"
Cohesion: 0.32
Nodes (7): FinishedProductRecipePage(), ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), FinishedProductEditScreen(), useFinishedRecipes()

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (40): RowCell(), TotalsCell(), RowCell(), VarianceValue(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind() (+32 more)

### Community 29 - "planMonthOpen"
Cohesion: 0.13
Nodes (28): metadata, MovementInventoryPage(), productionEntryPieces(), workingProductionEntriesInMonth(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), InventoryScreen() (+20 more)

### Community 30 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.13
Nodes (28): useDocumentStore(), isOccurredOn(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle(), mondayLeadForMonth() (+20 more)

### Community 31 - "recipes/paths.ts"
Cohesion: 0.13
Nodes (23): metadata, metadata, RecipeFinishedPage(), metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), derivativeCompositionLines() (+15 more)

### Community 32 - "PageFrame"
Cohesion: 0.16
Nodes (14): nextConfig, next, Home(), metadata, metadata, PlanPage(), metadata, QuestionsPage() (+6 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.15
Nodes (28): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+20 more)

### Community 34 - "MovementPlanTable.tsx"
Cohesion: 0.10
Nodes (36): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMN_GROUPS, columnEdgeClass(), ColumnKey, COLUMNS, DerivativeMovementSummaryTable() (+28 more)

### Community 35 - "MaterialJournalScreen.tsx"
Cohesion: 0.17
Nodes (20): MaterialsPage(), metadata, MaterialsPlanPage(), MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen(), MaterialMonthBar() (+12 more)

### Community 36 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.23
Nodes (12): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+4 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.05
Nodes (78): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+70 more)

### Community 39 - "sales-plan.ts"
Cohesion: 0.08
Nodes (53): ProductionPlan, PrototypeDocument, plannedProductionVolumePieces(), planOpeningPrice(), targetClosingPiecesFromNorm(), amountExVat(), amountWithVat(), ratioRound() (+45 more)

### Community 40 - "MovementPlanScreen.tsx"
Cohesion: 0.14
Nodes (18): metadata, MovementFactPage(), metadata, MovementPlanPage(), FinishedGoodsFactScreen(), resolveMonth(), MovementPlanScreen(), resolveMonth() (+10 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.06
Nodes (50): DerivativeMovementPage(), metadata, metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY (+42 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "MaterialsNormsScreen"
Cohesion: 0.40
Nodes (5): MaterialsNormsPage(), metadata, materialNormQuantity(), MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 45 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 46 - "orderLines"
Cohesion: 0.67
Nodes (3): orderLines(), productionFromOrders(), salesFromOrders()

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "Icons.tsx"
Cohesion: 0.10
Nodes (33): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+25 more)

### Community 49 - "ColumnLabel"
Cohesion: 0.12
Nodes (23): Подсказки заголовков таблицы, OperatingExpenseSide, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS (+15 more)

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

### Community 64 - "monthKeyFromDate"
Cohesion: 0.24
Nodes (21): activeCategories(), monthKeyFromDate(), ensureRangeIncludesMonth(), normalizeMonthRange(), planningHref(), productionFactHref(), productionFactPageTitle(), ProductionFactScreen() (+13 more)

### Community 65 - "MaterialsPlanScreen.tsx"
Cohesion: 0.14
Nodes (17): metadata, MATERIAL_GROUPS, MATERIAL_UNITS, deletedMaterials(), MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection (+9 more)

### Community 66 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 67 - "RecipePrint.tsx"
Cohesion: 0.17
Nodes (21): derivativeWorkshopById(), warehouseIdForWorkshop(), MATERIAL_WAREHOUSES, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths() (+13 more)

### Community 69 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.20
Nodes (17): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+9 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 369 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `PageFrame` to `ProductionEntryScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `ProductionJournalFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `DerivativeEditScreen`, `MaterialsInventoryScreen.tsx`, `RecipeJournalsTable.tsx`, `planMonthOpen`, `FinishedGoodsFactScreen.tsx`, `recipes/paths.ts`, `MaterialJournalScreen.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `AppShell.tsx`, `MaterialsNormsScreen`, `Icons.tsx`, `monthKeyFromDate`, `MaterialsPlanScreen.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09608843537414966 - nodes in this community are weakly interconnected._
- **Why does `react` connect `ProductionEntryFormTable.tsx` to `ProductionEntryScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `ProductionFactTable.tsx`, `ProductionJournalFactScreen.tsx`, `index.ts`, `FinishedGoodsMonthScreen.tsx`, `MaterialsSummaryTable.tsx`, `MaterialsInventoryScreen.tsx`, `RecipeJournalsTable.tsx`, `SummaryTable.tsx`, `planMonthOpen`, `FinishedGoodsFactScreen.tsx`, `PageFrame`, `MovementPlanTable.tsx`, `MaterialJournalScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `AppShell.tsx`, `Icons.tsx`, `ColumnLabel`, `monthKeyFromDate`, `MaterialsPlanScreen.tsx`, `MaterialReceiptFormTable.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06625258799171843 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `sales-plan.ts` to `summary.ts`, `production-fact.ts`, `derivative-movement.ts`, `finished-goods.ts`, `materials.ts`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10730804810360776 - nodes in this community are weakly interconnected._