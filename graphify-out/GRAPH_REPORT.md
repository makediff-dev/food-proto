# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 214 files · ~125,879 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1969 nodes · 7452 edges · 83 communities (76 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03aec439`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryFormTable.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- MaterialsSummaryTable.tsx
- Предметная область
- movement-plan.ts
- package.json
- biome.json
- roles.ts
- ProductionPlanTable.tsx
- compilerOptions
- DerivativeForm
- ProductionFactTable.tsx
- DerivativeMovementSummaryTable.tsx
- SummaryTable.tsx
- ProductionPlanScreen.tsx
- document.ts
- movementRow
- sales/text.ts
- index.ts
- production-plan.ts
- sales-fact.ts
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsMonthTable.tsx
- finished-goods.ts
- RecipeCostDetailTable
- PlanningScreen.tsx
- SummaryScreen.tsx
- recipe-yield.ts
- derivatives.ts
- production-fact.ts
- access.ts
- derivative-movement/paths.ts
- monthKeyFromDate
- SaleScreen.tsx
- flow.md
- RecipePrint.tsx
- PlanRedirect.tsx
- AppShell.tsx
- Отчет общий сырья
- production-journal.ts
- postcss.config.mjs
- sales-plan.ts
- MovementPlanScreen.tsx
- Отчет общий движения
- SaleFormTable.tsx
- DerivativeCreateScreen.tsx
- Cells.tsx
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
- Icons.tsx
- sales.ts
- RecipeJournalsTable.tsx
- layout.tsx
- DocumentProvider.tsx
- MaterialsPlanScreen.tsx
- RolesScreen.tsx
- sales-fact/paths.ts
- Себестоимость готовой продукции
- MaterialsNormsScreen
- next
- AppShell
- FinishedProductsScreen.tsx
- Отчет подневный производства
- FinishedProductCostTable.tsx
- plannedProductionVolumePieces
- IconArrowLeft
- production/page.tsx

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
- `Поток данных` --references--> `PrototypeDocument`  [INFERRED]
  docs/architecture.md → src/domain/document.ts
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

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

## Communities (83 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.12
Nodes (36): SalesPlan, percentHundredths(), vatPercentHundredths(), salesPlanTotals, applyFactScale(), applyPlanScale(), applySummaryLens(), emptyFactSide() (+28 more)

### Community 1 - "ProductionEntryFormTable.tsx"
Cohesion: 0.09
Nodes (42): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), Product, amountExVat(), ProductionEntryRejection, productionLineAmountExVat() (+34 more)

### Community 2 - "products.ts"
Cohesion: 0.13
Nodes (37): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+29 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.05
Nodes (76): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+68 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (28): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+20 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.09
Nodes (39): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), DerivativeRow() (+31 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (37): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки (+29 more)

### Community 7 - "movement-plan.ts"
Cohesion: 0.13
Nodes (33): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), finishedGoodsGridProducts(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces() (+25 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "roles.ts"
Cohesion: 0.12
Nodes (17): readRole(), ROLE_STORAGE_KEY, writeRole(), ALL_EDIT, ALL_NAV_SECTIONS, DEFAULT_ROLE_ID, isRoleId(), NavSectionId (+9 more)

### Community 11 - "ProductionPlanTable.tsx"
Cohesion: 0.13
Nodes (23): DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, ProductionPlanTable() (+15 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.12
Nodes (38): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), commit() (+30 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 15 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.10
Nodes (28): Подсказки заголовков таблицы, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeMovementSummaryTable() (+20 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (47): ProductUnitPrice(), CategoryBlock(), ProductionJournalFactTable(), ProductRow(), RowCell(), TotalCell(), visibleDayRows(), CostCell() (+39 more)

### Community 17 - "ProductionPlanScreen.tsx"
Cohesion: 0.11
Nodes (29): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPlanPage(), productionEntryPieces(), workingProductionEntriesInMonth() (+21 more)

### Community 18 - "document.ts"
Cohesion: 0.06
Nodes (46): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+38 more)

### Community 19 - "movementRow"
Cohesion: 0.17
Nodes (20): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+12 more)

### Community 20 - "sales/text.ts"
Cohesion: 0.16
Nodes (18): SalesPlanRejection, OperatingExpenseRejection, OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable() (+10 more)

### Community 21 - "index.ts"
Cohesion: 0.09
Nodes (59): adjacentDay(), COLUMNS, COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel(), dayOfMonth() (+51 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (23): ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+15 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.14
Nodes (27): Удаление, averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds(), dayTotals(), ProductionJournalFactDayView (+19 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.13
Nodes (21): setLine(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, emptyMaterialReceiptLineDraft(), EntryFormGroup, EntryFormTotals (+13 more)

### Community 26 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.09
Nodes (46): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), FinishedGoodsFactTable() (+38 more)

### Community 27 - "finished-goods.ts"
Cohesion: 0.17
Nodes (31): isMonthKey(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide(), emptyRangeView(), emptyTotals() (+23 more)

### Community 28 - "RecipeCostDetailTable"
Cohesion: 0.50
Nodes (5): columnEdgeClass(), RecipeCostDetailTable(), sumMoney(), sumQuantity(), TotalEmpty()

### Community 29 - "PlanningScreen.tsx"
Cohesion: 0.14
Nodes (24): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), activeProducts(), deletedProducts(), missingPlanProducts() (+16 more)

### Community 30 - "SummaryScreen.tsx"
Cohesion: 0.17
Nodes (27): Единицы, recommendedVolumePiecesForMonths(), productionFactForLens(), rangeProductionFact(), actualRangeSummary(), calendarDays(), displayedOperatingExpense(), ensureRangeIncludesMonth() (+19 more)

### Community 31 - "recipe-yield.ts"
Cohesion: 0.22
Nodes (14): ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS (+6 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.13
Nodes (31): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), derivativeCompositionLines() (+23 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 34 - "access.ts"
Cohesion: 0.22
Nodes (8): DERIVATIVE_MOVEMENT_SUMMARY_HREF, RECIPES_COST_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_COST_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, SECTION_HOME, ROLES_HREF

### Community 35 - "derivative-movement/paths.ts"
Cohesion: 0.16
Nodes (15): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+7 more)

### Community 36 - "monthKeyFromDate"
Cohesion: 0.13
Nodes (29): metadata, MovementInventoryPage(), occurredOnOpen(), maxProductionEntryOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), saleTotals (+21 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.17
Nodes (27): metadata, NewSalePage(), defaultSaleDay(), maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), NEW_SALE_TITLE, salesJournalHref() (+19 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "RecipePrint.tsx"
Cohesion: 0.30
Nodes (13): derivativeWorkshopById(), warehouseIdForWorkshop(), componentDraftKey(), derivativePrintModel(), draftsFromSavedLines(), GroupRows(), lineFromDraft(), productPrintModel() (+5 more)

### Community 40 - "PlanRedirect.tsx"
Cohesion: 0.22
Nodes (12): Home(), metadata, metadata, PlanPage(), SummaryLens, parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref() (+4 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.14
Nodes (19): PRODUCTION_SECTION_TITLE, RECIPES_SECTION_TITLE, currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV, MOVEMENT_NAV, NAV_GROUPS, NavGroup() (+11 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "production-journal.ts"
Cohesion: 0.21
Nodes (19): Архитектура прототипа, Слои, Чего не делать, commitDocumentUpdate(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry() (+11 more)

### Community 45 - "sales-plan.ts"
Cohesion: 0.15
Nodes (25): costWithVat(), UnitCost, SalesPlanLine, amountWithVat(), ratioRound(), ProductionJournalFactRow, SalesFactRow, activeSalesPlans() (+17 more)

### Community 46 - "MovementPlanScreen.tsx"
Cohesion: 0.09
Nodes (37): metadata, MovementFactPage(), metadata, MovementPage(), metadata, MovementPlanPage(), activeCategories(), clampSummaryMonth() (+29 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "SaleFormTable.tsx"
Cohesion: 0.16
Nodes (22): ProductCategory, RowCell(), buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, formatKopecks() (+14 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.14
Nodes (23): metadata, NewDerivativePage(), DERIVATIVE_WORKSHOPS, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, formatMaterialWeightPair(), formatQuantity(), MATERIAL_NAME_ERROR (+15 more)

### Community 50 - "Cells.tsx"
Cohesion: 0.17
Nodes (18): formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), CellCommit, EditableNumber() (+10 more)

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
Cohesion: 0.10
Nodes (47): MaterialGroupId, MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), isMaterialGroupId() (+39 more)

### Community 62 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.08
Nodes (46): isOccurredOn(), recommendedDayKey(), defaultProductionEntryDay(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), defaultSalesFactDay(), DayDateControl(), onKeyDown() (+38 more)

### Community 65 - "Icons.tsx"
Cohesion: 0.17
Nodes (18): ArrowButton(), ArrowButton(), CandidateGroup, CandidateRow, CandidateRowView(), DerivativeComponentKind, DerivativeFormTable(), GridInput() (+10 more)

### Community 66 - "sales.ts"
Cohesion: 0.31
Nodes (15): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales() (+7 more)

### Community 67 - "RecipeJournalsTable.tsx"
Cohesion: 0.23
Nodes (13): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+5 more)

### Community 68 - "layout.tsx"
Cohesion: 0.29
Nodes (6): metadata, onest, RootLayout(), unbounded, RoleProvider(), roleById()

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.18
Nodes (18): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+10 more)

### Community 70 - "MaterialsPlanScreen.tsx"
Cohesion: 0.07
Nodes (45): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptPage(), metadata (+37 more)

### Community 71 - "RolesScreen.tsx"
Cohesion: 0.42
Nodes (6): metadata, RolesPage(), ROLES_TITLE, permissionAllowed(), RolesScreen(), IconCross()

### Community 72 - "sales-fact/paths.ts"
Cohesion: 0.18
Nodes (12): metadata, SalePage(), metadata, SalesJournalPage(), metadata, SalesFactPage(), parseSalesFactQuery(), parseSalesJournalQuery() (+4 more)

### Community 74 - "MaterialsNormsScreen"
Cohesion: 0.16
Nodes (13): MaterialsNormsPage(), metadata, hasStoredMaterialInventoryLine(), liveNorms(), materialConsumptionIsNormed(), materialNormQuantity(), materialNormsList(), materialOpeningsList() (+5 more)

### Community 75 - "next"
Cohesion: 0.11
Nodes (38): nextConfig, next, react, metadata, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata (+30 more)

### Community 76 - "AppShell"
Cohesion: 0.26
Nodes (8): Поток данных, pathnameSection(), roleCanAccessPath(), roleHomeHref(), RoleGate(), roleHasSection(), AppShell(), MockReset()

### Community 77 - "FinishedProductsScreen.tsx"
Cohesion: 0.29
Nodes (9): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE, RecipeJournalsScreen() (+1 more)

### Community 79 - "FinishedProductCostTable.tsx"
Cohesion: 0.29
Nodes (10): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostRow(), FinishedProductCostTable(), GROUP_END_KEYS (+2 more)

### Community 80 - "plannedProductionVolumePieces"
Cohesion: 0.31
Nodes (10): plannedProductionVolumePieces(), priceAverage(), rangePlanProduction(), rangePlanSales(), targetClosingPiecesFromNorm(), productionPlanLineMetrics, productionPlanTotals, planPriceWithVatForProduct() (+2 more)

### Community 81 - "IconArrowLeft"
Cohesion: 0.28
Nodes (7): FinishedProductRecipePage(), metadata, DerivativePage(), metadata, DerivativeEditScreen(), FinishedProductEditScreen(), IconArrowLeft()

### Community 82 - "production/page.tsx"
Cohesion: 0.38
Nodes (6): metadata, ProductionPage(), parseProductionFactQuery(), PRODUCTION_SUMMARY_TITLE, ProductionFactScreen(), resolveRange()

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 438 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryFormTable.tsx`, `package.json`, `ProductionPlanTable.tsx`, `ProductionPlanScreen.tsx`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `derivatives.ts`, `derivative-movement/paths.ts`, `monthKeyFromDate`, `SaleScreen.tsx`, `PlanRedirect.tsx`, `AppShell.tsx`, `MovementPlanScreen.tsx`, `DerivativeCreateScreen.tsx`, `ProductionJournalFactScreen.tsx`, `RecipeJournalsTable.tsx`, `layout.tsx`, `MaterialsPlanScreen.tsx`, `RolesScreen.tsx`, `sales-fact/paths.ts`, `MaterialsNormsScreen`, `AppShell`, `FinishedProductsScreen.tsx`, `FinishedProductCostTable.tsx`, `IconArrowLeft`, `production/page.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11948790896159317 - nodes in this community are weakly interconnected._
- **Why does `react` connect `next` to `ProductionEntryFormTable.tsx`, `MaterialsSummaryTable.tsx`, `package.json`, `ProductionPlanTable.tsx`, `ProductionFactTable.tsx`, `DerivativeMovementSummaryTable.tsx`, `SummaryTable.tsx`, `ProductionPlanScreen.tsx`, `index.ts`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsMonthTable.tsx`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `monthKeyFromDate`, `SaleScreen.tsx`, `PlanRedirect.tsx`, `AppShell.tsx`, `MovementPlanScreen.tsx`, `SaleFormTable.tsx`, `DerivativeCreateScreen.tsx`, `Cells.tsx`, `ProductionJournalFactScreen.tsx`, `Icons.tsx`, `RecipeJournalsTable.tsx`, `DocumentProvider.tsx`, `MaterialsPlanScreen.tsx`, `AppShell`, `FinishedProductCostTable.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `ProductionEntryFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08687943262411348 - nodes in this community are weakly interconnected._
- **Why does `PageFrame()` connect `next` to `ProductionJournalFactScreen.tsx`, `ProductionEntryFormTable.tsx`, `RecipeJournalsTable.tsx`, `monthKeyFromDate`, `SaleScreen.tsx`, `MaterialsPlanScreen.tsx`, `RolesScreen.tsx`, `PlanRedirect.tsx`, `MaterialsNormsScreen`, `DerivativeForm`, `MovementPlanScreen.tsx`, `FinishedProductsScreen.tsx`, `ProductionPlanScreen.tsx`, `DerivativeCreateScreen.tsx`, `IconArrowLeft`, `index.ts`, `PlanningScreen.tsx`, `SummaryScreen.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13170731707317074 - nodes in this community are weakly interconnected._