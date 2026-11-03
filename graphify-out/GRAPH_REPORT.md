# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 214 files · ~125,090 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1967 nodes · 7450 edges · 75 communities (68 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eaad11e0`
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
- IconChevronDown
- compilerOptions
- FinishedProductEditScreen.tsx
- keepWithNext
- MaterialsSummaryTable.tsx
- SummaryTable.tsx
- monthKeyFromDate
- document.ts
- movementRow
- sales/text.ts
- index.ts
- production-plan.ts
- sales-fact.ts
- Флоу товара
- Icons.tsx
- FinishedGoodsMonthTable.tsx
- finished-product-cost.ts
- ProductIndex
- PlanningScreen.tsx
- SummaryScreen.tsx
- recipe-yield.ts
- derivatives.ts
- production-fact.ts
- access.ts
- useRole
- MovementPlanScreen.tsx
- SaleScreen.tsx
- flow.md
- derivative-cost.ts
- PlanRedirect.tsx
- AppShell.tsx
- Отчет общий сырья
- DocumentProvider.tsx
- postcss.config.mjs
- sales-plan.ts
- InventoryScreen.tsx
- Отчет общий движения
- migrate-document.ts
- DerivativeCreateScreen.tsx
- MaterialsPlanScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- materials.ts
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- DerivativeCompositionEditor
- Отчет общий движения производных
- ProductionJournalFactScreen.tsx
- orderLines
- RecipePrint.tsx
- AppShell
- document-storage.ts
- materials/paths.ts
- Glyph
- MaterialDocumentScreen.tsx
- Себестоимость готовой продукции
- next
- Отчет подневный производства

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 84 edges
2. `next` - 77 edges
3. `PageFrame()` - 75 edges
4. `react` - 66 edges
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
- `Свод` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/tables/derivative-cost.md → src/domain/derivative-cost.ts
- `Свод` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/tables/finished-product-cost.md → src/domain/derivative-cost.ts

## Import Cycles
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`
- 3-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/recipe-consumption.ts -> src/domain/derivatives.ts`
- 3-file cycle: `src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts`
- 4-file cycle: `src/domain/finished-goods.ts -> src/domain/summary.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`
- 4-file cycle: `src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/production-journal.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts`
- 4-file cycle: `src/domain/finished-goods.ts -> src/domain/sales-fact.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`
- 4-file cycle: `src/domain/finished-goods.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`
- 4-file cycle: `src/domain/derivative-cost.ts -> src/domain/materials.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/derivative-cost.ts`
- 4-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/derivatives.ts`
- 5-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/sales-fact.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`
- 5-file cycle: `src/domain/derivative-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts -> src/domain/summary.ts -> src/domain/finished-product-cost.ts -> src/domain/derivative-cost.ts`
- 5-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts -> src/domain/summary.ts -> src/domain/finished-product-cost.ts -> src/domain/derivatives.ts`
- 5-file cycle: `src/domain/finished-goods.ts -> src/domain/summary.ts -> src/domain/sales-fact.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`
- 5-file cycle: `src/domain/finished-goods.ts -> src/domain/summary.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`
- 5-file cycle: `src/domain/derivative-cost.ts -> src/domain/materials.ts -> src/domain/production-journal.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/derivative-cost.ts`
- 5-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/production-journal.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/derivatives.ts`
- 5-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`
- 5-file cycle: `src/domain/derivative-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts -> src/domain/sales-fact.ts -> src/domain/finished-product-cost.ts -> src/domain/derivative-cost.ts`
- 5-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts -> src/domain/sales-fact.ts -> src/domain/finished-product-cost.ts -> src/domain/derivatives.ts`
- 5-file cycle: `src/domain/finished-goods.ts -> src/domain/sales-fact.ts -> src/domain/sales-plan.ts -> src/domain/finished-product-cost.ts -> src/domain/materials.ts -> src/domain/finished-goods.ts`

## Communities (75 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.10
Nodes (47): Единицы, SalesPlan, productCostPerPiece(), unitPriceFromBatch(), percentHundredths(), ratioRound(), vatPercentHundredths(), priceExVatTenThousandths() (+39 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (61): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+53 more)

### Community 2 - "products.ts"
Cohesion: 0.16
Nodes (31): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+23 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.15
Nodes (28): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+20 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (26): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+18 more)

### Community 5 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.09
Nodes (40): DerivativeMovementRow, DerivativeMovementSection, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), DerivativeRow() (+32 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (40): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Слои, Чего не делать, Блоки, Ввод плана (движение) (+32 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.08
Nodes (65): FinishedGoodsNormLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), clampSummaryMonth(), closingInventoryDeviationPieces() (+57 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.16
Nodes (18): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT, ALL_NAV_SECTIONS (+10 more)

### Community 11 - "IconChevronDown"
Cohesion: 0.10
Nodes (39): DerivativeMovementInventoryTable(), WorkshopBlock(), CategoryBlock(), CategoryBlock(), CategoryBlock(), CategoryBlock(), COLUMN_KIND, ColumnKey (+31 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.11
Nodes (43): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), commit() (+35 more)

### Community 14 - "keepWithNext"
Cohesion: 0.13
Nodes (34): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+26 more)

### Community 15 - "MaterialsSummaryTable.tsx"
Cohesion: 0.10
Nodes (29): Подсказки заголовков таблицы, MaterialMovementTotals, buildSections(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, GROUP_END_KEYS (+21 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (45): TotalCell(), CostCell(), CostCell(), TotalCell(), Pieces(), RowCell(), TotalCell(), VarianceValue() (+37 more)

### Community 17 - "monthKeyFromDate"
Cohesion: 0.16
Nodes (25): activeCategories(), productionEntryPieces(), workingProductionEntriesInMonth(), missingProductionPlanProducts(), workingProductionPlan(), monthKeyFromDate(), planMonthOpen(), shiftMonth() (+17 more)

### Community 18 - "document.ts"
Cohesion: 0.07
Nodes (39): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+31 more)

### Community 19 - "movementRow"
Cohesion: 0.16
Nodes (20): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+12 more)

### Community 20 - "sales/text.ts"
Cohesion: 0.14
Nodes (19): SalesPlanRejection, OperatingExpenseRejection, OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable() (+11 more)

### Community 21 - "index.ts"
Cohesion: 0.09
Nodes (61): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND (+53 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.11
Nodes (34): ProductionPlan, ProductionPlanLine, plannedProductionVolumePieces(), planOpeningPrice(), priceAverage(), rangePlanProduction(), rangePlanSales(), amountExVat() (+26 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.09
Nodes (40): Удаление, DocumentState, DocumentStoreValue, costWithVat(), UnitCost, Product, PrototypeDocument, amountWithVat() (+32 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "Icons.tsx"
Cohesion: 0.06
Nodes (57): react, setLine(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, emptyMaterialReceiptLineDraft(), EntryFormGroup (+49 more)

### Community 26 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.13
Nodes (31): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell(), ProductRow() (+23 more)

### Community 27 - "finished-product-cost.ts"
Cohesion: 0.18
Nodes (16): Свод, Свод, componentUnitPrice(), costForQuantity(), FinishedProductCostLineContribution, FinishedProductCostMode, FinishedProductCostMonthView, FinishedProductCostRow (+8 more)

### Community 28 - "ProductIndex"
Cohesion: 0.12
Nodes (19): editableFieldNear(), ProductRow(), editableFieldNear(), ProductRow(), columnEdgeClass(), ColumnKey, COLUMNS, RecipeCostDetailLine (+11 more)

### Community 29 - "PlanningScreen.tsx"
Cohesion: 0.17
Nodes (20): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+12 more)

### Community 30 - "SummaryScreen.tsx"
Cohesion: 0.23
Nodes (19): ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref(), productionFactPageTitle(), ProductionFactScreen() (+11 more)

### Community 31 - "recipe-yield.ts"
Cohesion: 0.17
Nodes (17): FinishedProductRecipePage(), metadata, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield() (+9 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.17
Nodes (20): addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, derivativeWorkshopById(), isDerivativeUnit(), isDerivativeWorkshopId(), lineKey() (+12 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.17
Nodes (28): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+20 more)

### Community 34 - "access.ts"
Cohesion: 0.17
Nodes (15): Поток данных, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, RECIPES_COST_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_COST_HREF, RECIPES_FINISHED_HREF (+7 more)

### Community 35 - "useRole"
Cohesion: 0.13
Nodes (24): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), sumMoney() (+16 more)

### Community 36 - "MovementPlanScreen.tsx"
Cohesion: 0.18
Nodes (15): metadata, MovementPlanPage(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, FullscreenToggle(), MovementPlanScreen(), resolveMonth() (+7 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (73): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), SaleLine, productAllowedInPeriodSale() (+65 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "derivative-cost.ts"
Cohesion: 0.11
Nodes (37): metadata, RecipeDerivativesPage(), buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+29 more)

### Community 40 - "PlanRedirect.tsx"
Cohesion: 0.26
Nodes (10): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref(), PlanRedirect() (+2 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.11
Nodes (22): DERIVATIVE_MOVEMENT_SECTION_TITLE, MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, RECIPES_SECTION_TITLE, SALES_FACT_TITLE, SALES_SECTION_TITLE, currentNavLabel(), DERIVATIVE_MOVEMENT_NAV (+14 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "DocumentProvider.tsx"
Cohesion: 0.39
Nodes (7): commitDocumentUpdate(), DocumentSource, DocumentStoreContext, addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), openPlan(), useProductionPlan()

### Community 45 - "sales-plan.ts"
Cohesion: 0.21
Nodes (21): SalesPlanLine, activeProducts(), activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection(), addSalesPlan(), createRejection(), defaultSalesPlanLines() (+13 more)

### Community 46 - "InventoryScreen.tsx"
Cohesion: 0.10
Nodes (33): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), FullscreenToggle(), FinishedGoodsMonthScreen() (+25 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.17
Nodes (16): DerivativePage(), metadata, metadata, NewDerivativePage(), DERIVATIVE_WORKSHOPS, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), DerivativeCreateScreen() (+8 more)

### Community 50 - "MaterialsPlanScreen.tsx"
Cohesion: 0.15
Nodes (16): MaterialGroupId, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialGroupMovement, MaterialMovementRow, MaterialNormRejection, MaterialOpeningRejection (+8 more)

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

### Community 58 - "materials.ts"
Cohesion: 0.11
Nodes (48): MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine(), isMaterialGroupId() (+40 more)

### Community 62 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.08
Nodes (49): metadata, SalesFactPage(), isOccurredOn(), recommendedDayKey(), defaultProductionEntryDay(), defaultProductionJournalFactDay(), defaultSalesFactDay(), DayDateControl() (+41 more)

### Community 65 - "orderLines"
Cohesion: 0.67
Nodes (3): orderLines(), productionFromOrders(), salesFromOrders()

### Community 67 - "RecipePrint.tsx"
Cohesion: 0.09
Nodes (36): react-dom, metadata, RecipeFinishedPage(), Derivative, productCompositionLines(), productRecipeSections(), componentDraftKey(), FinishedProductsScreen() (+28 more)

### Community 68 - "AppShell"
Cohesion: 0.18
Nodes (7): metadata, onest, RootLayout(), unbounded, AppShell(), MockReset(), RoleSwitcher()

### Community 69 - "document-storage.ts"
Cohesion: 0.31
Nodes (8): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), createMockDocument()

### Community 70 - "materials/paths.ts"
Cohesion: 0.11
Nodes (23): MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+15 more)

### Community 71 - "Glyph"
Cohesion: 0.20
Nodes (12): metadata, RolesPage(), ROLES_HREF, ROLES_TITLE, PERMISSION_MATRIX_ROWS, permissionAllowed(), ROLES, RolesScreen() (+4 more)

### Community 72 - "MaterialDocumentScreen.tsx"
Cohesion: 0.12
Nodes (23): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MaterialReceiptsPage(), metadata, MATERIAL_WAREHOUSES, materialReceiptById() (+15 more)

### Community 75 - "next"
Cohesion: 0.14
Nodes (31): nextConfig, next, metadata, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, RecipesFinishedCostDetailPage() (+23 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 436 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `IconChevronDown`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `recipe-yield.ts`, `access.ts`, `useRole`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `derivative-cost.ts`, `PlanRedirect.tsx`, `AppShell.tsx`, `InventoryScreen.tsx`, `DerivativeCreateScreen.tsx`, `MaterialsPlanScreen.tsx`, `ProductionJournalFactScreen.tsx`, `RecipePrint.tsx`, `AppShell`, `materials/paths.ts`, `Glyph`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10204081632653061 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `ProductionEntryScreen.tsx`, `DerivativeMovementSummaryTable.tsx`, `package.json`, `RoleProvider.tsx`, `IconChevronDown`, `FinishedProductEditScreen.tsx`, `keepWithNext`, `MaterialsSummaryTable.tsx`, `SummaryTable.tsx`, `monthKeyFromDate`, `index.ts`, `FinishedGoodsMonthTable.tsx`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `access.ts`, `useRole`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `PlanRedirect.tsx`, `AppShell.tsx`, `DocumentProvider.tsx`, `InventoryScreen.tsx`, `DerivativeCreateScreen.tsx`, `MaterialsPlanScreen.tsx`, `ProductionJournalFactScreen.tsx`, `RecipePrint.tsx`, `materials/paths.ts`, `MaterialDocumentScreen.tsx`, `next`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05707762557077625 - nodes in this community are weakly interconnected._
- **Why does `PageFrame()` connect `next` to `ProductionEntryScreen.tsx`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `index.ts`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `recipe-yield.ts`, `useRole`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `PlanRedirect.tsx`, `InventoryScreen.tsx`, `DerivativeCreateScreen.tsx`, `MaterialsPlanScreen.tsx`, `ProductionJournalFactScreen.tsx`, `RecipePrint.tsx`, `materials/paths.ts`, `Glyph`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `mock-document.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._