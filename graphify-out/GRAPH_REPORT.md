# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 212 files · ~123,261 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1945 nodes · 7334 edges · 76 communities (69 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20ab6593`
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
- DerivativeCostTable.tsx
- compilerOptions
- FinishedProductEditScreen.tsx
- ProductionJournalFactTable.tsx
- movement-plan.ts
- SummaryTable.tsx
- ProductionJournalScreen.tsx
- mock-materials.ts
- materials.ts
- ProductionJournalFactScreen.tsx
- index.ts
- production-plan.ts
- production-journal-fact.ts
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsMonthTable.tsx
- materialById
- sales-fact/paths.ts
- PlanningScreen.tsx
- SummaryScreen.tsx
- materials/text.ts
- derivatives.ts
- production-fact.ts
- sales.ts
- derivative-movement/paths.ts
- planMonthOpen
- SaleScreen.tsx
- flow.md
- recipes/paths.ts
- next
- AppShell.tsx
- Отчет общий сырья
- production-journal.ts
- postcss.config.mjs
- sales-plan.ts
- InventoryScreen.tsx
- Отчет общий движения
- Cells.tsx
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
- RecipeComponentSearch
- Отчет общий движения производных
- Icons.tsx
- RecipePrint.tsx
- FinishedProductCostTable.tsx
- RecipeJournalsTable.tsx
- layout.tsx
- document-storage.ts
- materials/paths.ts
- RolesScreen.tsx
- MaterialDocumentScreen.tsx
- Себестоимость готовой продукции
- monthKeyFromDate
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

## Communities (76 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.08
Nodes (61): Единицы, costWithVat(), UnitCost, SalesPlan, productCostPerPiece(), amountWithVat(), averageAmount(), percentHundredths() (+53 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.11
Nodes (31): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), isOccurredOn(), occurredOnOpen(), defaultProductionEntryDay(), maxProductionEntryOccurredOn() (+23 more)

### Community 2 - "products.ts"
Cohesion: 0.11
Nodes (44): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+36 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.06
Nodes (72): buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeConsumptionPrice() (+64 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.06
Nodes (63): DerivativeMovementRow, DerivativeMovementSection, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), DerivativeRow() (+55 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (40): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+32 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.12
Nodes (47): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+39 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.17
Nodes (17): RootLayout(), readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, DEFAULT_ROLE_ID (+9 more)

### Community 11 - "DerivativeCostTable.tsx"
Cohesion: 0.21
Nodes (14): DerivativeMovementInventoryTable(), WorkshopBlock(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell() (+6 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.11
Nodes (44): outputPieceThousandthsOf(), activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm() (+36 more)

### Community 14 - "ProductionJournalFactTable.tsx"
Cohesion: 0.15
Nodes (23): adjacentDay(), ArrowButton(), DayLabel(), dayOfMonth(), ArrowButton(), CategoryBlock(), COLUMN_KIND, ColumnKey (+15 more)

### Community 15 - "movement-plan.ts"
Cohesion: 0.11
Nodes (37): Удаление, finishedGoodsGridProducts(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingReferencedProductIds(), setFinishedGoodsOpening() (+29 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.07
Nodes (68): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, TotalCell(), CategoryBlock(), ColumnHeadings(), ColumnKey (+60 more)

### Community 17 - "ProductionJournalScreen.tsx"
Cohesion: 0.24
Nodes (13): metadata, ProductionJournalPage(), productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), productionEntryHref(), productionEntryNewHref(), entryComposition() (+5 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (38): costExVat(), MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity() (+30 more)

### Community 20 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.12
Nodes (24): metadata, ProductionFactPage(), metadata, ProductionPage(), defaultProductionJournalFactDay(), parseProductionFactQuery(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE (+16 more)

### Community 21 - "index.ts"
Cohesion: 0.10
Nodes (57): MaterialMovementTotals, COLUMNS, NormCell(), ColumnKey, COLUMNS, materialUnitHint(), QuantityCell(), formatMaterialWeightPair() (+49 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.15
Nodes (25): commitDocumentUpdate(), ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+17 more)

### Community 23 - "production-journal-fact.ts"
Cohesion: 0.16
Nodes (16): DocumentState, DocumentStoreValue, Product, PrototypeDocument, dayTotals(), ProductionJournalFactDayView, productionJournalFactGridProducts(), ProductionJournalFactGroup (+8 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (65): OperatingExpenseSide, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+57 more)

### Community 26 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.09
Nodes (46): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock() (+38 more)

### Community 27 - "materialById"
Cohesion: 0.22
Nodes (14): Свод, Свод, componentUnitPrice(), emptyPlanLine(), isPrice(), materialById(), materialConsumptionPrice(), materialMonthPlansList() (+6 more)

### Community 28 - "sales-fact/paths.ts"
Cohesion: 0.15
Nodes (16): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+8 more)

### Community 29 - "PlanningScreen.tsx"
Cohesion: 0.11
Nodes (29): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+21 more)

### Community 30 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (30): activeCategories(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection, SummaryLens, productionFactHref() (+22 more)

### Community 31 - "materials/text.ts"
Cohesion: 0.10
Nodes (25): ProductRecipeLine, MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, ProductRecipeRejection, isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS (+17 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.19
Nodes (19): activeDerivatives(), addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, derivativeWorkshopById(), isDerivativeUnit(), lineKey() (+11 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (33): amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows() (+25 more)

### Community 34 - "sales.ts"
Cohesion: 0.29
Nodes (16): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales() (+8 more)

### Community 35 - "derivative-movement/paths.ts"
Cohesion: 0.15
Nodes (16): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+8 more)

### Community 36 - "planMonthOpen"
Cohesion: 0.14
Nodes (24): metadata, MovementPlanPage(), LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), planMonthOpen(), shiftMonth(), saleTotals (+16 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.19
Nodes (23): saleLineAmountWithVat(), saleLinePriceWithVat(), salesJournalHref(), emptySaleLineDraft(), rowMetrics(), SaleLineDraft, SaleLineField, initialDrafts() (+15 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "recipes/paths.ts"
Cohesion: 0.11
Nodes (29): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines() (+21 more)

### Community 40 - "next"
Cohesion: 0.16
Nodes (15): nextConfig, next, Home(), metadata, metadata, PlanPage(), metadata, RecipesCostDetailPage() (+7 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.15
Nodes (18): AppShell(), currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV, MOVEMENT_NAV, NavGroup(), NavItem, navItemIsCurrent() (+10 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "production-journal.ts"
Cohesion: 0.29
Nodes (15): ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection(), productionEntryByIdOrNull() (+7 more)

### Community 45 - "sales-plan.ts"
Cohesion: 0.14
Nodes (22): metadata, ProductionPlanPage(), missingProductionPlanProducts(), activeProducts(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines() (+14 more)

### Community 46 - "InventoryScreen.tsx"
Cohesion: 0.09
Nodes (38): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth() (+30 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "Cells.tsx"
Cohesion: 0.14
Nodes (21): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), lineAmountWithVat() (+13 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.27
Nodes (8): DerivativePage(), metadata, metadata, NewDerivativePage(), DERIVATIVE_WORKSHOPS, DerivativeCreateScreen(), DerivativeEditScreen(), NEW_DERIVATIVE_TITLE

### Community 50 - "document.ts"
Cohesion: 0.08
Nodes (26): catalogCategories(), DeletableRecord, Derivative, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpening, FinishedGoodsOpeningLine, Material (+18 more)

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
Nodes (24): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isVatPercent(), materialNameRejection (+16 more)

### Community 62 - "RecipeComponentSearch"
Cohesion: 0.29
Nodes (4): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups(), IconSearch()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "Icons.tsx"
Cohesion: 0.12
Nodes (28): defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+20 more)

### Community 65 - "RecipePrint.tsx"
Cohesion: 0.21
Nodes (17): MATERIAL_WAREHOUSES, formatQuantity(), draftsFromLines(), componentDraftKey(), DerivativeLineDraft, derivativePrintModel(), draftsFromSavedLines(), formatPrintPercent() (+9 more)

### Community 66 - "FinishedProductCostTable.tsx"
Cohesion: 0.29
Nodes (10): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostRow(), FinishedProductCostTable(), GROUP_END_KEYS (+2 more)

### Community 67 - "RecipeJournalsTable.tsx"
Cohesion: 0.19
Nodes (17): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+9 more)

### Community 68 - "layout.tsx"
Cohesion: 0.40
Nodes (3): metadata, onest, unbounded

### Community 69 - "document-storage.ts"
Cohesion: 0.27
Nodes (9): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), createMockDocument() (+1 more)

### Community 70 - "materials/paths.ts"
Cohesion: 0.12
Nodes (20): MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+12 more)

### Community 71 - "RolesScreen.tsx"
Cohesion: 0.39
Nodes (6): metadata, RolesPage(), ROLES_HREF, ROLES_TITLE, RolesScreen(), IconCross()

### Community 72 - "MaterialDocumentScreen.tsx"
Cohesion: 0.18
Nodes (18): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), materialReceiptRejection(), DocumentForm(), changeWarehouse() (+10 more)

### Community 75 - "monthKeyFromDate"
Cohesion: 0.11
Nodes (43): react, metadata, RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), DocumentSource, DocumentStoreContext, useDocumentStore() (+35 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 427 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `DerivativeCostTable.tsx`, `FinishedProductEditScreen.tsx`, `ProductionJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `sales-fact/paths.ts`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `derivative-movement/paths.ts`, `planMonthOpen`, `SaleScreen.tsx`, `recipes/paths.ts`, `AppShell.tsx`, `sales-plan.ts`, `InventoryScreen.tsx`, `DerivativeCreateScreen.tsx`, `Icons.tsx`, `FinishedProductCostTable.tsx`, `RecipeJournalsTable.tsx`, `layout.tsx`, `materials/paths.ts`, `RolesScreen.tsx`, `MaterialDocumentScreen.tsx`, `monthKeyFromDate`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07785547785547786 - nodes in this community are weakly interconnected._
- **Why does `react` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `MaterialsSummaryTable.tsx`, `package.json`, `RoleProvider.tsx`, `DerivativeCostTable.tsx`, `FinishedProductEditScreen.tsx`, `ProductionJournalFactTable.tsx`, `SummaryTable.tsx`, `ProductionJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `index.ts`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsMonthTable.tsx`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `planMonthOpen`, `SaleScreen.tsx`, `next`, `AppShell.tsx`, `sales-plan.ts`, `InventoryScreen.tsx`, `Cells.tsx`, `DerivativeCreateScreen.tsx`, `Icons.tsx`, `FinishedProductCostTable.tsx`, `RecipeJournalsTable.tsx`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._
- **Why does `PageFrame()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `FinishedProductEditScreen.tsx`, `ProductionJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `index.ts`, `sales-fact/paths.ts`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `planMonthOpen`, `SaleScreen.tsx`, `recipes/paths.ts`, `next`, `sales-plan.ts`, `InventoryScreen.tsx`, `DerivativeCreateScreen.tsx`, `Icons.tsx`, `RecipeJournalsTable.tsx`, `materials/paths.ts`, `RolesScreen.tsx`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10726950354609929 - nodes in this community are weakly interconnected._