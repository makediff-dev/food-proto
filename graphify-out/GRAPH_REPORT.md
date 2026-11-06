# Graph Report - food-proto  (2026-11-06)

## Corpus Check
- 265 files · ~155,873 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2462 nodes · 9525 edges · 89 communities (82 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20b71c7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DerivativeCreateScreen.tsx
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- credit-resources.ts
- FinishedGoodsMonthTable.tsx
- compilerOptions
- FinishedProductEditScreen.tsx
- monthKeyFromDate
- opex/paths.ts
- MaterialsPlanScreen.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- DerivativeMovementSummaryTable.tsx
- MaterialJournalScreen.tsx
- index.ts
- production-plan.ts
- MaterialsSummaryTable.tsx
- Флоу товара
- keepWithNext
- FinishedGoodsFactScreen.tsx
- RoleProvider.tsx
- movementRow
- Icons.tsx
- production-fact.ts
- FinishedGoodsMonthScreen.tsx
- CashflowSummaryScreen
- next
- document.ts
- useDocumentStore
- IconChevronDown
- AppShell.tsx
- flow.md
- credit-resources/paths.ts
- SummaryScreen.tsx
- derivatives.ts
- Отчет общий сырья
- MaterialReceiptFormTable.tsx
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- format.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SaleScreen.tsx
- MovementPlanScreen.tsx
- inputs/README.md
- SalesFactScreen.tsx
- PlanningScreen.tsx
- SummaryTable.tsx
- Отчет общий движения производных
- ProductionJournalFactScreen.tsx
- SummaryHeadlineTable.tsx
- use-opex.ts
- Себестоимость готовой продукции
- IconArrowLeft
- DocumentProvider.tsx
- PageFrame
- AGENTS.md
- sales-fact.ts
- ratioRound
- operating-expense.ts
- ProductionEntryFormTable.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- DerivativeCompositionEditor
- Отчет подневный продаж
- sales-plan.ts
- MaterialsNormsScreen.tsx
- Операционные расходы
- mock-opex.ts
- Архитектура прототипа
- Движение готовой продукции
- Движение производных
- Как собрать первый прототип

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 110 edges
2. `next` - 102 edges
3. `PageFrame()` - 99 edges
4. `react` - 79 edges
5. `entityNameRowClassName()` - 72 edges
6. `ColumnLabel()` - 66 edges
7. `useOpex()` - 65 edges
8. `useRole()` - 65 edges
9. `keepWithNext()` - 65 edges
10. `IconChevronDown()` - 61 edges

## Surprising Connections (you probably didn't know these)
- `Движение денежных средств` --references--> `initialCashBalance()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Верхний блок сводки` --references--> `monthInterestAmounts()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts

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

## Communities (89 total, 7 thin omitted)

### Community 0 - "DerivativeCreateScreen.tsx"
Cohesion: 0.14
Nodes (27): metadata, NewDerivativePage(), DerivativeAddRejection, DERIVATIVE_WORKSHOPS, MATERIAL_WAREHOUSES, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), DerivativeCreateScreen() (+19 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (69): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+61 more)

### Community 2 - "products.ts"
Cohesion: 0.13
Nodes (35): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+27 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.12
Nodes (32): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+24 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (38): mockCreditors, mockCreditResourceMonths, mockInitialCashBalance, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+30 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (39): buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeConsumptionPrice() (+31 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (25): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение денежных средств, Движение кредитных ресурсов, Отчет общий (производство), Отчет подневный (производство) (+17 more)

### Community 7 - "materials.ts"
Cohesion: 0.11
Nodes (46): MaterialGroupId, MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine() (+38 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "credit-resources.ts"
Cohesion: 0.11
Nodes (52): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+44 more)

### Community 11 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.12
Nodes (36): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+28 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.13
Nodes (38): isDerivativeWorkshopId(), activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm() (+30 more)

### Community 14 - "monthKeyFromDate"
Cohesion: 0.15
Nodes (24): metadata, MovementInventoryPage(), activeCategories(), missingProductionPlanProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth() (+16 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.06
Nodes (51): metadata, OpexHrFactPage(), metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage() (+43 more)

### Community 16 - "MaterialsPlanScreen.tsx"
Cohesion: 0.16
Nodes (14): MATERIAL_GROUPS, MATERIAL_UNITS, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialMovementRow, MaterialMovementTotals, MaterialNormRejection (+6 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.12
Nodes (24): react-dom, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE (+16 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.10
Nodes (27): Подсказки заголовков таблицы, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeRow() (+19 more)

### Community 20 - "MaterialJournalScreen.tsx"
Cohesion: 0.12
Nodes (23): MaterialsInventoryPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen() (+15 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (61): adjacentDay(), COLUMNS, ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+53 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.12
Nodes (34): Удаление, commitDocumentUpdate(), ProductionPlan, PrototypeDocument, plannedProductionVolumePieces(), targetClosingPiecesFromNorm(), dayGridProducts(), periodGridCategories() (+26 more)

### Community 23 - "MaterialsSummaryTable.tsx"
Cohesion: 0.10
Nodes (38): DerivativeMovementRow, DerivativeMovementSection, DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+30 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.12
Nodes (43): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+35 more)

### Community 26 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.14
Nodes (20): SalesPlanRejection, DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS (+12 more)

### Community 27 - "RoleProvider.tsx"
Cohesion: 0.08
Nodes (36): metadata, onest, RootLayout(), unbounded, metadata, SettingsPage(), readRole(), ROLE_STORAGE_KEY (+28 more)

### Community 28 - "movementRow"
Cohesion: 0.14
Nodes (26): Свод, Свод, costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity() (+18 more)

### Community 29 - "Icons.tsx"
Cohesion: 0.12
Nodes (50): react, HR_DEPARTMENT_LABELS, FactDepartment, AddPositionDialog(), DepartmentBlock(), DepartmentBlock(), HrSummaryScreen(), FACT_FIELD (+42 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.11
Nodes (45): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+37 more)

### Community 31 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.19
Nodes (17): metadata, MovementFactPage(), metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsFactScreen() (+9 more)

### Community 32 - "CashflowSummaryScreen"
Cohesion: 0.16
Nodes (16): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CashflowSummaryScreen(), toggle(), defaultOpenIds(), CASHFLOW_FACT_HREF (+8 more)

### Community 33 - "next"
Cohesion: 0.25
Nodes (10): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+2 more)

### Community 34 - "document.ts"
Cohesion: 0.08
Nodes (27): Creditor, CreditResourceMonthLine, DeletableRecord, DERIVATIVE_UNITS, DerivativeNorm, DerivativeNormLine, DerivativeOpening, DerivativeOpeningLine (+19 more)

### Community 35 - "useDocumentStore"
Cohesion: 0.36
Nodes (8): DerivativeMovementPage(), metadata, useDocumentStore(), DerivativeMovementSummaryScreen(), DerivativeMovementSummaryTable(), DERIVATIVE_MOVEMENT_SUMMARY_TITLE, derivativeMovementSummaryHref(), parseDerivativeMovementMonthQuery()

### Community 36 - "IconChevronDown"
Cohesion: 0.10
Nodes (43): LineRows(), CategoryBlock(), InventoryTable(), DepartmentBlock(), columnEdgeClass(), GroupBlock(), CategoryBlock(), COLUMN_GROUPS (+35 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.07
Nodes (45): Поток данных, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE, DERIVATIVE_MOVEMENT_PLAN_HREF (+37 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "credit-resources/paths.ts"
Cohesion: 0.17
Nodes (14): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+6 more)

### Community 40 - "SummaryScreen.tsx"
Cohesion: 0.20
Nodes (17): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+9 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.13
Nodes (31): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeByIdOrNull(), derivativeCompositionLines(), DerivativeCompositionLineView (+23 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (40): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), Material, isPrice(), materialReceiptById(), materialReceiptRejection() (+32 more)

### Community 45 - "hr.ts"
Cohesion: 0.07
Nodes (60): HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrDayStaffLine, HrDepartmentId, HrMonthPlanOutsourcingLine, HrPosition, isHrShopDepartmentId(), averageSalary() (+52 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.08
Nodes (65): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+57 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.11
Nodes (43): Единицы, monthInterestAmounts(), SalesPlan, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), PLAN_HORIZON_MONTHS, planPhase (+35 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.15
Nodes (18): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), FinishedProductCostScreen(), parseDerivativeWorkshopQuery() (+10 more)

### Community 50 - "format.ts"
Cohesion: 0.17
Nodes (14): formatRubles(), fromRubles(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), parseCreditMoney(), parseInterestRate(), parseHours() (+6 more)

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
Cohesion: 0.07
Nodes (66): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+58 more)

### Community 58 - "MovementPlanScreen.tsx"
Cohesion: 0.21
Nodes (12): metadata, MovementPlanPage(), FullscreenToggle(), MovementPlanScreen(), Workspace(), open(), movementPlanNormRangeInvalid(), MOVEMENT_PLAN_TITLE (+4 more)

### Community 60 - "SalesFactScreen.tsx"
Cohesion: 0.24
Nodes (13): defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), resolveMonth(), SalesFactScreen() (+5 more)

### Community 61 - "PlanningScreen.tsx"
Cohesion: 0.13
Nodes (26): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+18 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (35): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+27 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.25
Nodes (11): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+3 more)

### Community 65 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 66 - "use-opex.ts"
Cohesion: 0.07
Nodes (70): HrTaxRatesMonth, isDeletionMark(), isOccurredOn(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportCarrier, TransportHireMonthPlan, TransportHireMonthPlanLine (+62 more)

### Community 68 - "IconArrowLeft"
Cohesion: 0.28
Nodes (7): FinishedProductRecipePage(), metadata, DerivativePage(), metadata, DerivativeEditScreen(), FinishedProductEditScreen(), IconArrowLeft()

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.16
Nodes (18): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+10 more)

### Community 70 - "PageFrame"
Cohesion: 0.11
Nodes (33): MaterialsPage(), metadata, creditResourcesMonthView, derivativeMovementMonth(), CashflowFactScreen(), CreditResourcesFactScreen(), CreditResourcesPlanScreen(), COLUMN_GROUPS (+25 more)

### Community 71 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 72 - "sales-fact.ts"
Cohesion: 0.10
Nodes (32): UnitCost, Product, productCostPerPiece(), averageAmount(), productionFactGridProducts(), dayTotals(), ProductionJournalFactDayView, productionJournalFactGridProducts() (+24 more)

### Community 73 - "ratioRound"
Cohesion: 0.24
Nodes (14): ProductRecipeLine, ratioRound(), ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths() (+6 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.09
Nodes (35): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+27 more)

### Community 75 - "ProductionEntryFormTable.tsx"
Cohesion: 0.08
Nodes (39): editableFieldNear(), ProductRow(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormTotals, formatKopecks() (+31 more)

### Community 79 - "DerivativeCompositionEditor"
Cohesion: 0.29
Nodes (5): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups(), IconSearch()

### Community 81 - "sales-plan.ts"
Cohesion: 0.12
Nodes (34): costWithVat(), priceAverage(), rangePlanProduction(), rangePlanSales(), amountExVat(), amountWithVat(), productionLineAmountExVat(), productionPlanLineMetrics (+26 more)

### Community 82 - "MaterialsNormsScreen.tsx"
Cohesion: 0.31
Nodes (8): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE, MATERIAL_NORM_ERROR

### Community 83 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (46): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, isShopPositionId() (+38 more)

### Community 85 - "Архитектура прототипа"
Cohesion: 0.31
Nodes (5): Архитектура прототипа, Слои, Чего не делать, Запуск, Куда смотреть

### Community 86 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 87 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

### Community 88 - "Как собрать первый прототип"
Cohesion: 0.67
Nodes (3): Как собрать первый прототип, Порядок, Формула

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 525 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `DerivativeCreateScreen.tsx`, `ProductionEntryScreen.tsx`, `package.json`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `opex/paths.ts`, `MaterialsPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialJournalScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RoleProvider.tsx`, `Icons.tsx`, `production-fact.ts`, `FinishedGoodsMonthScreen.tsx`, `CashflowSummaryScreen`, `useDocumentStore`, `AppShell.tsx`, `credit-resources/paths.ts`, `SummaryScreen.tsx`, `derivatives.ts`, `MaterialReceiptFormTable.tsx`, `recipes/paths.ts`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `SalesFactScreen.tsx`, `PlanningScreen.tsx`, `ProductionJournalFactScreen.tsx`, `IconArrowLeft`, `PageFrame`, `MaterialsNormsScreen.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DerivativeCreateScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13911290322580644 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `DerivativeCreateScreen.tsx`, `ProductionEntryScreen.tsx`, `package.json`, `FinishedGoodsMonthTable.tsx`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `MaterialsPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `DerivativeMovementSummaryTable.tsx`, `MaterialJournalScreen.tsx`, `index.ts`, `MaterialsSummaryTable.tsx`, `keepWithNext`, `FinishedGoodsFactScreen.tsx`, `RoleProvider.tsx`, `production-fact.ts`, `FinishedGoodsMonthScreen.tsx`, `next`, `useDocumentStore`, `IconChevronDown`, `AppShell.tsx`, `SummaryScreen.tsx`, `MaterialReceiptFormTable.tsx`, `recipes/paths.ts`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `SalesFactScreen.tsx`, `PlanningScreen.tsx`, `SummaryTable.tsx`, `ProductionJournalFactScreen.tsx`, `DocumentProvider.tsx`, `PageFrame`, `ProductionEntryFormTable.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05570611261668172 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `opex/paths.ts`, `MaterialsPlanScreen.tsx`, `MaterialJournalScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `Icons.tsx`, `production-fact.ts`, `FinishedGoodsMonthScreen.tsx`, `CashflowSummaryScreen`, `next`, `useDocumentStore`, `SummaryScreen.tsx`, `MaterialReceiptFormTable.tsx`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `recipes/paths.ts`, `SaleScreen.tsx`, `MovementPlanScreen.tsx`, `SalesFactScreen.tsx`, `PlanningScreen.tsx`, `ProductionJournalFactScreen.tsx`, `use-opex.ts`, `PageFrame`, `sales-fact.ts`, `sales-plan.ts`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1282051282051282 - nodes in this community are weakly interconnected._