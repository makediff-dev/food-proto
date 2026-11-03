# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 212 files · ~123,577 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1946 nodes · 7343 edges · 77 communities (70 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12c09971`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- MaterialsSummaryTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- RoleProvider.tsx
- IconChevronDown
- compilerOptions
- DerivativeForm
- ProductionFactTable.tsx
- movement-plan.ts
- SummaryTable.tsx
- monthKeyFromDate
- mock-materials.ts
- materials.ts
- ProductionJournalFactScreen.tsx
- index.ts
- production-plan.ts
- sales-fact.ts
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsMonthTable.tsx
- finished-product-cost.ts
- FinishedProductEditScreen.tsx
- Icons.tsx
- SummaryScreen.tsx
- MaterialDocumentScreen.tsx
- derivatives.ts
- production-fact.ts
- derivative-cost.ts
- derivative-movement/paths.ts
- MovementPlanScreen.tsx
- SaleScreen.tsx
- flow.md
- recipes/paths.ts
- PlanRedirect.tsx
- AppShell.tsx
- Отчет общий сырья
- DerivativeMovementSummaryTable.tsx
- postcss.config.mjs
- sales-plan.ts
- FinishedGoodsFactScreen.tsx
- Отчет общий движения
- ProductionEntryFormTable.tsx
- DerivativeCreateScreen.tsx
- document.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- use-materials.ts
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- DerivativeCompositionEditor
- Отчет общий движения производных
- SalesFactScreen.tsx
- RecipePrint.tsx
- SummaryHeadlineTable.tsx
- RecipeJournalsTable.tsx
- layout.tsx
- document-storage.ts
- materials/paths.ts
- RolesScreen.tsx
- MaterialDocumentScreen
- Себестоимость готовой продукции
- MaterialsNormsScreen
- next
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
- `Свод` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/tables/derivative-cost.md → src/domain/derivative-cost.ts

## Import Cycles
- 3-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/recipe-consumption.ts -> src/domain/derivatives.ts`
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (77 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (40): Единицы, SalesPlan, salesPlanTotals, actualRangeSummary(), applyFactScale(), applyPlanScale(), applySummaryLens(), calendarDays() (+32 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (60): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+52 more)

### Community 2 - "products.ts"
Cohesion: 0.11
Nodes (44): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+36 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (35): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+27 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.08
Nodes (51): MaterialMovementRow, MaterialMovementTotals, COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), derivativeNormRangeInvalid(), DerivativeRow() (+43 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (41): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+33 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.11
Nodes (52): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+44 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.20
Nodes (15): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, DEFAULT_ROLE_ID, isRoleId() (+7 more)

### Community 11 - "IconChevronDown"
Cohesion: 0.10
Nodes (42): DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), columnEdgeClass(), DerivativeRow(), WorkshopBlock(), GroupBlock(), CategoryBlock() (+34 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.11
Nodes (42): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), setLine() (+34 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.23
Nodes (21): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+13 more)

### Community 15 - "movement-plan.ts"
Cohesion: 0.11
Nodes (37): Удаление, Product, finishedGoodsGridProducts(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingReferencedProductIds() (+29 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.12
Nodes (31): InventoryTable(), ProductionJournalFactTable(), TotalCell(), visibleDayRows(), ProductionPlanTable(), DerivativeCostTable(), VAT_PARSE_ERROR, CategoryBlock() (+23 more)

### Community 17 - "monthKeyFromDate"
Cohesion: 0.13
Nodes (31): productionEntryPieces(), workingProductionEntriesInMonth(), missingProductionPlanProducts(), activeProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth() (+23 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (41): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials(), deleteMaterialReceipt() (+33 more)

### Community 20 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.26
Nodes (10): defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS (+2 more)

### Community 21 - "index.ts"
Cohesion: 0.10
Nodes (43): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+35 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (27): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+19 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.11
Nodes (33): DocumentState, DocumentStoreValue, costWithVat(), unitCost, PrototypeDocument, amountWithVat(), averageAmount(), percentHundredths() (+25 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (37): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, GridInput(), groupTotals() (+29 more)

### Community 26 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (43): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+35 more)

### Community 27 - "finished-product-cost.ts"
Cohesion: 0.16
Nodes (21): Свод, Свод, buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode (+13 more)

### Community 28 - "FinishedProductEditScreen.tsx"
Cohesion: 0.24
Nodes (11): FinishedProductRecipePage(), metadata, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), FinishedProductEditScreen(), warehouseLabel() (+3 more)

### Community 29 - "Icons.tsx"
Cohesion: 0.10
Nodes (33): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+25 more)

### Community 30 - "SummaryScreen.tsx"
Cohesion: 0.17
Nodes (25): activeCategories(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), planningHref(), productionFactHref(), productionFactPageTitle() (+17 more)

### Community 31 - "MaterialDocumentScreen.tsx"
Cohesion: 0.11
Nodes (17): MATERIAL_WAREHOUSES, MaterialWarehouseId, MaterialWeightPair, MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MaterialWarehouseMovement (+9 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.15
Nodes (26): addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, isDerivativeUnit(), lineKey(), updateDerivative(), validateLines() (+18 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.15
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 34 - "derivative-cost.ts"
Cohesion: 0.13
Nodes (30): buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeConsumptionPrice() (+22 more)

### Community 35 - "derivative-movement/paths.ts"
Cohesion: 0.15
Nodes (16): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+8 more)

### Community 36 - "MovementPlanScreen.tsx"
Cohesion: 0.15
Nodes (20): metadata, MovementPlanPage(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), MovementPlanScreen(), resolveMonth() (+12 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (71): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+63 more)

### Community 38 - "flow.md"
Cohesion: 0.36
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "recipes/paths.ts"
Cohesion: 0.12
Nodes (26): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes(), isDerivativeWorkshopId() (+18 more)

### Community 40 - "PlanRedirect.tsx"
Cohesion: 0.29
Nodes (9): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref(), PlanRedirect() (+1 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.17
Nodes (16): SALES_SECTION_TITLE, currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV, MOVEMENT_NAV, NavItem, navItemIsCurrent(), navItemLinkClassName() (+8 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.11
Nodes (24): DerivativeMovementRow, DerivativeMovementSection, COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeMovementSummaryTable() (+16 more)

### Community 45 - "sales-plan.ts"
Cohesion: 0.27
Nodes (14): activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan(), isPrice(), isVolume(), lineNumbersRejection() (+6 more)

### Community 46 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.09
Nodes (36): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth() (+28 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "ProductionEntryFormTable.tsx"
Cohesion: 0.07
Nodes (60): fromRubles(), parseDecimal(), formatKopecks(), RowCell(), TotalCell(), buildGroups(), COLUMN_KIND, ColumnKey (+52 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.18
Nodes (12): DerivativePage(), metadata, metadata, NewDerivativePage(), DERIVATIVE_WORKSHOPS, DerivativeCreateScreen(), DerivativeEditScreen(), draftsFromLines() (+4 more)

### Community 50 - "document.ts"
Cohesion: 0.08
Nodes (27): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), catalogCategories(), DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNorm, FinishedGoodsNormLine (+19 more)

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

### Community 58 - "use-materials.ts"
Cohesion: 0.20
Nodes (25): addMaterial(), deleteMaterial(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent(), materialById() (+17 more)

### Community 62 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "SalesFactScreen.tsx"
Cohesion: 0.26
Nodes (12): defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), resolveMonth(), SalesFactScreen() (+4 more)

### Community 65 - "RecipePrint.tsx"
Cohesion: 0.26
Nodes (16): derivativeWorkshopById(), warehouseIdForWorkshop(), formatQuantity(), componentDraftKey(), derivativePrintModel(), draftsFromSavedLines(), GroupRows(), lineFromDraft() (+8 more)

### Community 66 - "SummaryHeadlineTable.tsx"
Cohesion: 0.26
Nodes (11): OperatingExpenseSide, SummaryLens, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS (+3 more)

### Community 67 - "RecipeJournalsTable.tsx"
Cohesion: 0.19
Nodes (16): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+8 more)

### Community 68 - "layout.tsx"
Cohesion: 0.22
Nodes (6): metadata, onest, RootLayout(), unbounded, AppShell(), RoleSwitcher()

### Community 69 - "document-storage.ts"
Cohesion: 0.31
Nodes (8): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), createMockDocument()

### Community 70 - "materials/paths.ts"
Cohesion: 0.13
Nodes (19): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+11 more)

### Community 71 - "RolesScreen.tsx"
Cohesion: 0.39
Nodes (6): metadata, RolesPage(), ROLES_HREF, ROLES_TITLE, RolesScreen(), IconCross()

### Community 72 - "MaterialDocumentScreen"
Cohesion: 0.32
Nodes (6): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MaterialDocumentScreen(), NEW_MATERIAL_RECEIPT_TITLE

### Community 74 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 75 - "next"
Cohesion: 0.09
Nodes (48): nextConfig, next, react, metadata, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata (+40 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 426 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `IconChevronDown`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `FinishedProductEditScreen.tsx`, `Icons.tsx`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `derivative-movement/paths.ts`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `recipes/paths.ts`, `PlanRedirect.tsx`, `AppShell.tsx`, `FinishedGoodsFactScreen.tsx`, `DerivativeCreateScreen.tsx`, `SalesFactScreen.tsx`, `RecipeJournalsTable.tsx`, `layout.tsx`, `materials/paths.ts`, `RolesScreen.tsx`, `MaterialDocumentScreen`, `MaterialsNormsScreen`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11149825783972125 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `ProductionEntryScreen.tsx`, `MaterialsSummaryTable.tsx`, `package.json`, `RoleProvider.tsx`, `IconChevronDown`, `ProductionFactTable.tsx`, `SummaryTable.tsx`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `index.ts`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsMonthTable.tsx`, `FinishedProductEditScreen.tsx`, `Icons.tsx`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `PlanRedirect.tsx`, `AppShell.tsx`, `DerivativeMovementSummaryTable.tsx`, `FinishedGoodsFactScreen.tsx`, `ProductionEntryFormTable.tsx`, `DerivativeCreateScreen.tsx`, `SalesFactScreen.tsx`, `RecipeJournalsTable.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05674044265593561 - nodes in this community are weakly interconnected._
- **Why does `PageFrame()` connect `next` to `ProductionEntryScreen.tsx`, `MaterialsSummaryTable.tsx`, `DerivativeForm`, `monthKeyFromDate`, `ProductionJournalFactScreen.tsx`, `FinishedProductEditScreen.tsx`, `Icons.tsx`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `recipes/paths.ts`, `PlanRedirect.tsx`, `FinishedGoodsFactScreen.tsx`, `DerivativeCreateScreen.tsx`, `SalesFactScreen.tsx`, `RecipeJournalsTable.tsx`, `RolesScreen.tsx`, `MaterialDocumentScreen`, `MaterialsNormsScreen`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1054421768707483 - nodes in this community are weakly interconnected._