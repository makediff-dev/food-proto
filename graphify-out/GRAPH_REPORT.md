# Graph Report - food-proto  (2026-11-23)

## Corpus Check
- 297 files · ~180,654 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2831 nodes · 11291 edges · 95 communities (88 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2b96694`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- RoleProvider.tsx
- ProductIndex
- MovementPlanScreen.tsx
- SalesJournalScreen.tsx
- MaterialsPlanTable.tsx
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- movementRow
- useDocumentStore
- compilerOptions
- profit-tax.ts
- movement-plan.ts
- MaterialReceiptFormTable.tsx
- PropertyTaxScreen.tsx
- cashflow.ts
- derivative-movement.ts
- PageFrame
- vat-report.ts
- TransportSummaryScreen.tsx
- production-plan.ts
- ProductionEntryFormTable.tsx
- Флоу товара
- tax-payment.ts
- react
- FinishedGoodsMonthTable.tsx
- derivative-cost.ts
- mock-document.ts
- opex/paths.ts
- DerivativeCompositionEditor
- transport.ts
- document.ts
- hr.ts
- useRole
- FinishedProductEditScreen.tsx
- production-journal-fact.ts
- flow.md
- FinishedGoodsFactScreen.tsx
- AppShell.tsx
- isQuantityThousandths
- Отчет общий сырья
- materials.ts
- postcss.config.mjs
- shiftMonth
- SummaryTable.tsx
- Отчет общий движения
- summary.ts
- MaterialDocumentScreen.tsx
- finished-goods.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- materials/paths.ts
- vat/paths.ts
- inputs/README.md
- ProductionJournalFactScreen.tsx
- DerivativeCreateScreen.tsx
- production-journal.ts
- Отчет общий движения производных
- credit-resources.ts
- SaleScreen.tsx
- credit-resources/paths.ts
- Себестоимость готовой продукции
- entityNameRowClassName
- recipe-consumption.ts
- production-fact.ts
- index.ts
- SummaryHeadlineTable.tsx
- sales-fact.ts
- operating-expense.ts
- RecipePrint.tsx
- isMonthKey
- derivatives.ts
- sales-plan.ts
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- Отчет подневный продаж
- DerivativeCostScreen.tsx
- mock-opex.ts
- monthKeyFromDate
- sales.ts
- MaterialsNormsScreen.tsx
- migrate-document.ts
- FinishedProductsScreen.tsx
- DerivativeCostTable.tsx
- keepWithNext
- next
- DocumentProvider.tsx
- setMaterialConsumptionDayQuantity

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

## Communities (95 total, 7 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.10
Nodes (48): isDeletionMark(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrTaxRateField, isHrDepartmentIdSafe(), restoreHrPosition() (+40 more)

### Community 1 - "RoleProvider.tsx"
Cohesion: 0.06
Nodes (50): metadata, onest, RootLayout(), unbounded, metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey (+42 more)

### Community 2 - "ProductIndex"
Cohesion: 0.10
Nodes (28): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, inputKind(), MaterialRow(), CategoryBlock(), COLUMN_KIND, ColumnKey (+20 more)

### Community 3 - "MovementPlanScreen.tsx"
Cohesion: 0.08
Nodes (45): metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage(), clampSummaryMonth(), lastSummaryMonth() (+37 more)

### Community 4 - "SalesJournalScreen.tsx"
Cohesion: 0.12
Nodes (27): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+19 more)

### Community 5 - "MaterialsPlanTable.tsx"
Cohesion: 0.08
Nodes (43): costWithVat(), DerivativeMovementRow, DerivativeMovementSection, MaterialGroupMovement, MaterialMovementRow, MaterialMovementTotals, MaterialWarehouseMovement, COLUMN_KIND (+35 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (42): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+34 more)

### Community 7 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "movementRow"
Cohesion: 0.16
Nodes (20): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+12 more)

### Community 11 - "useDocumentStore"
Cohesion: 0.10
Nodes (34): DerivativeConsumptionPage(), metadata, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata (+26 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "profit-tax.ts"
Cohesion: 0.25
Nodes (12): Верхний блок сводки, PROFIT_TAX_PERCENT, ProfitTaxRateChange, byMonth(), DEFAULT_PROFIT_TAX_HUNDREDTHS, isRateHundredths(), PROFIT_TAX_RATE_SCALE, profitTaxRateChanges() (+4 more)

### Community 14 - "movement-plan.ts"
Cohesion: 0.11
Nodes (38): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookOpeningPiecesForProduct(), closingStockPieces(), factualClosingPiecesThrough(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine() (+30 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.11
Nodes (30): Material, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormRow, EntryFormTotals (+22 more)

### Community 16 - "PropertyTaxScreen.tsx"
Cohesion: 0.13
Nodes (21): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE (+13 more)

### Community 17 - "cashflow.ts"
Cohesion: 0.14
Nodes (37): balanceDayFacts(), buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), creditorFieldDayFacts() (+29 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (40): buildRow(), costForQuantity(), derivativeConsumptionDayRecord(), DerivativeConsumptionRejection, DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection (+32 more)

### Community 19 - "PageFrame"
Cohesion: 0.09
Nodes (62): isOccurredOn(), applyDayFactToGroup(), operatingExpenseOtherDayView(), operatingExpenseOtherGroupDayView(), maxProductionEntryOccurredOn(), defaultSalesFactDay(), planMonthOpen(), taxPaymentForDay() (+54 more)

### Community 20 - "vat-report.ts"
Cohesion: 0.31
Nodes (17): add(), DEDUCTIBLE_GROUP_ORDER, expenseDeductibleLines(), hireTransportVat(), line(), materialDeductibleLines(), outsourcingDeductibleLine(), ownFuelVat() (+9 more)

### Community 21 - "TransportSummaryScreen.tsx"
Cohesion: 0.17
Nodes (15): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey, hireColumns() (+7 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "ProductionEntryFormTable.tsx"
Cohesion: 0.11
Nodes (36): Product, ProductCategory, ProductionEntryRejection, buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+28 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "tax-payment.ts"
Cohesion: 0.09
Nodes (32): TaxPaymentKind, ProfitTaxRejection, dayRecord(), isSignedMoney(), isTaxPaymentKind(), setTaxPaymentDay(), setTaxPaymentDayRejection(), TAX_PAYMENT_KINDS (+24 more)

### Community 26 - "react"
Cohesion: 0.10
Nodes (53): react, HR_DEPARTMENT_LABELS, CreditResourcesPlanScreen(), inputKind(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+45 more)

### Community 27 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.07
Nodes (41): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey (+33 more)

### Community 28 - "derivative-cost.ts"
Cohesion: 0.11
Nodes (36): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+28 more)

### Community 29 - "mock-document.ts"
Cohesion: 0.05
Nodes (39): boostTenPercent(), burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat (+31 more)

### Community 30 - "opex/paths.ts"
Cohesion: 0.06
Nodes (55): CashflowOpexGroupFactPage(), generateMetadata(), CashflowHrFactPage(), metadata, CashflowOtherFactPage(), metadata, CashflowTransportFactPage(), metadata (+47 more)

### Community 31 - "DerivativeCompositionEditor"
Cohesion: 0.29
Nodes (5): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups(), IconSearch()

### Community 32 - "transport.ts"
Cohesion: 0.11
Nodes (30): isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireMonthPlanLine, ndflIncludedExVat(), taxAmountExVat(), ratioRound(), profitabilityHundredths(), activeTransportCarriers() (+22 more)

### Community 33 - "document.ts"
Cohesion: 0.05
Nodes (39): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, Creditor, CreditResourceDay, CreditResourceDayLine, CreditResourceMonth, CreditResourceMonthLine (+31 more)

### Community 34 - "hr.ts"
Cohesion: 0.08
Nodes (49): HrDepartmentId, HrShopDepartmentId, HrTaxRatesMonth, isHrShopDepartmentId(), averageSalary(), dayFactsInMonth(), emptySide(), HR_TAX_RATE_SCALE (+41 more)

### Community 35 - "useRole"
Cohesion: 0.15
Nodes (24): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), activeProducts(), deletedProducts(), missingPlanProducts() (+16 more)

### Community 36 - "FinishedProductEditScreen.tsx"
Cohesion: 0.13
Nodes (38): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent() (+30 more)

### Community 37 - "production-journal-fact.ts"
Cohesion: 0.17
Nodes (14): UnitCost, averageAmount(), dayTotals(), ProductionJournalFactDayView, ProductionJournalFactGroup, productionJournalFactGroups(), ProductionJournalFactRow, ProductionJournalFactTotals (+6 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.18
Nodes (16): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+8 more)

### Community 40 - "AppShell.tsx"
Cohesion: 0.08
Nodes (37): DERIVATIVE_MOVEMENT_CONSUMPTION_HREF, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, OPEX_OTHER_FACT_NAV_LABEL, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, HOME_SECTION_ORDER (+29 more)

### Community 41 - "isQuantityThousandths"
Cohesion: 0.15
Nodes (19): FinishedProductRecipePage(), metadata, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS (+11 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "materials.ts"
Cohesion: 0.08
Nodes (64): MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialReceiptLine, MaterialWeightPair, addMaterial(), deletedMaterials(), deleteMaterial() (+56 more)

### Community 45 - "shiftMonth"
Cohesion: 0.08
Nodes (40): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPage() (+32 more)

### Community 46 - "SummaryTable.tsx"
Cohesion: 0.14
Nodes (22): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+14 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.09
Nodes (49): Единицы, monthInterestAmounts(), SalesPlan, productCostPerPiece(), percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), profitTaxRateHundredths() (+41 more)

### Community 49 - "MaterialDocumentScreen.tsx"
Cohesion: 0.12
Nodes (26): metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), fromRubles(), DocumentForm(), changeWarehouse() (+18 more)

### Community 50 - "finished-goods.ts"
Cohesion: 0.12
Nodes (40): bookClosingReferencedProductIds(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), emptyPlanSide(), emptyRangeView(), emptyTotals(), FinishedGoodsDayView (+32 more)

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

### Community 57 - "materials/paths.ts"
Cohesion: 0.08
Nodes (34): MaterialsConsumptionPage(), metadata, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+26 more)

### Community 58 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 60 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.11
Nodes (28): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactMonth(), finishedGoodsFactPageTitle(), parseProductionJournalFactQuery() (+20 more)

### Community 61 - "DerivativeCreateScreen.tsx"
Cohesion: 0.13
Nodes (21): RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), DerivativePage(), metadata, metadata, NewDerivativePage(), isDerivativeWorkshopId() (+13 more)

### Community 62 - "production-journal.ts"
Cohesion: 0.24
Nodes (18): ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection(), productionEntryByIdOrNull() (+10 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "credit-resources.ts"
Cohesion: 0.12
Nodes (46): activeCreditors(), addCreditor(), addCreditorRejection(), CreditCreditorRowView, creditDayAmounts(), CreditDayField, CreditFieldRejection, CreditMonthField (+38 more)

### Community 65 - "SaleScreen.tsx"
Cohesion: 0.18
Nodes (24): periodGridCategories(), maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), SaleRejection, emptySaleLineDraft(), rowMetrics(), SaleLineDraft (+16 more)

### Community 66 - "credit-resources/paths.ts"
Cohesion: 0.11
Nodes (22): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, columnEdge(), CreditResourcesSummaryScreen() (+14 more)

### Community 68 - "entityNameRowClassName"
Cohesion: 0.09
Nodes (63): CashflowSummaryScreen(), toggle(), DayAmountCells(), dayLabel(), defaultOpenIds(), LineRows(), VarianceSense, DerivativeConsumptionTable() (+55 more)

### Community 69 - "recipe-consumption.ts"
Cohesion: 0.20
Nodes (23): DerivativeConsumptionDay, calculatedConsumptionQuantityForDerivativeDay(), calculatedConsumptionQuantityForMaterialDay(), consumptionQuantityForComponent(), derivativeBatchThousandths(), derivativeConsumptionDaysList(), directConsumptionQuantityForComponent(), directConsumptionQuantityInternal() (+15 more)

### Community 70 - "production-fact.ts"
Cohesion: 0.13
Nodes (33): finishedGoodsSummaryAsOfDate(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows() (+25 more)

### Community 71 - "index.ts"
Cohesion: 0.08
Nodes (50): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+42 more)

### Community 72 - "SummaryHeadlineTable.tsx"
Cohesion: 0.32
Nodes (11): formatTaxRateLabel(), headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS (+3 more)

### Community 73 - "sales-fact.ts"
Cohesion: 0.17
Nodes (19): dayGridProducts(), monthDates(), SalesFactDayView, salesFactGridProducts(), SalesFactGroup, salesFactGroups(), salesFactMonth(), SalesFactTotals (+11 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.07
Nodes (44): OpexGroupCode, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), buildOtherGroupView() (+36 more)

### Community 75 - "RecipePrint.tsx"
Cohesion: 0.22
Nodes (17): RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), componentDraftKey(), derivativePrintModel(), draftsFromSavedLines(), lineFromDraft(), productPrintModel(), RecipePrintButton() (+9 more)

### Community 76 - "isMonthKey"
Cohesion: 0.33
Nodes (11): isMonthKey(), isMoney(), monthRecord(), propertyTaxForMonth(), propertyTaxMonthsList(), PropertyTaxMonthView, PropertyTaxRejection, setPropertyTaxPlan() (+3 more)

### Community 77 - "derivatives.ts"
Cohesion: 0.12
Nodes (32): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeCompositionLines(), DerivativeCompositionLineView (+24 more)

### Community 78 - "sales-plan.ts"
Cohesion: 0.10
Nodes (49): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+41 more)

### Community 83 - "DerivativeCostScreen.tsx"
Cohesion: 0.27
Nodes (9): RecipesCostDetailPage(), metadata, RecipesCostPage(), derivativeCostMonth(), DerivativeCostScreen(), parseRecipesCostMonthQuery(), RECIPES_COST_HREF, RECIPES_COST_TITLE (+1 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.05
Nodes (53): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, isShopPositionId() (+45 more)

### Community 85 - "monthKeyFromDate"
Cohesion: 0.14
Nodes (32): Home(), metadata, metadata, PlanPage(), activeCategories(), monthKeyFromDate(), ensureRangeIncludesMonth(), lastHorizonMonth() (+24 more)

### Community 86 - "sales.ts"
Cohesion: 0.21
Nodes (20): Архитектура прототипа, Слои, Удаление, Чего не делать, SaleLine, periodGridProducts(), periodReferencedProductIds(), productAllowedInPeriodSale() (+12 more)

### Community 87 - "MaterialsNormsScreen.tsx"
Cohesion: 0.31
Nodes (8): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE, MATERIAL_NORM_ERROR

### Community 88 - "migrate-document.ts"
Cohesion: 0.18
Nodes (15): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+7 more)

### Community 89 - "FinishedProductsScreen.tsx"
Cohesion: 0.17
Nodes (15): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE, RecipeJournalsScreen() (+7 more)

### Community 90 - "DerivativeCostTable.tsx"
Cohesion: 0.11
Nodes (32): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell(), CostRow(), DerivativeCostTable() (+24 more)

### Community 92 - "keepWithNext"
Cohesion: 0.08
Nodes (71): TotalCell(), MetricCell(), RowCell(), TotalsCell(), RowCell(), RowCell(), TotalsCell(), NormDeviationCell() (+63 more)

### Community 94 - "next"
Cohesion: 0.18
Nodes (12): nextConfig, next, OpexGroupFactRedirectPage(), OpexHrFactRedirectPage(), OpexOtherFactRedirectPage(), OpexTransportFactRedirectPage(), OPEX_HR_FACT_HREF, OPEX_OTHER_FACT_HREF (+4 more)

### Community 99 - "DocumentProvider.tsx"
Cohesion: 0.18
Nodes (16): Поток данных, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider() (+8 more)

### Community 100 - "setMaterialConsumptionDayQuantity"
Cohesion: 0.32
Nodes (8): emptyMaterialConsumptionLine(), materialConsumptionDayRecord(), materialConsumptionDaysList(), realConsumptionQuantityForMaterial(), realConsumptionQuantityForMaterialDay(), setMaterialConsumptionDayQuantity(), buildSections(), dayGridMaterials()

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 558 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `RoleProvider.tsx`, `ProductIndex`, `MovementPlanScreen.tsx`, `SalesJournalScreen.tsx`, `package.json`, `useDocumentStore`, `PropertyTaxScreen.tsx`, `PageFrame`, `TransportSummaryScreen.tsx`, `ProductionEntryFormTable.tsx`, `react`, `opex/paths.ts`, `useRole`, `FinishedProductEditScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `AppShell.tsx`, `isQuantityThousandths`, `materials.ts`, `shiftMonth`, `MaterialDocumentScreen.tsx`, `materials/paths.ts`, `vat/paths.ts`, `ProductionJournalFactScreen.tsx`, `DerivativeCreateScreen.tsx`, `SaleScreen.tsx`, `credit-resources/paths.ts`, `entityNameRowClassName`, `sales-fact.ts`, `derivatives.ts`, `DerivativeCostScreen.tsx`, `monthKeyFromDate`, `MaterialsNormsScreen.tsx`, `FinishedProductsScreen.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09948979591836735 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `production-fact.ts`, `movementRow`, `materials.ts`, `movement-plan.ts`, `summary.ts`, `derivative-movement.ts`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `RoleProvider.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05817028027498678 - nodes in this community are weakly interconnected._
- **Why does `Что пишется` connect `Ввод плана (производство)` to `finished-goods.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `ProductIndex` be split into smaller, more focused modules?**
  _Cohesion score 0.09879032258064516 - nodes in this community are weakly interconnected._