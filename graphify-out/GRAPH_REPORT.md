# Graph Report - food-proto  (2026-11-06)

## Corpus Check
- 244 files · ~146,893 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2303 nodes · 8846 edges · 81 communities (74 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0e3b94f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- MaterialsSummaryTable.tsx
- ProductionEntryScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- use-opex.ts
- Предметная область
- use-materials.ts
- package.json
- biome.json
- SettingsScreen.tsx
- DerivativesScreen.tsx
- compilerOptions
- DerivativeCreateScreen.tsx
- finished-goods.ts
- opex/paths.ts
- ProductionPlanScreen.tsx
- RecipeJournalsTable.tsx
- document.ts
- react
- materials/paths.ts
- index.ts
- production-plan.ts
- FinishedGoodsMonthTable.tsx
- Флоу товара
- MaterialReceiptFormTable.tsx
- ProductionJournalFactScreen.tsx
- movement/paths.ts
- materials.ts
- ProductionFactTable.tsx
- production-fact.ts
- monthKeyFromDate
- ratioRound
- SummaryScreen.tsx
- MaterialsPlanScreen.tsx
- DerivativeMovementInventoryScreen.tsx
- IconChevronDown
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
- PageFrame
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SaleScreen.tsx
- recipes/paths.ts
- inputs/README.md
- recipes/cost/page.tsx
- PlanningScreen.tsx
- SummaryTable.tsx
- Отчет общий движения производных
- RecipeComponentSearch
- RoleProvider.tsx
- transport.ts
- Себестоимость готовой продукции
- hr/fact/page.tsx
- DocumentProvider.tsx
- MaterialsInventoryScreen.tsx
- next
- sales-fact.ts
- rowMetrics
- operating-expense.ts
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- Icons.tsx
- Отчет подневный продаж
- mock-opex.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 100 edges
2. `next` - 92 edges
3. `PageFrame()` - 89 edges
4. `react` - 74 edges
5. `keepWithNext()` - 65 edges
6. `useOpex()` - 63 edges
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

## Communities (81 total, 7 thin omitted)

### Community 0 - "MaterialsSummaryTable.tsx"
Cohesion: 0.06
Nodes (57): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), DerivativeRow() (+49 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (42): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), defaultProductionEntryDay() (+34 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.09
Nodes (52): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+44 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.13
Nodes (31): buildRow(), costForQuantity(), derivativeMovementMonth(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList() (+23 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (34): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+26 more)

### Community 5 - "use-opex.ts"
Cohesion: 0.13
Nodes (34): HrTaxRatesMonth, isDeletionMark(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrFieldRejection, HrTaxRateField (+26 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (38): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+30 more)

### Community 7 - "use-materials.ts"
Cohesion: 0.19
Nodes (26): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+18 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SettingsScreen.tsx"
Cohesion: 0.15
Nodes (14): metadata, SettingsPage(), ROLES_HREF, ROLES_TITLE, PERMISSION_MATRIX_ROWS, permissionAllowed(), ROLES, RolesMatrix() (+6 more)

### Community 11 - "DerivativesScreen.tsx"
Cohesion: 0.18
Nodes (15): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes(), outputPieceThousandthsOf() (+7 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.09
Nodes (64): Derivative, MATERIAL_WAREHOUSES, activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, commit(), formatQuantity() (+56 more)

### Community 14 - "finished-goods.ts"
Cohesion: 0.14
Nodes (35): buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), emptyPlanSide(), emptyRangeView(), emptyTotals(), FinishedGoodsDayView, finishedGoodsMonthDays() (+27 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.07
Nodes (33): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage() (+25 more)

### Community 16 - "ProductionPlanScreen.tsx"
Cohesion: 0.15
Nodes (18): metadata, ProductionPage(), metadata, ProductionPlanPage(), missingProductionPlanProducts(), activeProducts(), parseProductionFactQuery(), parseProductionPlanQuery() (+10 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.25
Nodes (12): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+4 more)

### Community 18 - "document.ts"
Cohesion: 0.05
Nodes (49): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+41 more)

### Community 19 - "react"
Cohesion: 0.11
Nodes (60): react, HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, salesPlanForMonth(), salesPlanTotals, DerivativeRow(), resolveMaterialMonth() (+52 more)

### Community 20 - "materials/paths.ts"
Cohesion: 0.17
Nodes (16): MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsNormsScreen(), MaterialsSummaryScreen(), buildSections(), MaterialsSummaryTable() (+8 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (59): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+51 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.09
Nodes (45): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup (+37 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (45): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, GridInput(), groupTotals() (+37 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (20): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref() (+12 more)

### Community 27 - "movement/paths.ts"
Cohesion: 0.13
Nodes (19): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+11 more)

### Community 28 - "materials.ts"
Cohesion: 0.10
Nodes (44): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+36 more)

### Community 29 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.12
Nodes (37): amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows() (+29 more)

### Community 31 - "monthKeyFromDate"
Cohesion: 0.12
Nodes (34): metadata, ProductionJournalPage(), productionEntryPieces(), workingProductionEntriesInMonth(), maxSaleOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth() (+26 more)

### Community 32 - "ratioRound"
Cohesion: 0.10
Nodes (48): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+40 more)

### Community 33 - "SummaryScreen.tsx"
Cohesion: 0.15
Nodes (30): activeCategories(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, planningHref(), productionFactHref() (+22 more)

### Community 34 - "MaterialsPlanScreen.tsx"
Cohesion: 0.12
Nodes (19): MaterialsPlanPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialMovementRow (+11 more)

### Community 35 - "DerivativeMovementInventoryScreen.tsx"
Cohesion: 0.17
Nodes (15): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementInventoryScreen(), DerivativeMovementInventoryTable(), DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+7 more)

### Community 36 - "IconChevronDown"
Cohesion: 0.10
Nodes (42): WorkshopBlock(), WorkshopBlock(), GroupBlock(), CategoryBlock(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass() (+34 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.10
Nodes (33): Поток данных, MOVEMENT_SECTION_TITLE, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref() (+25 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "MaterialDocumentScreen.tsx"
Cohesion: 0.18
Nodes (18): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse() (+10 more)

### Community 40 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.13
Nodes (28): addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, derivativeWorkshopById(), isDerivativeUnit(), lineKey(), updateDerivative() (+20 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.15
Nodes (23): defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+15 more)

### Community 45 - "hr.ts"
Cohesion: 0.07
Nodes (50): HR_DEPARTMENT_IDS, HrDayOutsourcingLine, HrDayStaffLine, HrMonthPlan, HrMonthPlanOutsourcingLine, HrMonthPlanStaffLine, isHrShopDepartmentId(), averageSalary() (+42 more)

### Community 46 - "movement-plan.ts"
Cohesion: 0.11
Nodes (39): FinishedGoodsNormLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), closingStockPieces(), factualClosingPiecesThrough(), finishedGoodsGridProducts() (+31 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.12
Nodes (39): Единицы, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), dayTotals(), actualRangeSummary(), applyFactScale(), applyPlanScale() (+31 more)

### Community 49 - "SalesFactScreen.tsx"
Cohesion: 0.10
Nodes (35): metadata, SalesJournalPage(), metadata, SalesFactPage(), salesFactGridProducts(), salesFactMonth(), saleTotals, workingSalesInMonth() (+27 more)

### Community 50 - "PageFrame"
Cohesion: 0.15
Nodes (22): DerivativeMovementPlanPage(), metadata, useDocumentStore(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), DerivativeMovementPlanScreen(), derivativeNormRangeInvalid() (+14 more)

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
Cohesion: 0.08
Nodes (58): metadata, SalePage(), metadata, NewSalePage(), SaleLine, addSale(), addSaleRejection(), defaultSaleDay() (+50 more)

### Community 58 - "recipes/paths.ts"
Cohesion: 0.11
Nodes (26): RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), metadata (+18 more)

### Community 60 - "recipes/cost/page.tsx"
Cohesion: 0.32
Nodes (6): RecipesCostDetailPage(), metadata, RecipesCostPage(), parseRecipesCostMonthQuery(), RECIPES_COST_HREF, RECIPES_COST_TITLE

### Community 61 - "PlanningScreen.tsx"
Cohesion: 0.13
Nodes (27): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), AddPositionDialog() (+19 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (50): priceWithVatFromExVat(), TotalCell(), ProductUnitPrice(), Pieces(), ProductionJournalFactTable(), RowCell(), TotalCell(), visibleDayRows() (+42 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

### Community 65 - "RoleProvider.tsx"
Cohesion: 0.13
Nodes (21): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+13 more)

### Community 66 - "transport.ts"
Cohesion: 0.09
Nodes (39): isOccurredOn(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportCarrier, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan, hireAmount() (+31 more)

### Community 68 - "hr/fact/page.tsx"
Cohesion: 0.28
Nodes (7): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), OPEX_HR_FACT_TITLE, OPEX_TRANSPORT_FACT_TITLE, parseOpexDayQuery()

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.17
Nodes (17): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+9 more)

### Community 70 - "MaterialsInventoryScreen.tsx"
Cohesion: 0.20
Nodes (10): MaterialsInventoryPage(), metadata, MaterialGroupId, MaterialWarehouseId, MaterialGroupMovement, MaterialWarehouseMovement, MaterialsInventoryScreen(), MaterialsWarehouseBlocks() (+2 more)

### Community 71 - "next"
Cohesion: 0.15
Nodes (16): nextConfig, next, MaterialReceiptsPage(), metadata, Home(), metadata, metadata, PlanPage() (+8 more)

### Community 72 - "sales-fact.ts"
Cohesion: 0.08
Nodes (41): Архитектура прототипа, Слои, Удаление, Чего не делать, costWithVat(), UnitCost, Product, ProductCategory (+33 more)

### Community 73 - "rowMetrics"
Cohesion: 0.67
Nodes (3): lineAmountWithVat(), quantityForAmount(), rowMetrics()

### Community 74 - "operating-expense.ts"
Cohesion: 0.09
Nodes (35): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+27 more)

### Community 79 - "Icons.tsx"
Cohesion: 0.18
Nodes (15): CandidateGroup, CandidateRow, CandidateRowView(), DerivativeComponentKind, DerivativeFormTable(), GridInput(), SelectedGroup, SelectedRow (+7 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (43): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, MOCK_MONTHS (+35 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 506 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `SettingsScreen.tsx`, `DerivativesScreen.tsx`, `DerivativeCreateScreen.tsx`, `opex/paths.ts`, `ProductionPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `react`, `materials/paths.ts`, `ProductionJournalFactScreen.tsx`, `movement/paths.ts`, `monthKeyFromDate`, `SummaryScreen.tsx`, `MaterialsPlanScreen.tsx`, `DerivativeMovementInventoryScreen.tsx`, `AppShell.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesFactScreen.tsx`, `PageFrame`, `SaleScreen.tsx`, `recipes/paths.ts`, `recipes/cost/page.tsx`, `PlanningScreen.tsx`, `RoleProvider.tsx`, `hr/fact/page.tsx`, `MaterialsInventoryScreen.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MaterialsSummaryTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `MaterialsSummaryTable.tsx`, `ProductionEntryScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `ProductionPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `materials/paths.ts`, `index.ts`, `FinishedGoodsMonthTable.tsx`, `MaterialReceiptFormTable.tsx`, `ProductionJournalFactScreen.tsx`, `ProductionFactTable.tsx`, `monthKeyFromDate`, `SummaryScreen.tsx`, `MaterialsPlanScreen.tsx`, `DerivativeMovementInventoryScreen.tsx`, `IconChevronDown`, `AppShell.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesFactScreen.tsx`, `PageFrame`, `SaleScreen.tsx`, `recipes/paths.ts`, `PlanningScreen.tsx`, `SummaryTable.tsx`, `RoleProvider.tsx`, `DocumentProvider.tsx`, `MaterialsInventoryScreen.tsx`, `next`, `Icons.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0935374149659864 - nodes in this community are weakly interconnected._
- **Why does `Свод` connect `ratioRound` to `Отчет общий движения производных`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09074410163339383 - nodes in this community are weakly interconnected._