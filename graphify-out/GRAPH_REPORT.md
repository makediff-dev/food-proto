# Graph Report - food-proto  (2026-11-17)

## Corpus Check
- 296 files · ~175,495 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2790 nodes · 10999 edges · 98 communities (91 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b9c0ee36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- next
- OpexGroupPlanScreen.tsx
- ProductionJournalFactScreen.tsx
- RecipeJournalsTable.tsx
- opex/text.ts
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- materials.ts
- movement-plan.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- ColumnLabel
- react
- SaleScreen.tsx
- credit-resources.ts
- derivative-movement.ts
- materials/text.ts
- cashflow.ts
- README.md
- production-plan.ts
- profit-tax.ts
- Флоу товара
- MaterialMonthBar
- AGENTS.md
- access.ts
- FinishedGoodsFactScreen.tsx
- mock-document.ts
- production-fact.ts
- document.ts
- recipes/paths.ts
- DocumentProvider.tsx
- hr.ts
- monthKeyFromDate
- index.ts
- AppShell.tsx
- flow.md
- Операционные расходы
- cashflow/paths.ts
- derivatives.ts
- Отчет общий сырья
- roles.ts
- postcss.config.mjs
- vat/paths.ts
- planMonthOpen
- Отчет общий движения
- summary.ts
- PageFrame
- finished-goods.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- CreditResourcesSummaryScreen.tsx
- SummaryTable.tsx
- inputs/README.md
- MaterialsPlanTable.tsx
- opex/paths.ts
- Движение готовой продукции
- Отчет общий движения производных
- Движение производных
- sales-plan.ts
- MaterialDocumentScreen.tsx
- Себестоимость готовой продукции
- Icons.tsx
- Отчет подневный движения
- SummaryScreen.tsx
- ProductIndex
- RecipePrint.tsx
- ProductionEntryScreen.tsx
- operating-expense.ts
- useRole
- useDocumentStore
- derivative-cost.ts
- products.ts
- Отчет подневный производства
- SummaryHeadlineTable.tsx
- use-materials.ts
- SalesFactScreen.tsx
- MaterialsPlanScreen.tsx
- mock-opex.ts
- migrate-document.ts
- Отчет общий производства
- Отчет подневный продаж
- SettingsScreen.tsx
- layout.tsx
- derivativeConsumptionPrice
- production-journal.ts
- FinishedGoodsMonthTable.tsx
- mock-property-tax.ts
- RecipeComponentSearch
- DerivativeEditScreen
- MaterialsNormsScreen
- sales-fact.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 124 edges
2. `next` - 120 edges
3. `PageFrame()` - 113 edges
4. `react` - 90 edges
5. `entityNameRowClassName()` - 87 edges
6. `planMonthOpen()` - 85 edges
7. `isOccurredOn()` - 83 edges
8. `useOpex()` - 81 edges
9. `ColumnLabel()` - 80 edges
10. `useRole()` - 75 edges

## Surprising Connections (you probably didn't know these)
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Верхний блок сводки` --references--> `monthInterestAmounts()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts
- `Поток данных` --references--> `PrototypeDocument`  [INFERRED]
  docs/architecture.md → src/domain/document.ts

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

## Communities (98 total, 7 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.11
Nodes (53): isDeletionMark(), isTransportHireKind(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), restoreHrPosition(), deleteOpexOtherLine(), activeTransportCarriers() (+45 more)

### Community 1 - "next"
Cohesion: 0.12
Nodes (19): nextConfig, next, CreditResourcesFactPage(), metadata, DerivativeConsumptionPage(), metadata, Home(), metadata (+11 more)

### Community 2 - "OpexGroupPlanScreen.tsx"
Cohesion: 0.12
Nodes (33): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), metadata, OpexOtherPlanPage(), isOpexGroupCode(), isPromotableOpexGroupCode() (+25 more)

### Community 3 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (20): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref() (+12 more)

### Community 4 - "RecipeJournalsTable.tsx"
Cohesion: 0.22
Nodes (14): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+6 more)

### Community 5 - "opex/text.ts"
Cohesion: 0.25
Nodes (8): HrFieldRejection, OpexFieldRejection, TransportFieldRejection, formatQuantity(), OPEX_LINE_ERROR, parseHours(), parseQuantity(), TRANSPORT_ERROR

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (24): Блоки, Ввод факта (производство), Готовая продукция (рецептурный журнал), Движение денежных средств, Движение кредитных ресурсов, Отчет общий (производство), Отчет подневный (производство), Период и ассортимент (+16 more)

### Community 7 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "materials.ts"
Cohesion: 0.09
Nodes (46): mockConsumptionDays(), costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), calculatedConsumptionQuantityForMaterialDay(), closingMaterialQuantity() (+38 more)

### Community 11 - "movement-plan.ts"
Cohesion: 0.11
Nodes (41): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), closingStockPieces(), factualClosingPiecesThrough(), finishedGoodsGridProducts(), FinishedGoodsOpeningRejection (+33 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (51): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), changeWarehouse(), draftsForWarehouse(), lineAmountWithVat(), quantityForAmount(), rowMetrics() (+43 more)

### Community 14 - "ColumnLabel"
Cohesion: 0.12
Nodes (39): DerivativeMovementPlanTable(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces() (+31 more)

### Community 15 - "react"
Cohesion: 0.06
Nodes (60): react, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+52 more)

### Community 16 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (62): metadata, SalePage(), metadata, NewSalePage(), Sale, SaleLine, productAllowedInPeriodSale(), addSale() (+54 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.13
Nodes (45): activeCreditors(), addCreditor(), addCreditorRejection(), creditDayAmounts(), CreditDayField, CreditFieldRejection, CreditMonthField, CreditMonthViewOptions (+37 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.05
Nodes (73): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, buildRow(), calculatedConsumptionQuantityForDerivativeDay() (+65 more)

### Community 19 - "materials/text.ts"
Cohesion: 0.17
Nodes (11): MaterialConsumptionRejection, MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, formatMaterialWeightPair(), MATERIAL_CONSUMPTION_ERROR, MATERIAL_DOCUMENT_ERROR (+3 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.07
Nodes (63): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+55 more)

### Community 21 - "README.md"
Cohesion: 0.31
Nodes (5): Как собрать первый прототип, Порядок, Формула, Запуск, Куда смотреть

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (23): ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+15 more)

### Community 23 - "profit-tax.ts"
Cohesion: 0.24
Nodes (14): Верхний блок сводки, PROFIT_TAX_PERCENT, ProfitTaxRateChange, byMonth(), DEFAULT_PROFIT_TAX_HUNDREDTHS, isRateHundredths(), PROFIT_TAX_RATE_SCALE, profitTaxRateChanges() (+6 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialMonthBar"
Cohesion: 0.09
Nodes (35): MaterialsConsumptionPage(), metadata, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialReceiptsPage(), metadata (+27 more)

### Community 26 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 27 - "access.ts"
Cohesion: 0.13
Nodes (19): Архитектура прототипа, Поток данных, Слои, Чего не делать, DERIVATIVE_MOVEMENT_CONSUMPTION_HREF, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF (+11 more)

### Community 28 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.16
Nodes (18): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle(), mondayLeadForMonth() (+10 more)

### Community 29 - "mock-document.ts"
Cohesion: 0.05
Nodes (38): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, boostTenPercent(), burger, caesar, CatalogProductId, catalogProductIds (+30 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.13
Nodes (33): finishedGoodsSummaryAsOfDate(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows() (+25 more)

### Community 31 - "document.ts"
Cohesion: 0.06
Nodes (37): Creditor, CreditResourceDayLine, CreditResourceMonthLine, DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNorm, FinishedGoodsOpeningLine, HR_DEPARTMENT_IDS (+29 more)

### Community 32 - "recipes/paths.ts"
Cohesion: 0.12
Nodes (24): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), metadata, NewDerivativePage() (+16 more)

### Community 33 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (12): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+4 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (53): HrDepartmentId, HrTaxRatesMonth, isHrShopDepartmentId(), isMonthKey(), activeHrPositions(), averageSalary(), dayFactsInMonth(), emptySide() (+45 more)

### Community 35 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (35): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), metadata, ProductionPlanPage(), missingProductionPlanProducts(), activeProducts() (+27 more)

### Community 36 - "index.ts"
Cohesion: 0.08
Nodes (57): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+49 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.11
Nodes (25): OpexGroupFactRedirectPage(), MOVEMENT_SECTION_TITLE, opexGroupFactHrefPath(), PRODUCTION_SECTION_TITLE, RECIPES_SECTION_TITLE, AppShell(), buildCashflowNav(), buildNavGroups() (+17 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 40 - "cashflow/paths.ts"
Cohesion: 0.13
Nodes (19): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE (+11 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.14
Nodes (28): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection (+20 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "roles.ts"
Cohesion: 0.17
Nodes (14): ALL_EDIT, ALL_NAV_SECTIONS, DEFAULT_ROLE_ID, NavSectionId, NO_EDIT, PERMISSION_MATRIX_ROWS, permissionAllowed(), PermissionFlagKey (+6 more)

### Community 45 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 46 - "planMonthOpen"
Cohesion: 0.08
Nodes (70): CashflowOpexGroupFactPage(), CashflowHrFactPage(), metadata, CashflowOtherFactPage(), metadata, CashflowTransportFactPage(), metadata, occurredOnOpen() (+62 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.10
Nodes (45): Единицы, monthInterestAmounts(), SalesPlan, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), salesPlanTotals, actualRangeSummary() (+37 more)

### Community 49 - "PageFrame"
Cohesion: 0.20
Nodes (16): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), inputKind(), PropertyTaxScreen(), FinishedGoodsMonthScreen() (+8 more)

### Community 50 - "finished-goods.ts"
Cohesion: 0.14
Nodes (36): buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), emptyPlanSide(), emptyRangeView(), emptyTotals(), FinishedGoodsDayView, finishedGoodsMonthDays() (+28 more)

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

### Community 57 - "CreditResourcesSummaryScreen.tsx"
Cohesion: 0.11
Nodes (23): CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, COLUMN_GROUPS, COLUMN_KIND, columnEdge(), ColumnKey (+15 more)

### Community 58 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (31): SalesPlanRejection, averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED (+23 more)

### Community 60 - "MaterialsPlanTable.tsx"
Cohesion: 0.07
Nodes (48): RowCell(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeRow() (+40 more)

### Community 61 - "opex/paths.ts"
Cohesion: 0.05
Nodes (51): OpexGroupPlanPage(), OpexHrFactRedirectPage(), metadata, OpexHrPage(), metadata, OpexHrPlanPage(), OpexOtherFactRedirectPage(), metadata (+43 more)

### Community 62 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

### Community 65 - "sales-plan.ts"
Cohesion: 0.12
Nodes (30): costWithVat(), buildCostRow(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode, FinishedProductCostMonthView, FinishedProductCostRow (+22 more)

### Community 66 - "MaterialDocumentScreen.tsx"
Cohesion: 0.14
Nodes (21): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, isPrice(), materialReceiptById(), materialReceiptRejection() (+13 more)

### Community 68 - "Icons.tsx"
Cohesion: 0.07
Nodes (92): DerivativeMovementRow, DerivativeMovementSection, HR_DEPARTMENT_LABELS, CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), VarianceSense (+84 more)

### Community 70 - "SummaryScreen.tsx"
Cohesion: 0.13
Nodes (35): metadata, ProductionPage(), activeCategories(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), FullscreenToggle(), FullscreenToggle() (+27 more)

### Community 71 - "ProductIndex"
Cohesion: 0.11
Nodes (34): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell(), CostRow(), DerivativeCostTable() (+26 more)

### Community 72 - "RecipePrint.tsx"
Cohesion: 0.16
Nodes (24): DerivativeAddRejection, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef (+16 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.10
Nodes (35): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), defaultProductionEntryDay(), productionEntryPieces() (+27 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (57): OpexGroupCode, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), applyDayFactToGroup() (+49 more)

### Community 75 - "useRole"
Cohesion: 0.15
Nodes (20): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+12 more)

### Community 76 - "useDocumentStore"
Cohesion: 0.15
Nodes (16): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), useDocumentStore(), ProductRecipeLine, productCompositionLines(), ProductRecipeRejection (+8 more)

### Community 77 - "derivative-cost.ts"
Cohesion: 0.13
Nodes (24): buildCostRow(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeCostDetail, DerivativeCostLineContribution (+16 more)

### Community 78 - "products.ts"
Cohesion: 0.11
Nodes (41): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+33 more)

### Community 80 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): formatTaxRateLabel(), headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS (+2 more)

### Community 81 - "use-materials.ts"
Cohesion: 0.22
Nodes (25): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isVatPercent(), materialById() (+17 more)

### Community 82 - "SalesFactScreen.tsx"
Cohesion: 0.09
Nodes (36): metadata, SalesJournalPage(), metadata, SalesFactPage(), monthDates(), saleTotals, workingSales(), workingSalesInMonth() (+28 more)

### Community 83 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (19): MaterialsPlanPage(), metadata, Material, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWarehouseId (+11 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.05
Nodes (54): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, isShopPositionId() (+46 more)

### Community 85 - "migrate-document.ts"
Cohesion: 0.18
Nodes (15): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+7 more)

### Community 88 - "SettingsScreen.tsx"
Cohesion: 0.11
Nodes (24): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+16 more)

### Community 89 - "layout.tsx"
Cohesion: 0.18
Nodes (10): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+2 more)

### Community 90 - "derivativeConsumptionPrice"
Cohesion: 0.26
Nodes (13): Свод, Свод, componentUnitPriceInternal(), derivativeConsumptionPrice(), componentUnitPrice(), emptyPlanLine(), materialConsumptionPrice(), materialMonthPlansList() (+5 more)

### Community 91 - "production-journal.ts"
Cohesion: 0.18
Nodes (23): commitDocumentUpdate(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection() (+15 more)

### Community 92 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.09
Nodes (46): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell() (+38 more)

### Community 93 - "mock-property-tax.ts"
Cohesion: 0.29
Nodes (4): mockPropertyTaxMonths, mockPropertyTaxPayments, PropertyTaxMonth, TaxPaymentDay

### Community 94 - "RecipeComponentSearch"
Cohesion: 0.29
Nodes (4): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups(), IconSearch()

### Community 95 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

### Community 101 - "MaterialsNormsScreen"
Cohesion: 0.40
Nodes (5): MaterialsNormsPage(), metadata, materialNormQuantity(), MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 102 - "sales-fact.ts"
Cohesion: 0.11
Nodes (34): Удаление, UnitCost, Product, PrototypeDocument, averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+26 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 555 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OpexGroupPlanScreen.tsx`, `ProductionJournalFactScreen.tsx`, `RecipeJournalsTable.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `SaleScreen.tsx`, `derivative-movement.ts`, `MaterialMonthBar`, `access.ts`, `FinishedGoodsFactScreen.tsx`, `recipes/paths.ts`, `monthKeyFromDate`, `AppShell.tsx`, `cashflow/paths.ts`, `derivatives.ts`, `vat/paths.ts`, `planMonthOpen`, `PageFrame`, `CreditResourcesSummaryScreen.tsx`, `opex/paths.ts`, `MaterialDocumentScreen.tsx`, `Icons.tsx`, `SummaryScreen.tsx`, `ProductionEntryScreen.tsx`, `useRole`, `useDocumentStore`, `SalesFactScreen.tsx`, `MaterialsPlanScreen.tsx`, `SettingsScreen.tsx`, `layout.tsx`, `DerivativeEditScreen`, `MaterialsNormsScreen`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1063973063973064 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `next`, `OpexGroupPlanScreen.tsx`, `ProductionJournalFactScreen.tsx`, `RecipeJournalsTable.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `ColumnLabel`, `SaleScreen.tsx`, `derivative-movement.ts`, `MaterialMonthBar`, `access.ts`, `FinishedGoodsFactScreen.tsx`, `recipes/paths.ts`, `DocumentProvider.tsx`, `monthKeyFromDate`, `index.ts`, `AppShell.tsx`, `planMonthOpen`, `PageFrame`, `CreditResourcesSummaryScreen.tsx`, `SummaryTable.tsx`, `MaterialsPlanTable.tsx`, `opex/paths.ts`, `MaterialDocumentScreen.tsx`, `Icons.tsx`, `SummaryScreen.tsx`, `ProductIndex`, `ProductionEntryScreen.tsx`, `useRole`, `SalesFactScreen.tsx`, `MaterialsPlanScreen.tsx`, `SettingsScreen.tsx`, `FinishedGoodsMonthTable.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Why does `derivativeConsumptionPrice()` connect `derivativeConsumptionPrice` to `sales-plan.ts`, `Предметная область`, `derivatives.ts`, `derivative-cost.ts`, `derivative-movement.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `OpexGroupPlanScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12010796221322537 - nodes in this community are weakly interconnected._