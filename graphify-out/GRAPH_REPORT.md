# Graph Report - food-proto  (2026-11-06)

## Corpus Check
- 244 files · ~147,292 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2313 nodes · 8864 edges · 92 communities (85 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a68c792`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- MaterialsSummaryTable.tsx
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- use-opex.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- settings/page.tsx
- DerivativeEditScreen
- compilerOptions
- DerivativeCreateScreen.tsx
- finished-goods.ts
- opex/paths.ts
- ProductionJournalScreen.tsx
- ProductIndex
- mock-materials.ts
- HrFactScreen.tsx
- materials/paths.ts
- FinishedGoodsFactTable.tsx
- production-plan.ts
- index.ts
- Флоу товара
- keepWithNext
- ProductionJournalFactScreen.tsx
- FinishedGoodsMonthScreen.tsx
- movementRow
- ProductionFactTable.tsx
- production-fact.ts
- monthKeyFromDate
- derivative-cost.ts
- SummaryScreen.tsx
- document.ts
- derivative-movement/paths.ts
- RecipeCostDetailTable.tsx
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
- SalesJournalScreen.tsx
- DerivativeMovementPlanScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SaleFormTable.tsx
- recipes/paths.ts
- inputs/README.md
- TransportSummaryScreen.tsx
- PlanningScreen.tsx
- SummaryTable.tsx
- Отчет общий движения производных
- access.ts
- Icons.tsx
- transport.ts
- Себестоимость готовой продукции
- hr/fact/page.tsx
- DocumentProvider.tsx
- PageFrame
- next
- sales-fact.ts
- ratioRound
- operating-expense.ts
- MaterialReceiptFormTable.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- DerivativeFormTable.tsx
- Отчет подневный продаж
- sales-plan.ts
- mockHrDayFacts
- isOccurredOn
- mock-opex.ts
- Архитектура прототипа
- finished/cost/page.tsx
- AGENTS.md
- Операционные расходы
- Как собрать первый прототип
- Движение готовой продукции
- Движение производных

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

## Communities (92 total, 7 thin omitted)

### Community 0 - "MaterialsSummaryTable.tsx"
Cohesion: 0.11
Nodes (29): DerivativeRow(), RowCell(), columnEdgeClass(), DerivativeRow(), RowCell(), WorkshopBlock(), WorkshopCell(), MaterialNormDeviation() (+21 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (42): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection() (+34 more)

### Community 2 - "products.ts"
Cohesion: 0.12
Nodes (39): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+31 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.12
Nodes (35): buildRow(), costForQuantity(), derivativeMovementMonth(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList() (+27 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (33): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+25 more)

### Community 5 - "use-opex.ts"
Cohesion: 0.15
Nodes (30): isDeletionMark(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrFieldRejection, HrTaxRateField, isHrDepartmentIdSafe() (+22 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Отчет общий (производство), Отчет подневный (производство), Период и ассортимент, План производства (+15 more)

### Community 7 - "materials.ts"
Cohesion: 0.11
Nodes (46): MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine(), isMaterialGroupId() (+38 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "settings/page.tsx"
Cohesion: 0.32
Nodes (4): metadata, SettingsPage(), SETTINGS_HREF, SETTINGS_TITLE

### Community 11 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.11
Nodes (59): derivativeWorkshopById(), warehouseIdForWorkshop(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), recipeComponentsKilogramThousandths(), MaterialDialog(), commit(), formatQuantity() (+51 more)

### Community 14 - "finished-goods.ts"
Cohesion: 0.11
Nodes (50): FinishedGoodsOpeningLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), clampSummaryMonth(), closingNormMetrics() (+42 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.07
Nodes (33): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage() (+25 more)

### Community 16 - "ProductionJournalScreen.tsx"
Cohesion: 0.11
Nodes (25): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+17 more)

### Community 17 - "ProductIndex"
Cohesion: 0.15
Nodes (19): CategoryBlock(), FinishedGoodsMonthTable(), groupEndClass(), ProductRow(), editableFieldNear(), ProductRow(), editableFieldNear(), ProductRow() (+11 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (23): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+15 more)

### Community 19 - "HrFactScreen.tsx"
Cohesion: 0.09
Nodes (67): HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, salesPlanForMonth(), WorkshopBlock(), DerivativeRow(), WorkshopBlock(), resolveMaterialMonth() (+59 more)

### Community 20 - "materials/paths.ts"
Cohesion: 0.09
Nodes (31): MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+23 more)

### Community 21 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.08
Nodes (45): FinishedGoodsRow, FinishedGoodsTotals, ProductionJournalFactDayView, ProductionJournalFactGroup, ProductionJournalFactTotals, adjacentDay(), ArrowButton(), CategoryBlock() (+37 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (27): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+19 more)

### Community 23 - "index.ts"
Cohesion: 0.08
Nodes (71): react, DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMN_KIND (+63 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.09
Nodes (60): SalesFactDayView, SalesFactGroup, SalesFactTotals, RowCell(), MetricCell(), RowCell(), TotalsCell(), RowCell() (+52 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.14
Nodes (24): recommendedDayKey(), defaultProductionJournalFactDay(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), productionJournalFactHref(), FullscreenToggle(), DayDateControl() (+16 more)

### Community 27 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.15
Nodes (19): metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen() (+11 more)

### Community 28 - "movementRow"
Cohesion: 0.16
Nodes (21): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+13 more)

### Community 29 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.14
Nodes (28): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta(), monthProductionFact() (+20 more)

### Community 31 - "monthKeyFromDate"
Cohesion: 0.15
Nodes (29): missingProductionPlanProducts(), activeProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), MaterialMonthBar(), InventoryScreen() (+21 more)

### Community 32 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (41): Свод, Свод, FinishedProductRecipePage(), metadata, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch() (+33 more)

### Community 33 - "SummaryScreen.tsx"
Cohesion: 0.17
Nodes (25): activeCategories(), ensureRangeIncludesMonth(), normalizeMonthRange(), planningHref(), productionFactHref(), productionFactPageTitle(), ProductionFactScreen(), resolveRange() (+17 more)

### Community 34 - "document.ts"
Cohesion: 0.07
Nodes (36): DeletableRecord, DERIVATIVE_UNITS, DerivativeNorm, DerivativeNormLine, DerivativeOpening, DerivativeOpeningLine, Material, MATERIAL_GROUPS (+28 more)

### Community 35 - "derivative-movement/paths.ts"
Cohesion: 0.20
Nodes (14): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementSummaryScreen(), DerivativeMovementSummaryTable(), DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+6 more)

### Community 36 - "RecipeCostDetailTable.tsx"
Cohesion: 0.28
Nodes (11): columnEdgeClass(), ColumnKey, COLUMNS, RecipeCostDetailExtraUnitRow, RecipeCostDetailLine, RecipeCostDetailTable(), RecipeCostDetailUnitCost, sumMoney() (+3 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.14
Nodes (18): MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV, MOVEMENT_NAV, NAV_GROUPS, NavItem (+10 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (24): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), materialReceiptsInMonth() (+16 more)

### Community 40 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.13
Nodes (29): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeCompositionLines(), DerivativeCompositionLineView (+21 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.11
Nodes (27): metadata, MovementFactPage(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth() (+19 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (48): OutsourcingSeed, HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrDayOutsourcingLine, HrDayStaffLine, HrMonthPlanOutsourcingLine, HrMonthPlanStaffLine, HrShopDepartmentId (+40 more)

### Community 46 - "movement-plan.ts"
Cohesion: 0.12
Nodes (31): FinishedGoodsNormLine, closingInventoryDeviationPieces(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingDeviationPieces(), setFinishedGoodsOpening() (+23 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.11
Nodes (43): Единицы, SalesPlan, productCostPerPiece(), monthOperatingExpenseAmounts(), factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase (+35 more)

### Community 49 - "SalesJournalScreen.tsx"
Cohesion: 0.17
Nodes (18): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, parseSalesFactQuery(), parseSalesJournalQuery(), saleHref() (+10 more)

### Community 50 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.31
Nodes (8): DerivativeMovementPlanPage(), metadata, DerivativeMovementPlanScreen(), DerivativeMovementPlanTable(), derivativeNormRangeInvalid(), DERIVATIVE_MOVEMENT_PLAN_TITLE, derivativeMovementPlanHref(), parseDerivativeMovementPlanQuery()

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

### Community 57 - "SaleFormTable.tsx"
Cohesion: 0.05
Nodes (83): metadata, SalePage(), metadata, NewSalePage(), ProductCategory, SaleLine, addSale(), addSaleRejection() (+75 more)

### Community 58 - "recipes/paths.ts"
Cohesion: 0.09
Nodes (30): react-dom, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, RecipeFinishedPage(), metadata, NewDerivativePage() (+22 more)

### Community 60 - "TransportSummaryScreen.tsx"
Cohesion: 0.09
Nodes (26): FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS (+18 more)

### Community 61 - "PlanningScreen.tsx"
Cohesion: 0.15
Nodes (22): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+14 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (29): SalesPlanRejection, SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock(), editableFieldNear() (+21 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "access.ts"
Cohesion: 0.16
Nodes (15): Поток данных, DERIVATIVE_MOVEMENT_SUMMARY_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref() (+7 more)

### Community 65 - "Icons.tsx"
Cohesion: 0.09
Nodes (36): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT, ALL_NAV_SECTIONS (+28 more)

### Community 66 - "transport.ts"
Cohesion: 0.11
Nodes (31): HireSeed, isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlanLine, hireAmount(), hirePlanLine(), isMoney() (+23 more)

### Community 68 - "hr/fact/page.tsx"
Cohesion: 0.28
Nodes (7): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), OPEX_HR_FACT_TITLE, OPEX_TRANSPORT_FACT_TITLE, parseOpexDayQuery()

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.13
Nodes (21): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+13 more)

### Community 70 - "PageFrame"
Cohesion: 0.21
Nodes (13): useDocumentStore(), DerivativeMovementInventoryScreen(), DerivativeMovementInventoryTable(), derivativeMovementInventoryHref(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref(), ProductionPlaceholderScreen() (+5 more)

### Community 71 - "next"
Cohesion: 0.25
Nodes (10): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+2 more)

### Community 72 - "sales-fact.ts"
Cohesion: 0.13
Nodes (32): Удаление, costWithVat(), UnitCost, Product, amountWithVat(), averageAmount(), percentHundredths(), vatPercentHundredths() (+24 more)

### Community 73 - "ratioRound"
Cohesion: 0.16
Nodes (17): Derivative, PrototypeDocument, ratioRound(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, RecipeComponentTarget, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths() (+9 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.09
Nodes (35): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+27 more)

### Community 75 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.17
Nodes (15): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, GroupBlock(), groupTotals() (+7 more)

### Community 79 - "DerivativeFormTable.tsx"
Cohesion: 0.15
Nodes (13): buildCandidateGroups(), CandidateGroup, CandidateRow, CandidateRowView(), DerivativeComponentKind, DerivativeFormEmpty(), DerivativeFormTable(), GridInput() (+5 more)

### Community 81 - "sales-plan.ts"
Cohesion: 0.22
Nodes (16): activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan(), isPrice(), isVolume(), lineNumbersRejection() (+8 more)

### Community 82 - "mockHrDayFacts"
Cohesion: 0.20
Nodes (14): distribute(), eachDate(), factFuelExVat(), hireAmount(), mockHrDayFacts, mockHrMonthPlans, mockOpexMonthLines, mockTransportHireDayFacts (+6 more)

### Community 83 - "isOccurredOn"
Cohesion: 0.20
Nodes (14): isOccurredOn(), hrDayOutsourcingValue(), hrDayStaffValue(), transportHireDayValue(), transportOwnDayValue(), HrFactScreen(), open(), resolveDay() (+6 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.05
Nodes (33): HIRE_PRICE_KOP, HIRE_SEEDS, MOCK_MONTHS, MOCK_VEHICLE_IDS, mockHrTaxRates, MockMonth, mockTransportCarriers, mockTransportVehicles (+25 more)

### Community 85 - "Архитектура прототипа"
Cohesion: 0.31
Nodes (5): Архитектура прототипа, Слои, Чего не делать, Запуск, Куда смотреть

### Community 86 - "finished/cost/page.tsx"
Cohesion: 0.32
Nodes (6): RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), parseRecipesFinishedCostMonthQuery(), RECIPES_FINISHED_COST_HREF, RECIPES_FINISHED_COST_TITLE

### Community 87 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 88 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 89 - "Как собрать первый прототип"
Cohesion: 0.50
Nodes (4): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула

### Community 90 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 91 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 512 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `settings/page.tsx`, `DerivativeEditScreen`, `DerivativeCreateScreen.tsx`, `opex/paths.ts`, `ProductionJournalScreen.tsx`, `ProductIndex`, `HrFactScreen.tsx`, `materials/paths.ts`, `index.ts`, `ProductionJournalFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `monthKeyFromDate`, `derivative-cost.ts`, `SummaryScreen.tsx`, `document.ts`, `derivative-movement/paths.ts`, `AppShell.tsx`, `MaterialDocumentScreen.tsx`, `derivatives.ts`, `FinishedGoodsFactScreen.tsx`, `SalesJournalScreen.tsx`, `DerivativeMovementPlanScreen.tsx`, `SaleFormTable.tsx`, `recipes/paths.ts`, `TransportSummaryScreen.tsx`, `PlanningScreen.tsx`, `access.ts`, `hr/fact/page.tsx`, `DocumentProvider.tsx`, `PageFrame`, `finished/cost/page.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MaterialsSummaryTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1053763440860215 - nodes in this community are weakly interconnected._
- **Why does `derivativeConsumptionPrice()` connect `derivative-cost.ts` to `derivatives.ts`, `derivative-movement.ts`, `Предметная область`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09438775510204081 - nodes in this community are weakly interconnected._
- **Why does `Предметная область` connect `Предметная область` to `Операционные расходы`, `Движение готовой продукции`, `Движение производных`, `Архитектура прототипа`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11733615221987315 - nodes in this community are weakly interconnected._