# Graph Report - food-proto  (2026-11-17)

## Corpus Check
- 297 files · ~178,600 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2813 nodes · 11184 edges · 94 communities (86 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `da5d8319`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- RoleProvider.tsx
- SummaryTable.tsx
- shiftMonth
- SalesJournalScreen.tsx
- FinishedGoodsNormativeColumnHeading.tsx
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- materials.ts
- sales-fact.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- movement-plan.ts
- MaterialReceiptFormTable.tsx
- cashflow/paths.ts
- credit-resources.ts
- derivative-movement.ts
- setMaterialOpeningRejection
- PropertyTaxScreen.tsx
- TransportSummaryScreen
- production-plan.ts
- ProductionEntryScreen.tsx
- Флоу товара
- sales/text.ts
- materialById
- use-materials.ts
- OpexGroupPlanScreen
- mock-document.ts
- SaleScreen.tsx
- ColumnLabel
- sales.ts
- DocumentProvider.tsx
- hr.ts
- RecipePrint.tsx
- FinishedProductsScreen.tsx
- production-journal-fact.ts
- flow.md
- FinishedGoodsFactScreen.tsx
- AppShell.tsx
- derivative-cost.ts
- Отчет общий сырья
- materials/text.ts
- postcss.config.mjs
- consumption/page.tsx
- planMonthOpen
- Отчет общий движения
- summary.ts
- MaterialsNormsScreen.tsx
- finished-goods.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- isQuantityThousandths
- vat/paths.ts
- inputs/README.md
- ProductionJournalFactScreen.tsx
- recipes/paths.ts
- setMaterialConsumptionDayQuantity
- Отчет общий движения производных
- document.ts
- credit-resources/paths.ts
- SaleScreen
- Себестоимость готовой продукции
- entityNameRowClassName
- RecipeComponentSearch
- production-fact.ts
- index.ts
- transportMonthView
- ProductionPlanScreen.tsx
- operating-expense.ts
- mock-property-tax.ts
- opex/paths.ts
- derivatives.ts
- sales-plan.ts
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- Отчет подневный продаж
- recipes/new/page.tsx
- mock-opex.ts
- monthKeyFromDate
- production-journal.ts
- setMaterialPlanField
- SettingsScreen.tsx
- RecipeJournalsTable.tsx
- DerivativeCostTable.tsx
- keepWithNext
- next
- DerivativeEditScreen

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 124 edges
2. `next` - 120 edges
3. `PageFrame()` - 113 edges
4. `react` - 91 edges
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
- `Свод` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/tables/derivative-cost.md → src/domain/derivative-cost.ts

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

## Communities (94 total, 8 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.13
Nodes (44): isDeletionMark(), isTransportHireKind(), deleteHrPosition(), deleteOpexOtherLine(), demoteOpexGroup(), demoteOpexGroupRejection(), activeTransportCarriers(), activeTransportVehicles() (+36 more)

### Community 1 - "RoleProvider.tsx"
Cohesion: 0.13
Nodes (22): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT, ALL_NAV_SECTIONS (+14 more)

### Community 2 - "SummaryTable.tsx"
Cohesion: 0.07
Nodes (58): CreditResourcesPlanScreen(), inputKind(), AddPositionDialog(), AddLineDialog(), OtherGroupBlock(), AddOtherLineDialog(), OtherPlanScreen(), opexGroupHref() (+50 more)

### Community 3 - "shiftMonth"
Cohesion: 0.08
Nodes (45): metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage(), activeCategories(), clampSummaryMonth() (+37 more)

### Community 4 - "SalesJournalScreen.tsx"
Cohesion: 0.14
Nodes (23): metadata, SalesJournalPage(), metadata, SalesFactPage(), Sale, saleTotals, workingSales(), workingSalesInMonth() (+15 more)

### Community 5 - "FinishedGoodsNormativeColumnHeading.tsx"
Cohesion: 0.10
Nodes (23): Подсказки заголовков таблицы, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), ProductRow(), visibleDayRows(), DERIVATIVE_RECEIPT_SUB_BANNERS, FINISHED_GOODS_CLOSING_SUB_BANNERS (+15 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+35 more)

### Community 7 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "materials.ts"
Cohesion: 0.13
Nodes (30): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+22 more)

### Community 11 - "sales-fact.ts"
Cohesion: 0.15
Nodes (22): dayGridProducts(), dayTotals(), monthDates(), productById(), rowMetrics(), SalesFactDayView, salesFactGridProducts(), SalesFactGroup (+14 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.09
Nodes (58): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), setLine() (+50 more)

### Community 14 - "movement-plan.ts"
Cohesion: 0.12
Nodes (38): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), closingInventoryDeviationPieces(), closingStockPieces(), factualClosingPiecesThrough(), FinishedGoodsOpeningRejection (+30 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (55): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+47 more)

### Community 16 - "cashflow/paths.ts"
Cohesion: 0.13
Nodes (19): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE (+11 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.12
Nodes (46): activeCreditors(), addCreditor(), addCreditorRejection(), creditDayAmounts(), CreditDayField, CreditFieldRejection, CreditMonthField, CreditMonthViewOptions (+38 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.06
Nodes (70): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPlanPage(), metadata, buildRow(), costForQuantity(), derivativeConsumptionDayRecord(), DerivativeConsumptionRejection (+62 more)

### Community 19 - "setMaterialOpeningRejection"
Cohesion: 0.25
Nodes (9): hasStoredMaterialInventoryLine(), materialNormsList(), materialOpeningsList(), materialReceiptById(), materialReceiptsList(), openingFor(), referencedMaterialIds(), setMaterialOpening() (+1 more)

### Community 20 - "PropertyTaxScreen.tsx"
Cohesion: 0.05
Nodes (81): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+73 more)

### Community 21 - "TransportSummaryScreen"
Cohesion: 0.25
Nodes (8): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), hireColumns(), hireGroupEndClass(), ownGroupEndClass(), TransportSummaryScreen()

### Community 22 - "production-plan.ts"
Cohesion: 0.10
Nodes (40): Удаление, commitDocumentUpdate(), Product, ProductCategory, ProductionPlanLine, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), openingReferencedProductIds() (+32 more)

### Community 23 - "ProductionEntryScreen.tsx"
Cohesion: 0.20
Nodes (16): ProductionEntryRejection, productionJournalHref(), emptyProductionEntryLineDraft(), ProductionEntryLineDraft, ProductionEntryLineField, EntryForm(), parsedLines(), save() (+8 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "sales/text.ts"
Cohesion: 0.13
Nodes (21): SalesPlanRejection, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), CREDIT_ERROR (+13 more)

### Community 26 - "materialById"
Cohesion: 0.22
Nodes (15): Свод, Свод, isMaterialWarehouseId(), isPrice(), materialById(), materialConsumptionPrice(), materialPlanPrice(), materialReceiptRejection() (+7 more)

### Community 27 - "use-materials.ts"
Cohesion: 0.27
Nodes (18): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWeightPair(), isVatPercent(), materialNameRejection, materialsList() (+10 more)

### Community 28 - "OpexGroupPlanScreen"
Cohesion: 0.10
Nodes (25): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexHrPage(), metadata (+17 more)

### Community 29 - "mock-document.ts"
Cohesion: 0.04
Nodes (41): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, boostTenPercent(), burger, caesar, CatalogProductId, catalogProductIds (+33 more)

### Community 30 - "SaleScreen.tsx"
Cohesion: 0.19
Nodes (24): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), SaleRejection, emptySaleLineDraft(), rowMetrics(), SaleLineDraft, SaleLineField (+16 more)

### Community 31 - "ColumnLabel"
Cohesion: 0.09
Nodes (55): HR_DEPARTMENT_LABELS, CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), columnEdge(), CreditResourcesSummaryScreen(), formatInterestRate() (+47 more)

### Community 32 - "sales.ts"
Cohesion: 0.37
Nodes (13): SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales(), saleById() (+5 more)

### Community 33 - "DocumentProvider.tsx"
Cohesion: 0.09
Nodes (31): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+23 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (58): HrDepartmentId, HrTaxRatesMonth, isHrShopDepartmentId(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), averageSalary(), dayFactsInMonth() (+50 more)

### Community 35 - "RecipePrint.tsx"
Cohesion: 0.19
Nodes (17): DerivativeAddRejection, Derivative, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), derivativePrintModel(), draftsFromSavedLines(), GroupRows(), lineFromDraft() (+9 more)

### Community 36 - "FinishedProductsScreen.tsx"
Cohesion: 0.23
Nodes (11): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductEditScreen(), FinishedProductsScreen() (+3 more)

### Community 37 - "production-journal-fact.ts"
Cohesion: 0.15
Nodes (18): costWithVat(), UnitCost, amountWithVat(), averageAmount(), dayTotals(), ProductionJournalFactDayView, ProductionJournalFactGroup, productionJournalFactGroups() (+10 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.14
Nodes (22): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay() (+14 more)

### Community 40 - "AppShell.tsx"
Cohesion: 0.06
Nodes (51): Архитектура прототипа, Поток данных, Слои, Чего не делать, DerivativeConsumptionPage(), metadata, DerivativeMovementPage(), metadata (+43 more)

### Community 41 - "derivative-cost.ts"
Cohesion: 0.10
Nodes (39): buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeConsumptionPrice() (+31 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "materials/text.ts"
Cohesion: 0.13
Nodes (14): MaterialUnit, MaterialWeightPair, MaterialConsumptionRejection, MaterialDocumentRejection, MaterialMovementRow, MaterialMovementTotals, MaterialNormRejection, MaterialOpeningRejection (+6 more)

### Community 45 - "consumption/page.tsx"
Cohesion: 0.50
Nodes (4): MaterialsConsumptionPage(), metadata, MATERIALS_CONSUMPTION_TITLE, parseMaterialDayQuery()

### Community 46 - "planMonthOpen"
Cohesion: 0.09
Nodes (62): CashflowOtherFactPage(), metadata, isOccurredOn(), applyDayFactToGroup(), operatingExpenseOtherDayView(), operatingExpenseOtherGroupDayView(), maxProductionEntryOccurredOn(), defaultSalesFactDay() (+54 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.09
Nodes (52): Единицы, monthInterestAmounts(), SalesPlan, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), factVolumeScale(), planVolumeScale() (+44 more)

### Community 49 - "MaterialsNormsScreen.tsx"
Cohesion: 0.31
Nodes (8): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE, MATERIAL_NORM_ERROR

### Community 50 - "finished-goods.ts"
Cohesion: 0.15
Nodes (36): buildGroups(), closingNormMetrics(), emptyPlanSide(), emptyRangeView(), emptyTotals(), FinishedGoodsDayView, finishedGoodsMonthDays(), finishedGoodsMonthView (+28 more)

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

### Community 57 - "isQuantityThousandths"
Cohesion: 0.20
Nodes (15): ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths() (+7 more)

### Community 58 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 60 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (19): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref() (+11 more)

### Community 61 - "recipes/paths.ts"
Cohesion: 0.14
Nodes (17): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), parseDerivativeWorkshopQuery(), parseRecipesCostMonthQuery() (+9 more)

### Community 62 - "setMaterialConsumptionDayQuantity"
Cohesion: 0.38
Nodes (7): emptyMaterialConsumptionLine(), materialConsumptionDayRecord(), materialConsumptionDaysList(), realConsumptionQuantityForMaterialDay(), setMaterialConsumptionDayQuantity(), buildSections(), dayGridMaterials()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "document.ts"
Cohesion: 0.05
Nodes (40): Creditor, DeletableRecord, DERIVATIVE_UNITS, DerivativeConsumptionDayLine, DerivativeNorm, DerivativeNormLine, DerivativeOpening, DerivativeOpeningLine (+32 more)

### Community 65 - "credit-resources/paths.ts"
Cohesion: 0.13
Nodes (19): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+11 more)

### Community 66 - "SaleScreen"
Cohesion: 0.28
Nodes (7): metadata, SalePage(), metadata, NewSalePage(), defaultSaleDay(), NEW_SALE_TITLE, SaleScreen()

### Community 68 - "entityNameRowClassName"
Cohesion: 0.06
Nodes (67): MaterialGroupId, MaterialGroupMovement, MaterialWarehouseMovement, DerivativeRow(), inputKind(), DerivativeRow(), DerivativeRow(), RowCell() (+59 more)

### Community 70 - "production-fact.ts"
Cohesion: 0.15
Nodes (30): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+22 more)

### Community 71 - "index.ts"
Cohesion: 0.07
Nodes (90): react, DerivativeMovementRow, DerivativeMovementSection, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), VarianceSense (+82 more)

### Community 72 - "transportMonthView"
Cohesion: 0.25
Nodes (9): hireAmount(), hirePlanLine(), ownDayFuelAmountExVat(), ownDayKmThousandths(), ownPlanAmountExVat(), ownPlanCostPerKmExVat(), previousDay(), transportMonthView (+1 more)

### Community 73 - "ProductionPlanScreen.tsx"
Cohesion: 0.08
Nodes (34): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPage() (+26 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (57): OpexGroupCode, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), buildOtherGroupView() (+49 more)

### Community 75 - "mock-property-tax.ts"
Cohesion: 0.29
Nodes (4): mockPropertyTaxMonths, mockPropertyTaxPayments, PropertyTaxMonth, TaxPaymentDay

### Community 76 - "opex/paths.ts"
Cohesion: 0.07
Nodes (38): CashflowOpexGroupFactPage(), CashflowHrFactPage(), metadata, CashflowTransportFactPage(), metadata, OpexGroupFactRedirectPage(), OpexHrFactRedirectPage(), OpexOtherFactRedirectPage() (+30 more)

### Community 77 - "derivatives.ts"
Cohesion: 0.12
Nodes (31): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection (+23 more)

### Community 78 - "sales-plan.ts"
Cohesion: 0.06
Nodes (74): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+66 more)

### Community 83 - "recipes/new/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, NewDerivativePage(), DerivativeCreateScreen(), NEW_DERIVATIVE_TITLE

### Community 84 - "mock-opex.ts"
Cohesion: 0.05
Nodes (55): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, isShopPositionId() (+47 more)

### Community 85 - "monthKeyFromDate"
Cohesion: 0.12
Nodes (30): Home(), metadata, metadata, PlanPage(), recommendedVolumePiecesForMonths(), monthKeyFromDate(), SalesComparison, productionFactHref() (+22 more)

### Community 86 - "production-journal.ts"
Cohesion: 0.20
Nodes (21): ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection() (+13 more)

### Community 87 - "setMaterialPlanField"
Cohesion: 0.67
Nodes (4): emptyPlanLine(), materialMonthPlansList(), planFor(), setMaterialPlanField()

### Community 88 - "SettingsScreen.tsx"
Cohesion: 0.12
Nodes (20): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+12 more)

### Community 89 - "RecipeJournalsTable.tsx"
Cohesion: 0.24
Nodes (13): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+5 more)

### Community 90 - "DerivativeCostTable.tsx"
Cohesion: 0.08
Nodes (40): COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, CostCell(), GROUP_END_KEYS, COLUMN_GROUPS, COLUMN_KIND (+32 more)

### Community 92 - "keepWithNext"
Cohesion: 0.08
Nodes (69): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MetricCell(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+61 more)

### Community 94 - "next"
Cohesion: 0.07
Nodes (53): nextConfig, next, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+45 more)

### Community 101 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 558 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `SummaryTable.tsx`, `shiftMonth`, `SalesJournalScreen.tsx`, `package.json`, `sales-fact.ts`, `DerivativeCreateScreen.tsx`, `cashflow/paths.ts`, `derivative-movement.ts`, `PropertyTaxScreen.tsx`, `TransportSummaryScreen`, `ProductionEntryScreen.tsx`, `OpexGroupPlanScreen`, `SaleScreen.tsx`, `ColumnLabel`, `DocumentProvider.tsx`, `FinishedProductsScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `AppShell.tsx`, `consumption/page.tsx`, `planMonthOpen`, `MaterialsNormsScreen.tsx`, `vat/paths.ts`, `ProductionJournalFactScreen.tsx`, `recipes/paths.ts`, `credit-resources/paths.ts`, `SaleScreen`, `index.ts`, `ProductionPlanScreen.tsx`, `opex/paths.ts`, `derivatives.ts`, `sales-plan.ts`, `recipes/new/page.tsx`, `monthKeyFromDate`, `SettingsScreen.tsx`, `RecipeJournalsTable.tsx`, `DerivativeEditScreen`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13140096618357489 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `RoleProvider.tsx`, `SummaryTable.tsx`, `shiftMonth`, `SalesJournalScreen.tsx`, `FinishedGoodsNormativeColumnHeading.tsx`, `package.json`, `sales-fact.ts`, `DerivativeCreateScreen.tsx`, `MaterialReceiptFormTable.tsx`, `derivative-movement.ts`, `PropertyTaxScreen.tsx`, `ProductionEntryScreen.tsx`, `SaleScreen.tsx`, `ColumnLabel`, `DocumentProvider.tsx`, `FinishedGoodsFactScreen.tsx`, `AppShell.tsx`, `planMonthOpen`, `ProductionJournalFactScreen.tsx`, `entityNameRowClassName`, `ProductionPlanScreen.tsx`, `sales-plan.ts`, `monthKeyFromDate`, `SettingsScreen.tsx`, `RecipeJournalsTable.tsx`, `DerivativeCostTable.tsx`, `keepWithNext`, `next`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `RoleProvider.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Why does `PrototypeDocument` connect `DocumentProvider.tsx` to `use-opex.ts`, `SalesJournalScreen.tsx`, `materials.ts`, `sales-fact.ts`, `movement-plan.ts`, `credit-resources.ts`, `derivative-movement.ts`, `PropertyTaxScreen.tsx`, `production-plan.ts`, `ProductionEntryScreen.tsx`, `mock-document.ts`, `SaleScreen.tsx`, `sales.ts`, `hr.ts`, `RecipePrint.tsx`, `production-journal-fact.ts`, `AppShell.tsx`, `derivative-cost.ts`, `summary.ts`, `finished-goods.ts`, `isQuantityThousandths`, `document.ts`, `production-fact.ts`, `index.ts`, `ProductionPlanScreen.tsx`, `operating-expense.ts`, `derivatives.ts`, `sales-plan.ts`, `production-journal.ts`, `SettingsScreen.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `SummaryTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06963470319634703 - nodes in this community are weakly interconnected._