# Graph Report - food-proto  (2026-11-16)

## Corpus Check
- 291 files · ~170,028 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2704 nodes · 10598 edges · 95 communities (88 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4dae3d8c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- SummaryTable.tsx
- ProductionJournalScreen.tsx
- sales-fact.ts
- document.ts
- FinishedGoodsFactScreen.tsx
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- materials.ts
- finished-goods.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- keepWithNext
- MaterialReceiptFormTable.tsx
- OpexGroupPlanScreen
- credit-resources.ts
- derivative-movement.ts
- MaterialsPlanScreen.tsx
- cashflow.ts
- RecipePrint.tsx
- production-plan.ts
- profit-tax.ts
- Флоу товара
- materials/paths.ts
- PageFrame
- movement-plan.ts
- useDocumentStore
- ratioRound
- production-fact.ts
- migrate-document.ts
- recipes/paths.ts
- DocumentProvider.tsx
- hr.ts
- monthKeyFromDate
- index.ts
- AppShell.tsx
- flow.md
- access.ts
- cashflow/paths.ts
- derivatives.ts
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- vat/paths.ts
- planMonthOpen
- Отчет общий движения
- summary.ts
- DerivativeMovementPlanScreen.tsx
- useRole
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- credit-resources/paths.ts
- RecipeComponentSearch
- inputs/README.md
- entityNameRowClassName
- next
- SaleScreen
- Отчет общий движения производных
- sales.ts
- derivative-cost.ts
- MaterialDocumentScreen.tsx
- Себестоимость готовой продукции
- IconChevronDown
- Отчет подневный движения
- ProductionJournalFactScreen.tsx
- DerivativeCostTable.tsx
- sales/text.ts
- production-journal.ts
- operating-expense.ts
- Icons.tsx
- RecipeJournalsTable.tsx
- use-materials.ts
- sales-plan.ts
- Отчет подневный производства
- SummaryHeadlineTable.tsx
- SaleScreen.tsx
- SalesJournalScreen.tsx
- AGENTS.md
- mock-opex.ts
- SummaryScreen.tsx
- Отчет общий производства
- Отчет подневный продаж
- SettingsScreen.tsx
- README.md
- DerivativeEditScreen
- Cells.tsx
- Движение готовой продукции
- Движение производных
- Операционные расходы

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 120 edges
2. `next` - 116 edges
3. `PageFrame()` - 109 edges
4. `react` - 85 edges
5. `useOpex()` - 81 edges
6. `entityNameRowClassName()` - 80 edges
7. `planMonthOpen()` - 77 edges
8. `ColumnLabel()` - 76 edges
9. `useRole()` - 71 edges
10. `isOccurredOn()` - 69 edges

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

## Communities (95 total, 7 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.07
Nodes (70): HireSeed, HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine (+62 more)

### Community 1 - "SummaryTable.tsx"
Cohesion: 0.16
Nodes (20): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+12 more)

### Community 2 - "ProductionJournalScreen.tsx"
Cohesion: 0.13
Nodes (24): metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), productionEntryPieces(), workingProductionEntriesInMonth() (+16 more)

### Community 3 - "sales-fact.ts"
Cohesion: 0.09
Nodes (34): Архитектура прототипа, Слои, Удаление, Чего не делать, UnitCost, Product, productCostPerPiece(), averageAmount() (+26 more)

### Community 4 - "document.ts"
Cohesion: 0.03
Nodes (71): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+63 more)

### Community 5 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.17
Nodes (18): metadata, MovementFactPage(), monthDates(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth() (+10 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (24): Блоки, Ввод факта (производство), Готовая продукция (рецептурный журнал), Движение денежных средств, Движение кредитных ресурсов, Отчет общий (производство), Отчет подневный (производство), Период и ассортимент (+16 more)

### Community 7 - "mock-materials.ts"
Cohesion: 0.10
Nodes (25): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+17 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "materials.ts"
Cohesion: 0.10
Nodes (43): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+35 more)

### Community 11 - "finished-goods.ts"
Cohesion: 0.11
Nodes (49): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+41 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.11
Nodes (51): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), MaterialDialog() (+43 more)

### Community 14 - "keepWithNext"
Cohesion: 0.07
Nodes (77): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, MetricCell() (+69 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (55): DerivativeRow(), setLine(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, emptyMaterialReceiptLineDraft(), EntryFormGroup (+47 more)

### Community 16 - "OpexGroupPlanScreen"
Cohesion: 0.09
Nodes (29): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexHrPage(), metadata (+21 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.13
Nodes (45): activeCreditors(), addCreditor(), addCreditorRejection(), creditDayAmounts(), CreditDayField, CreditFieldRejection, CreditMonthField, CreditMonthViewOptions (+37 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.15
Nodes (28): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), derivativeNormsList(), derivativeOpeningsList(), factConsumptionQuantityForDerivative() (+20 more)

### Community 19 - "MaterialsPlanScreen.tsx"
Cohesion: 0.10
Nodes (23): MaterialsInventoryPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWarehouseId, MaterialWeightPair (+15 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.07
Nodes (63): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+55 more)

### Community 21 - "RecipePrint.tsx"
Cohesion: 0.20
Nodes (19): DerivativeAddRejection, derivativeWorkshopById(), warehouseIdForWorkshop(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), componentDraftKey(), derivativePrintModel(), draftsFromSavedLines() (+11 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.18
Nodes (20): activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan(), isVolume(), monthIsTaken() (+12 more)

### Community 23 - "profit-tax.ts"
Cohesion: 0.24
Nodes (14): Верхний блок сводки, PROFIT_TAX_PERCENT, ProfitTaxRateChange, byMonth(), DEFAULT_PROFIT_TAX_HUNDREDTHS, isRateHundredths(), PROFIT_TAX_RATE_SCALE, profitTaxRateChanges() (+6 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "materials/paths.ts"
Cohesion: 0.13
Nodes (20): MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialsNormsScreen(), MaterialsPlanScreen() (+12 more)

### Community 26 - "PageFrame"
Cohesion: 0.21
Nodes (16): metadata, MovementPage(), activeCategories(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle() (+8 more)

### Community 27 - "movement-plan.ts"
Cohesion: 0.13
Nodes (31): FinishedGoodsNormLine, FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), storedInventoryPiecesForProduct() (+23 more)

### Community 28 - "useDocumentStore"
Cohesion: 0.17
Nodes (18): useDocumentStore(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), useProductionPlan(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth() (+10 more)

### Community 29 - "ratioRound"
Cohesion: 0.26
Nodes (13): ratioRound(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef (+5 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.15
Nodes (30): periodGridCategories(), periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale() (+22 more)

### Community 31 - "migrate-document.ts"
Cohesion: 0.20
Nodes (14): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+6 more)

### Community 32 - "recipes/paths.ts"
Cohesion: 0.08
Nodes (35): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), FinishedProductRecipePage(), metadata (+27 more)

### Community 33 - "DocumentProvider.tsx"
Cohesion: 0.23
Nodes (13): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+5 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (57): isShopPositionId(), HR_DEPARTMENT_IDS, HrDayStaffLine, HrMonthFact, HrMonthFactStaffLine, HrMonthPlanStaffLine, HrPosition, isHrShopDepartmentId() (+49 more)

### Community 35 - "monthKeyFromDate"
Cohesion: 0.09
Nodes (40): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), missingProductionPlanProducts(), activeProducts(), monthKeyFromDate(), shiftMonth() (+32 more)

### Community 36 - "index.ts"
Cohesion: 0.07
Nodes (79): DerivativeMovementRow, DerivativeMovementSection, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, adjacentDay(), COLUMN_KIND, ColumnKey (+71 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.10
Nodes (29): Поток данных, OpexGroupFactRedirectPage(), OPEX_OTHER_FACT_NAV_LABEL, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, opexGroupFactHrefPath(), opexGroupHrefPath(), opexGroupPlanHref() (+21 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "access.ts"
Cohesion: 0.23
Nodes (11): RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref(), SECTION_HOME, ROLES_HREF (+3 more)

### Community 40 - "cashflow/paths.ts"
Cohesion: 0.13
Nodes (20): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE (+12 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.14
Nodes (27): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection (+19 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (22): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+14 more)

### Community 45 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 46 - "planMonthOpen"
Cohesion: 0.13
Nodes (40): CashflowTransportFactPage(), metadata, isOccurredOn(), operatingExpenseOtherDayView(), maxProductionEntryOccurredOn(), defaultSalesFactDay(), planMonthOpen(), taxPaymentForDay() (+32 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.10
Nodes (40): monthInterestAmounts(), SalesPlan, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), salesPlanTotals, applyFactScale(), applyPlanScale() (+32 more)

### Community 49 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.09
Nodes (32): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), DerivativeNormRejection (+24 more)

### Community 50 - "useRole"
Cohesion: 0.15
Nodes (23): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+15 more)

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

### Community 57 - "credit-resources/paths.ts"
Cohesion: 0.13
Nodes (19): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+11 more)

### Community 58 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

### Community 60 - "entityNameRowClassName"
Cohesion: 0.05
Nodes (69): costWithVat(), MaterialMovementTotals, DerivativeRow(), RowCell(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey (+61 more)

### Community 61 - "next"
Cohesion: 0.08
Nodes (39): nextConfig, next, CashflowOpexGroupFactPage(), CashflowHrFactPage(), metadata, CashflowOtherFactPage(), metadata, OpexHrFactRedirectPage() (+31 more)

### Community 62 - "SaleScreen"
Cohesion: 0.24
Nodes (8): metadata, SalePage(), metadata, NewSalePage(), defaultSaleDay(), saleByIdOrNull(), NEW_SALE_TITLE, SaleScreen()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "sales.ts"
Cohesion: 0.26
Nodes (17): commitDocumentUpdate(), SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), maxSaleOccurredOn(), normalizeCustomer() (+9 more)

### Community 65 - "derivative-cost.ts"
Cohesion: 0.10
Nodes (41): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+33 more)

### Community 66 - "MaterialDocumentScreen.tsx"
Cohesion: 0.14
Nodes (19): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MaterialReceiptsPage(), metadata, MATERIAL_WAREHOUSES, materialReceiptById() (+11 more)

### Community 68 - "IconChevronDown"
Cohesion: 0.16
Nodes (31): CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), VarianceSense, cashflowSummaryHref(), WorkshopBlock(), WorkshopBlock() (+23 more)

### Community 70 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.16
Nodes (19): metadata, ProductionFactPage(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), DayDateControl() (+11 more)

### Community 71 - "DerivativeCostTable.tsx"
Cohesion: 0.10
Nodes (34): DerivativeCostRow, DerivativeCostSection, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell() (+26 more)

### Community 72 - "sales/text.ts"
Cohesion: 0.25
Nodes (7): SalesPlanRejection, formatPerDay(), formatPriceExVat(), MONTHS, MONTHS_GENITIVE, parseOperatingExpense(), SALES_PLAN_ERROR

### Community 73 - "production-journal.ts"
Cohesion: 0.09
Nodes (44): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductCategory, ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry() (+36 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (58): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection() (+50 more)

### Community 75 - "Icons.tsx"
Cohesion: 0.08
Nodes (72): react, HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, CreditResourcesPlanScreen(), inputKind(), COLUMN_GROUPS, COLUMN_KIND (+64 more)

### Community 76 - "RecipeJournalsTable.tsx"
Cohesion: 0.23
Nodes (13): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+5 more)

### Community 77 - "use-materials.ts"
Cohesion: 0.19
Nodes (26): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+18 more)

### Community 78 - "sales-plan.ts"
Cohesion: 0.07
Nodes (60): Home(), metadata, metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+52 more)

### Community 80 - "SummaryHeadlineTable.tsx"
Cohesion: 0.32
Nodes (11): formatTaxRateLabel(), headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS (+3 more)

### Community 81 - "SaleScreen.tsx"
Cohesion: 0.20
Nodes (23): saleLineAmountWithVat(), saleLinePriceWithVat(), SaleRejection, emptySaleLineDraft(), rowMetrics(), SaleLineDraft, SaleLineField, initialDrafts() (+15 more)

### Community 82 - "SalesJournalScreen.tsx"
Cohesion: 0.16
Nodes (20): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, parseSalesFactQuery(), parseSalesJournalQuery(), saleHref() (+12 more)

### Community 83 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (43): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), MOCK_MONTHS, MOCK_VEHICLE_IDS (+35 more)

### Community 85 - "SummaryScreen.tsx"
Cohesion: 0.18
Nodes (26): Единицы, actualRangeSummary(), calendarDays(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), rangeSummary(), summaryForLens() (+18 more)

### Community 88 - "SettingsScreen.tsx"
Cohesion: 0.11
Nodes (24): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+16 more)

### Community 89 - "README.md"
Cohesion: 0.27
Nodes (6): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула, Запуск, Куда смотреть

### Community 90 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

### Community 91 - "Cells.tsx"
Cohesion: 0.13
Nodes (23): formatRubles(), fromRubles(), fromRublesUpTo(), parseDecimal(), roundKopecksToRubles(), parsePropertyTaxMoney(), CREDIT_ERROR, parseCreditMoney() (+15 more)

### Community 92 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 93 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

### Community 95 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 542 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionJournalScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `OpexGroupPlanScreen`, `MaterialsPlanScreen.tsx`, `materials/paths.ts`, `PageFrame`, `useDocumentStore`, `recipes/paths.ts`, `monthKeyFromDate`, `AppShell.tsx`, `access.ts`, `cashflow/paths.ts`, `derivatives.ts`, `RoleProvider.tsx`, `vat/paths.ts`, `planMonthOpen`, `DerivativeMovementPlanScreen.tsx`, `useRole`, `credit-resources/paths.ts`, `entityNameRowClassName`, `SaleScreen`, `MaterialDocumentScreen.tsx`, `IconChevronDown`, `ProductionJournalFactScreen.tsx`, `production-journal.ts`, `Icons.tsx`, `RecipeJournalsTable.tsx`, `sales-plan.ts`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`, `SummaryScreen.tsx`, `SettingsScreen.tsx`, `DerivativeEditScreen`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07120500782472614 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionJournalScreen.tsx`, `sales-fact.ts`, `FinishedGoodsFactScreen.tsx`, `finished-goods.ts`, `OpexGroupPlanScreen`, `MaterialsPlanScreen.tsx`, `materials/paths.ts`, `PageFrame`, `useDocumentStore`, `production-fact.ts`, `recipes/paths.ts`, `hr.ts`, `cashflow/paths.ts`, `planMonthOpen`, `summary.ts`, `DerivativeMovementPlanScreen.tsx`, `useRole`, `entityNameRowClassName`, `next`, `SaleScreen`, `sales.ts`, `MaterialDocumentScreen.tsx`, `IconChevronDown`, `ProductionJournalFactScreen.tsx`, `production-journal.ts`, `Icons.tsx`, `sales-plan.ts`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`, `SummaryScreen.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `ProductionJournalScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13054187192118227 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `materials.ts`, `derivative-movement.ts`, `Ввод плана (производство)`, `SummaryScreen.tsx`, `production-plan.ts`, `production-fact.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `sales-fact.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09309309309309309 - nodes in this community are weakly interconnected._