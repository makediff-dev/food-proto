# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 197 files · ~117,713 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1839 nodes · 6886 edges · 72 communities (66 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d5dd93b`
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
- ColumnLabel
- useDocumentStore
- MovementPlanScreen.tsx
- mock-materials.ts
- materials.ts
- MaterialReceiptFormTable.tsx
- SalesFactTable.tsx
- production-plan.ts
- sales-fact.ts
- Флоу товара
- SummaryTable.tsx
- index.ts
- Icons.tsx
- TableNumber
- monthKeyFromDate
- ProductionJournalFactScreen.tsx
- document.ts
- movement-plan.ts
- production-fact.ts
- layout.tsx
- materials/text.ts
- RoleProvider.tsx
- SaleFormTable.tsx
- flow.md
- FinishedProductsScreen.tsx
- FinishedGoodsMonthScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- PageFrame
- postcss.config.mjs
- Архитектура прототипа
- materialReceiptsList
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
- recipe-yield.ts
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- RecipePrint.tsx
- Отчет общий движения производных
- AGENTS.md
- FinishedProductEditScreen.tsx
- FinishedGoodsFactScreen.tsx
- RecipeJournalsTable.tsx
- RolesScreen.tsx
- MaterialsNormsScreen.tsx
- MaterialDocumentScreen.tsx
- ProductionPlanScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 76 edges
2. `PageFrame()` - 67 edges
3. `next` - 66 edges
4. `react` - 59 edges
5. `planMonthOpen()` - 59 edges
6. `keepWithNext()` - 59 edges
7. `VatMoneyCell()` - 49 edges
8. `DerivativeForm()` - 46 edges
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

## Communities (72 total, 6 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.05
Nodes (92): Единицы, Home(), metadata, metadata, ProductionPage(), unitCost, percentHundredths(), vatPercentHundredths() (+84 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (43): ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection(), defaultProductionEntryDay() (+35 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.06
Nodes (82): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+74 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (33): buildRow(), costForQuantity(), derivativeConsumptionPrice(), DerivativeMovementMonthView, derivativeNormMetrics(), derivativeNormsList(), derivativeOpeningsList(), derivativePriceInternal() (+25 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.09
Nodes (36): DerivativeRow(), DerivativeRow(), RowCell(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+28 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (26): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение производных (+18 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.14
Nodes (36): isMonthKey(), bookClosingReferencedProductIds(), buildGroups(), closingNormMetrics(), emptyPlanSide(), emptyRangeView(), emptyTotals(), factualClosingPiecesThrough() (+28 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.22
Nodes (23): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isVatPercent(), materialNameRejection (+15 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.16
Nodes (26): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection (+18 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.13
Nodes (35): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent() (+27 more)

### Community 14 - "keepWithNext"
Cohesion: 0.21
Nodes (24): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+16 more)

### Community 15 - "ColumnLabel"
Cohesion: 0.10
Nodes (27): Подсказки заголовков таблицы, DerivativeMovementPlanTable(), FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), MATERIALS_CLOSING_SUB_BANNERS (+19 more)

### Community 16 - "useDocumentStore"
Cohesion: 0.11
Nodes (29): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, useDocumentStore(), derivativeMovementMonth() (+21 more)

### Community 17 - "MovementPlanScreen.tsx"
Cohesion: 0.13
Nodes (20): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FinishedGoodsFactScreen(), MovementPlanScreen() (+12 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (37): costExVat(), MaterialGroupId, MaterialReceiptLine, MaterialWarehouseId, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity() (+29 more)

### Community 20 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.10
Nodes (35): MATERIAL_GROUPS, DerivativeMovementInventoryTable(), WorkshopBlock(), WorkshopBlock(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS (+27 more)

### Community 21 - "SalesFactTable.tsx"
Cohesion: 0.07
Nodes (53): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND (+45 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.13
Nodes (29): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, plannedProductionVolumePieces(), targetClosingPiecesFromNorm(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection() (+21 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.12
Nodes (32): Удаление, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), openingReferencedProductIds(), averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+24 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.08
Nodes (55): GridInput(), RowCell(), TotalCell(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormTotals (+47 more)

### Community 26 - "index.ts"
Cohesion: 0.11
Nodes (53): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMN_KIND, ColumnKey (+45 more)

### Community 27 - "Icons.tsx"
Cohesion: 0.35
Nodes (9): Glyph(), IconCheck(), IconChevronLeft(), IconClose(), IconCross(), IconList(), IconMenu(), IconPrint() (+1 more)

### Community 28 - "TableNumber"
Cohesion: 0.22
Nodes (20): MetricCell(), CategoryBlock(), FinishedGoodsMonthTable(), groupEndClass(), ProductRow(), RowCell(), TotalsCell(), RowCell() (+12 more)

### Community 29 - "monthKeyFromDate"
Cohesion: 0.16
Nodes (25): monthKeyFromDate(), planMonthOpen(), shiftMonth(), saleTotals, workingSalesInMonth(), lastHorizonMonth(), resolveMonth(), InventoryScreen() (+17 more)

### Community 30 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.16
Nodes (18): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), DayDateControl() (+10 more)

### Community 31 - "document.ts"
Cohesion: 0.12
Nodes (18): catalogCategories(), DeletableRecord, Derivative, FinishedGoodsNorm, FinishedGoodsOpening, FinishedGoodsOpeningLine, Material, MATERIAL_UNITS (+10 more)

### Community 32 - "movement-plan.ts"
Cohesion: 0.14
Nodes (30): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookOpeningPiecesForProduct(), closingInventoryDeviationPieces(), closingStockPieces(), FinishedGoodsOpeningRejection, hasStoredInventoryLine(), openingDeviationPieces() (+22 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.12
Nodes (33): costWithVat(), priceAverage(), rangePlanProduction(), rangePlanSales(), amountExVat(), amountWithVat(), ratioRound(), applyRowLens() (+25 more)

### Community 34 - "layout.tsx"
Cohesion: 0.18
Nodes (7): metadata, onest, RootLayout(), unbounded, AppShell(), MockReset(), RoleSwitcher()

### Community 35 - "materials/text.ts"
Cohesion: 0.15
Nodes (12): MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialMovementRow, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MATERIAL_DOCUMENT_ERROR (+4 more)

### Community 36 - "RoleProvider.tsx"
Cohesion: 0.24
Nodes (13): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, DEFAULT_ROLE_ID, isRoleId() (+5 more)

### Community 37 - "SaleFormTable.tsx"
Cohesion: 0.05
Nodes (83): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+75 more)

### Community 39 - "FinishedProductsScreen.tsx"
Cohesion: 0.27
Nodes (10): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE, RecipeJournalsScreen() (+2 more)

### Community 40 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.15
Nodes (24): metadata, MovementPage(), activeCategories(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FullscreenToggle(), FinishedGoodsMonthScreen() (+16 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.11
Nodes (23): DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE, DERIVATIVE_MOVEMENT_SUMMARY_HREF, MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, PRODUCTION_SECTION_TITLE, currentNavLabel() (+15 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "PageFrame"
Cohesion: 0.11
Nodes (33): nextConfig, next, react, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage() (+25 more)

### Community 45 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 46 - "materialReceiptsList"
Cohesion: 0.20
Nodes (12): emptyPlanLine(), hasStoredMaterialInventoryLine(), materialMonthPlansList(), materialNormsList(), materialOpeningsList(), materialReceiptsInMonth(), materialReceiptsList(), openingFor() (+4 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "DocumentProvider.tsx"
Cohesion: 0.19
Nodes (17): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+9 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.13
Nodes (22): DerivativePage(), metadata, metadata, NewDerivativePage(), DerivativeAddRejection, derivativeByIdOrNull(), isDerivativeWorkshopId(), updateDerivative() (+14 more)

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

### Community 58 - "recipe-yield.ts"
Cohesion: 0.25
Nodes (9): MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef (+1 more)

### Community 62 - "RecipePrint.tsx"
Cohesion: 0.14
Nodes (22): react-dom, MATERIAL_WAREHOUSES, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), componentDraftKey(), DerivativeLineDraft, RecipeListSection, draftsFromSavedLines() (+14 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.14
Nodes (11): Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется, Остаток на конец, Остаток на начало (+3 more)

### Community 64 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 65 - "FinishedProductEditScreen.tsx"
Cohesion: 0.16
Nodes (11): FinishedProductRecipePage(), metadata, ProductRecipeLine, ProductRecipeRejection, DerivativeCompositionEditor(), RecipeComponentSearch(), FinishedProductEditScreen(), initialPiecesDraft() (+3 more)

### Community 66 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.14
Nodes (26): isOccurredOn(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+18 more)

### Community 67 - "RecipeJournalsTable.tsx"
Cohesion: 0.20
Nodes (15): MaterialsPlanTable(), materialUnitHint(), planColumnKind(), formatMaterialWeightPair(), componentLabel(), CompositionLine(), DeleteAction(), ItemRow() (+7 more)

### Community 68 - "RolesScreen.tsx"
Cohesion: 0.31
Nodes (7): metadata, RolesPage(), ROLES_HREF, ROLES_TITLE, PERMISSION_MATRIX_ROWS, ROLES, RolesScreen()

### Community 69 - "MaterialsNormsScreen.tsx"
Cohesion: 0.36
Nodes (7): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 70 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (25): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), occurredOnOpen() (+17 more)

### Community 71 - "ProductionPlanScreen.tsx"
Cohesion: 0.12
Nodes (25): metadata, metadata, ProductionJournalPage(), metadata, ProductionPlanPage(), productionEntryPieces(), workingProductionEntriesInMonth(), missingProductionPlanProducts() (+17 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 397 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `PageFrame` to `summary.ts`, `ProductionEntryScreen.tsx`, `sales-plan.ts`, `package.json`, `derivatives.ts`, `useDocumentStore`, `MovementPlanScreen.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `layout.tsx`, `SaleFormTable.tsx`, `FinishedProductsScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `AppShell.tsx`, `DerivativeCreateScreen.tsx`, `FinishedProductEditScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `RolesScreen.tsx`, `MaterialsNormsScreen.tsx`, `MaterialDocumentScreen.tsx`, `ProductionPlanScreen.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.053775965831877305 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `summary.ts`, `ProductionEntryScreen.tsx`, `sales-plan.ts`, `MaterialsSummaryTable.tsx`, `package.json`, `keepWithNext`, `ColumnLabel`, `useDocumentStore`, `MovementPlanScreen.tsx`, `MaterialReceiptFormTable.tsx`, `SalesFactTable.tsx`, `SummaryTable.tsx`, `index.ts`, `Icons.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `RoleProvider.tsx`, `SaleFormTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `AppShell.tsx`, `DocumentProvider.tsx`, `DerivativeCreateScreen.tsx`, `RecipePrint.tsx`, `FinishedProductEditScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialDocumentScreen.tsx`, `ProductionPlanScreen.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09268707482993198 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `production-plan.ts` to `summary.ts`, `movement-plan.ts`, `sales-plan.ts`, `derivative-movement.ts`, `production-fact.ts`, `finished-goods.ts`, `materials.ts`, `Ввод плана (производство)`, `sales-fact.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0584385226741468 - nodes in this community are weakly interconnected._