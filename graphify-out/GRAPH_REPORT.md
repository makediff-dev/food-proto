# Graph Report - food-proto  (2026-11-06)

## Corpus Check
- 244 files · ~148,238 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2324 nodes · 8911 edges · 86 communities (79 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `16f05a00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RecipePrint.tsx
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- FinishedGoodsMonthTable.tsx
- Предметная область
- use-materials.ts
- package.json
- biome.json
- SettingsScreen.tsx
- DerivativeCreateScreen.tsx
- compilerOptions
- FinishedProductEditScreen.tsx
- finished-goods.ts
- OpexSummaryScreen.tsx
- materials.ts
- RecipeJournalsTable.tsx
- mock-materials.ts
- react
- next
- FinishedGoodsFactTable.tsx
- production-plan.ts
- index.ts
- Флоу товара
- keepWithNext
- ProductionJournalFactScreen.tsx
- FinishedGoodsMonthScreen.tsx
- movementRow
- TransportSummaryScreen.tsx
- production-fact.ts
- planMonthOpen
- finished-product-cost.ts
- SummaryScreen.tsx
- document.ts
- PageFrame
- IconChevronRight
- AppShell.tsx
- flow.md
- MaterialDocumentScreen.tsx
- SummaryHeadlineTable.tsx
- derivatives.ts
- Отчет общий сырья
- FinishedGoodsFactScreen.tsx
- postcss.config.mjs
- hr.ts
- movement-plan.ts
- Отчет общий движения
- summary.ts
- SalesFactScreen.tsx
- HrSummaryScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SaleScreen.tsx
- recipes/paths.ts
- inputs/README.md
- DerivativeMovementSummaryTable.tsx
- PlanningScreen.tsx
- SummaryTable.tsx
- Отчет общий движения производных
- access.ts
- RoleProvider.tsx
- use-opex.ts
- Себестоимость готовой продукции
- TransportFactScreen.tsx
- DocumentProvider.tsx
- monthKeyFromDate
- Icons.tsx
- production-journal-fact.ts
- recipe-yield.ts
- operating-expense.ts
- MaterialReceiptFormTable.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- RecipeComponentSearch
- Отчет подневный продаж
- sales-plan.ts
- MaterialsNormsScreen
- HrFactScreen.tsx
- mock-opex.ts
- sales-fact.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 100 edges
2. `next` - 92 edges
3. `PageFrame()` - 89 edges
4. `react` - 74 edges
5. `useOpex()` - 65 edges
6. `keepWithNext()` - 65 edges
7. `entityNameRowClassName()` - 62 edges
8. `planMonthOpen()` - 59 edges
9. `useRole()` - 59 edges
10. `IconChevronDown()` - 59 edges

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

## Communities (86 total, 7 thin omitted)

### Community 0 - "RecipePrint.tsx"
Cohesion: 0.13
Nodes (27): DerivativeAddRejection, ProductRecipeRejection, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatMaterialWeightPair(), formatQuantity(), MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR, MATERIAL_NORM_ERROR (+19 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (68): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPage() (+60 more)

### Community 2 - "products.ts"
Cohesion: 0.09
Nodes (48): Home(), metadata, metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+40 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.14
Nodes (25): buildRow(), costForQuantity(), DerivativeMovementMonthView, derivativeNormMetrics(), derivativeNormsList(), derivativeOpeningsList(), factConsumptionQuantityForDerivative(), factProductionVolumePiecesForProduct() (+17 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (33): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+25 more)

### Community 5 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (37): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_GROUPS (+29 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (42): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+34 more)

### Community 7 - "use-materials.ts"
Cohesion: 0.14
Nodes (31): MaterialUnit, MaterialWeightPair, addMaterial(), deletedMaterials(), deleteMaterial(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId() (+23 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SettingsScreen.tsx"
Cohesion: 0.20
Nodes (11): metadata, SettingsPage(), permissionAllowed(), ROLES, RolesMatrix(), SETTINGS_HREF, SETTINGS_TITLE, MockSection() (+3 more)

### Community 11 - "DerivativeCreateScreen.tsx"
Cohesion: 0.16
Nodes (15): DerivativePage(), metadata, metadata, NewDerivativePage(), DERIVATIVE_WORKSHOPS, DerivativeLine, DerivativeWorkshopId, DerivativeCreateScreen() (+7 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.11
Nodes (43): ProductRecipeLine, productByIdOrNull(), updateProductRecipe(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantityDraft(), parseQuantityInput() (+35 more)

### Community 14 - "finished-goods.ts"
Cohesion: 0.11
Nodes (48): FinishedGoodsOpeningLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+40 more)

### Community 15 - "OpexSummaryScreen.tsx"
Cohesion: 0.07
Nodes (43): metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage(), metadata, OpexSummaryPage() (+35 more)

### Community 16 - "materials.ts"
Cohesion: 0.09
Nodes (33): MATERIAL_UNITS, MaterialGroupId, MaterialOpeningLine, MaterialReceiptLine, NORMED_MATERIAL_GROUP_ID, addMoney(), addMoneyNullable(), deleteMaterialReceipt() (+25 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.22
Nodes (14): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+6 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "react"
Cohesion: 0.26
Nodes (20): react, AddPositionDialog(), DepartmentBlock(), HrPlanScreen(), HrTaxRateBlock(), OtherGroupBlock(), AddOtherLineDialog(), opexHrPlanHref() (+12 more)

### Community 20 - "next"
Cohesion: 0.11
Nodes (30): nextConfig, next, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+22 more)

### Community 21 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.12
Nodes (30): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+22 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.15
Nodes (25): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+17 more)

### Community 23 - "index.ts"
Cohesion: 0.08
Nodes (67): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+59 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.10
Nodes (56): TotalCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces() (+48 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.14
Nodes (24): metadata, ProductionFactPage(), recommendedDayKey(), recommendedVolumeByDay(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactMonth(), monthDates() (+16 more)

### Community 27 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.16
Nodes (23): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FullscreenToggle(), FinishedGoodsMonthScreen(), FullscreenToggle() (+15 more)

### Community 28 - "movementRow"
Cohesion: 0.21
Nodes (15): costExVat(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), gridMaterials(), inventoryQuantityFor(), moneyOf() (+7 more)

### Community 29 - "TransportSummaryScreen.tsx"
Cohesion: 0.16
Nodes (15): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey, hireColumns() (+7 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.13
Nodes (32): amountExVat(), periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows() (+24 more)

### Community 31 - "planMonthOpen"
Cohesion: 0.10
Nodes (38): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), useDocumentStore(), activeCategories(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+30 more)

### Community 32 - "finished-product-cost.ts"
Cohesion: 0.18
Nodes (20): Свод, Свод, buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode (+12 more)

### Community 33 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (28): SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref(), productionFactPageTitle(), ProductionFactScreen() (+20 more)

### Community 34 - "document.ts"
Cohesion: 0.09
Nodes (23): DeletableRecord, FinishedGoodsNorm, HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrDayFact, HrDayOutsourcingLine, HrDayStaffLine, HrMonthFactStaffLine (+15 more)

### Community 35 - "PageFrame"
Cohesion: 0.10
Nodes (35): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), DerivativeNormField (+27 more)

### Community 36 - "IconChevronRight"
Cohesion: 0.09
Nodes (43): DepartmentBlock(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, ProductionPlanTable(), ProductRow(), COLUMN_GROUPS (+35 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.13
Nodes (21): DERIVATIVE_MOVEMENT_SECTION_TITLE, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV, MOVEMENT_NAV, NAV_GROUPS (+13 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "MaterialDocumentScreen.tsx"
Cohesion: 0.16
Nodes (19): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), DocumentForm() (+11 more)

### Community 40 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.09
Nodes (50): metadata, RecipeDerivativesPage(), buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+42 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.14
Nodes (20): metadata, MovementFactPage(), finishedGoodsGridProducts(), finishedGoodsRangeProducts(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen() (+12 more)

### Community 45 - "hr.ts"
Cohesion: 0.10
Nodes (47): HrDepartmentId, isHrShopDepartmentId(), isOccurredOn(), averageSalary(), dayFactsInMonth(), emptySide(), factShopHeadcountThousandths(), factShopSalaryExVat() (+39 more)

### Community 46 - "movement-plan.ts"
Cohesion: 0.21
Nodes (17): FinishedGoodsNormLine, emptyNormLine(), emptyTotals(), FinishedGoodsNormRejection, finishedGoodsNormsList(), isNormPieces(), movementPlanGridProducts(), movementPlanMetrics() (+9 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.12
Nodes (43): Единицы, PROFIT_TAX_PERCENT, SalesPlan, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), factVolumeScale(), planVolumeScale() (+35 more)

### Community 49 - "SalesFactScreen.tsx"
Cohesion: 0.17
Nodes (19): metadata, SalesFactPage(), defaultSalesFactDay(), parseSalesFactQuery(), SALES_FACT_TITLE, salesFactHref(), DayDateControl(), onKeyDown() (+11 more)

### Community 50 - "HrSummaryScreen.tsx"
Cohesion: 0.30
Nodes (11): metadata, OpexHrPage(), DepartmentBlock(), HrSummaryScreen(), OPEX_HR_TITLE, opexHrHref(), formatHours(), formatQuantity() (+3 more)

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

### Community 57 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (75): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), commitDocumentUpdate(), SaleLine (+67 more)

### Community 58 - "recipes/paths.ts"
Cohesion: 0.10
Nodes (25): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), FinishedProductRecipePage(), metadata (+17 more)

### Community 60 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.11
Nodes (24): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeRow(), GROUP_END_KEYS (+16 more)

### Community 61 - "PlanningScreen.tsx"
Cohesion: 0.15
Nodes (22): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+14 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.12
Nodes (25): SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED (+17 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "access.ts"
Cohesion: 0.15
Nodes (16): Поток данных, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection() (+8 more)

### Community 65 - "RoleProvider.tsx"
Cohesion: 0.11
Nodes (23): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+15 more)

### Community 66 - "use-opex.ts"
Cohesion: 0.07
Nodes (72): HireSeed, HrTaxRatesMonth, isDeletionMark(), isOpexGroupCode(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportCarrier, TransportHireKind (+64 more)

### Community 68 - "TransportFactScreen.tsx"
Cohesion: 0.30
Nodes (10): metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref(), TRANSPORT_ERROR, resolveDay() (+2 more)

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.16
Nodes (20): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+12 more)

### Community 70 - "monthKeyFromDate"
Cohesion: 0.34
Nodes (10): finishedProductCostMonth(), monthKeyFromDate(), MaterialMonthBar(), resolveMaterialMonth(), DerivativeCostScreen(), DerivativeCostTable(), FinishedProductCostScreen(), FinishedProductCostTable() (+2 more)

### Community 71 - "Icons.tsx"
Cohesion: 0.42
Nodes (8): Glyph(), IconChevronLeft(), IconClose(), IconList(), IconMenu(), IconSearch(), IconSettings(), IconUndo()

### Community 72 - "production-journal-fact.ts"
Cohesion: 0.14
Nodes (18): costWithVat(), UnitCost, amountWithVat(), averageAmount(), sideFromRows(), dayTotals(), ProductionJournalFactDayView, ProductionJournalFactGroup (+10 more)

### Community 73 - "recipe-yield.ts"
Cohesion: 0.28
Nodes (11): isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths() (+3 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.10
Nodes (30): OpexGroupCode, OpexMonthLine, OpexMonthLines, AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), catalogCode(), DerivedDef (+22 more)

### Community 75 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (57): MATERIAL_GROUPS, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+49 more)

### Community 79 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

### Community 81 - "sales-plan.ts"
Cohesion: 0.43
Nodes (7): activeSalesPlans(), defaultSalesPlanLines(), isPrice(), isVolume(), lineNumbersRejection(), monthIsTaken(), suggestedPriceWithVat()

### Community 82 - "MaterialsNormsScreen"
Cohesion: 0.40
Nodes (5): MaterialsNormsPage(), metadata, materialNormQuantity(), MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 83 - "HrFactScreen.tsx"
Cohesion: 0.23
Nodes (13): metadata, OpexHrFactPage(), HR_DEPARTMENT_LABELS, hrDayOutsourcingValue(), hrDayStaffValue(), FactDepartment, HrFactScreen(), open() (+5 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.07
Nodes (42): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), isShopPositionId(), MOCK_MONTHS (+34 more)

### Community 85 - "sales-fact.ts"
Cohesion: 0.11
Nodes (27): Архитектура прототипа, Слои, Удаление, Чего не делать, Product, ProductCategory, productCostPerPiece(), dayGridProducts() (+19 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 512 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `products.ts`, `package.json`, `SettingsScreen.tsx`, `DerivativeCreateScreen.tsx`, `FinishedProductEditScreen.tsx`, `OpexSummaryScreen.tsx`, `RecipeJournalsTable.tsx`, `react`, `ProductionJournalFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `TransportSummaryScreen.tsx`, `planMonthOpen`, `SummaryScreen.tsx`, `PageFrame`, `AppShell.tsx`, `MaterialDocumentScreen.tsx`, `derivatives.ts`, `FinishedGoodsFactScreen.tsx`, `SalesFactScreen.tsx`, `HrSummaryScreen.tsx`, `SaleScreen.tsx`, `recipes/paths.ts`, `PlanningScreen.tsx`, `access.ts`, `RoleProvider.tsx`, `TransportFactScreen.tsx`, `monthKeyFromDate`, `MaterialsNormsScreen`, `HrFactScreen.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RecipePrint.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12688172043010754 - nodes in this community are weakly interconnected._
- **Why does `derivativeConsumptionPrice()` connect `derivatives.ts` to `finished-product-cost.ts`, `derivative-movement.ts`, `Предметная область`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057911392405063294 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `derivative-movement.ts`, `production-journal-fact.ts`, `summary.ts`, `materials.ts`, `Ввод плана (производство)`, `production-plan.ts`, `movementRow`, `production-fact.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08636363636363636 - nodes in this community are weakly interconnected._