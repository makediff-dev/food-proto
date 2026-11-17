# Graph Report - food-proto  (2026-11-17)

## Corpus Check
- 297 files · ~176,704 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2798 nodes · 11105 edges · 88 communities (81 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9987e8b6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- OpexGroupPlanScreen
- react
- ProductionJournalFactScreen.tsx
- IconChevronDown
- parseDecimal
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- materials.ts
- SummaryTable.tsx
- compilerOptions
- DerivativeCreateScreen.tsx
- movement-plan.ts
- MaterialReceiptFormTable.tsx
- SaleScreen.tsx
- credit-resources.ts
- derivative-movement.ts
- MaterialDocumentScreen.tsx
- cashflow.ts
- DerivativeMovementSummaryTable.tsx
- production-plan.ts
- profit-tax.ts
- Флоу товара
- materials/paths.ts
- access.ts
- DerivativeConsumptionScreen.tsx
- MaterialsPlanScreen.tsx
- mock-document.ts
- production-fact.ts
- document.ts
- recipes/cost/[id]/page.tsx
- DocumentProvider.tsx
- hr.ts
- FinishedGoodsFactScreen.tsx
- index.ts
- PrototypeDocument
- flow.md
- TransportSummaryScreen.tsx
- AppShell.tsx
- recipes/paths.ts
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- vat/paths.ts
- planMonthOpen
- Отчет общий движения
- summary.ts
- FinishedGoodsMonthScreen.tsx
- finished-goods.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- ProductionJournalScreen.tsx
- vat-report.ts
- inputs/README.md
- tax-payment.ts
- parseOpexMonthQuery
- cashflow/paths.ts
- Отчет общий движения производных
- property-tax.ts
- credit-resources/paths.ts
- next
- Себестоимость готовой продукции
- entityNameRowClassName
- DerivativeFormTable.tsx
- monthKeyFromDate
- DerivativeCostTable.tsx
- derivatives.ts
- production-journal.ts
- operating-expense.ts
- sales-plan.ts
- opexHrefWithQuery
- derivative-cost.ts
- products.ts
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- Отчет подневный продаж
- mock-opex.ts
- SettingsScreen.tsx
- RecipeJournalsTable.tsx
- keepWithNext
- opex/paths.ts

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

## Communities (88 total, 7 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.08
Nodes (62): HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan, deleteHrPosition() (+54 more)

### Community 1 - "OpexGroupPlanScreen"
Cohesion: 0.36
Nodes (10): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), isOpexGroupCode(), operatingExpenseOtherGroupMonthView(), opexGroupName() (+2 more)

### Community 2 - "react"
Cohesion: 0.10
Nodes (51): react, HR_DEPARTMENT_LABELS, CreditResourcesPlanScreen(), inputKind(), COLUMN_GROUPS, COLUMN_KIND, columnEdge(), ColumnKey (+43 more)

### Community 3 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.08
Nodes (40): metadata, SalesFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), SalesPlanRejection, finishedGoodsFactPageTitle(), productionJournalFactHref(), DayDateControl() (+32 more)

### Community 4 - "IconChevronDown"
Cohesion: 0.15
Nodes (35): CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), VarianceSense, SectionBlock(), WorkshopBlock(), GroupBlock() (+27 more)

### Community 5 - "parseDecimal"
Cohesion: 0.13
Nodes (19): PropertyTaxRejection, formatRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), parsePropertyTaxMoney(), parseTaxPaymentMoney() (+11 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+35 more)

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
Cohesion: 0.07
Nodes (81): costExVat(), MaterialGroupId, MaterialReceiptLine, addMaterial(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity() (+73 more)

### Community 11 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (36): formatTaxRateLabel(), headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS (+28 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (64): derivativeWorkshopById(), warehouseIdForWorkshop(), activeMaterials(), applyHeatTreatmentYield(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), recipeComponentsKilogramThousandths(), MaterialDialog() (+56 more)

### Community 14 - "movement-plan.ts"
Cohesion: 0.11
Nodes (35): FinishedGoodsNormLine, closingInventoryDeviationPieces(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingDeviationPieces(), openingReferencedProductIds() (+27 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (50): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+42 more)

### Community 16 - "SaleScreen.tsx"
Cohesion: 0.08
Nodes (61): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), Sale, SaleLine (+53 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.13
Nodes (44): activeCreditors(), addCreditor(), addCreditorRejection(), creditDayAmounts(), CreditDayField, CreditFieldRejection, CreditMonthField, CreditMonthViewOptions (+36 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.09
Nodes (44): buildRow(), costForQuantity(), derivativeConsumptionDayRecord(), derivativeConsumptionDaysList(), DerivativeConsumptionRejection, DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics() (+36 more)

### Community 19 - "MaterialDocumentScreen.tsx"
Cohesion: 0.11
Nodes (24): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, fromRubles(), DocumentForm(), changeWarehouse() (+16 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.22
Nodes (20): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+12 more)

### Community 21 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.10
Nodes (27): Подсказки заголовков таблицы, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeMovementSummaryTable() (+19 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.12
Nodes (31): commitDocumentUpdate(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+23 more)

### Community 23 - "profit-tax.ts"
Cohesion: 0.27
Nodes (13): PROFIT_TAX_PERCENT, ProfitTaxRateChange, byMonth(), DEFAULT_PROFIT_TAX_HUNDREDTHS, isRateHundredths(), PROFIT_TAX_RATE_SCALE, profitTaxRateChanges(), profitTaxRateHundredths() (+5 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "materials/paths.ts"
Cohesion: 0.08
Nodes (34): MaterialsConsumptionPage(), metadata, MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata (+26 more)

### Community 26 - "access.ts"
Cohesion: 0.16
Nodes (15): Архитектура прототипа, Поток данных, Слои, Чего не делать, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection() (+7 more)

### Community 27 - "DerivativeConsumptionScreen.tsx"
Cohesion: 0.09
Nodes (28): DerivativeConsumptionPage(), metadata, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata (+20 more)

### Community 28 - "MaterialsPlanScreen.tsx"
Cohesion: 0.14
Nodes (16): MATERIAL_GROUPS, MaterialUnit, MaterialWeightPair, MaterialConsumptionRejection, MaterialDocumentRejection, MaterialMovementRow, MaterialMovementTotals, MaterialNormRejection (+8 more)

### Community 29 - "mock-document.ts"
Cohesion: 0.04
Nodes (51): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, boostTenPercent(), burger, caesar, CatalogProductId, catalogProductIds (+43 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.10
Nodes (42): Единицы, actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+34 more)

### Community 31 - "document.ts"
Cohesion: 0.07
Nodes (40): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+32 more)

### Community 32 - "recipes/cost/[id]/page.tsx"
Cohesion: 0.67
Nodes (3): RecipesCostDetailPage(), parseRecipesCostMonthQuery(), RECIPES_COST_HREF

### Community 33 - "DocumentProvider.tsx"
Cohesion: 0.21
Nodes (13): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+5 more)

### Community 34 - "hr.ts"
Cohesion: 0.06
Nodes (58): HR_DEPARTMENT_IDS, HrDayFact, HrDayStaffLine, HrDepartmentId, HrMonthFactStaffLine, HrMonthPlan, HrMonthPlanStaffLine, isHrShopDepartmentId() (+50 more)

### Community 35 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.10
Nodes (29): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), monthDates(), DayDateControl() (+21 more)

### Community 36 - "index.ts"
Cohesion: 0.07
Nodes (69): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+61 more)

### Community 37 - "PrototypeDocument"
Cohesion: 0.16
Nodes (22): Удаление, Product, PrototypeDocument, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+14 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "TransportSummaryScreen.tsx"
Cohesion: 0.16
Nodes (16): metadata, OpexTransportPage(), ReportSubBannerGroup, OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey (+8 more)

### Community 40 - "AppShell.tsx"
Cohesion: 0.14
Nodes (20): AppShell(), buildNavGroups(), currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, isInputNavKind(), MATERIALS_NAV, MOVEMENT_NAV, NavGroup() (+12 more)

### Community 41 - "recipes/paths.ts"
Cohesion: 0.12
Nodes (22): RecipesFinishedCostDetailPage(), FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), metadata, NewDerivativePage(), isDerivativeWorkshopId() (+14 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.11
Nodes (23): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+15 more)

### Community 45 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 46 - "planMonthOpen"
Cohesion: 0.07
Nodes (67): CashflowOpexGroupFactPage(), CashflowHrFactPage(), metadata, CashflowOtherFactPage(), metadata, CashflowTransportFactPage(), metadata, CreditResourcesFactPage() (+59 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.07
Nodes (58): UnitCost, monthInterestAmounts(), SalesPlan, productCostPerPiece(), unitPriceFromBatch(), averageAmount(), percentHundredths(), vatPercentHundredths() (+50 more)

### Community 49 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 50 - "finished-goods.ts"
Cohesion: 0.14
Nodes (39): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyPlanSide(), emptyRangeView() (+31 more)

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

### Community 57 - "ProductionJournalScreen.tsx"
Cohesion: 0.21
Nodes (14): metadata, ProductionJournalPage(), ProductionEntry, productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), productionEntryHref(), productionEntryNewHref() (+6 more)

### Community 58 - "vat-report.ts"
Cohesion: 0.31
Nodes (17): add(), DEDUCTIBLE_GROUP_ORDER, expenseDeductibleLines(), hireTransportVat(), line(), materialDeductibleLines(), outsourcingDeductibleLine(), ownFuelVat() (+9 more)

### Community 60 - "tax-payment.ts"
Cohesion: 0.26
Nodes (14): TaxPaymentKind, dayRecord(), isSignedMoney(), isTaxPaymentKind(), setTaxPaymentDay(), setTaxPaymentDayRejection(), TAX_PAYMENT_KINDS, TAX_PAYMENT_LABEL (+6 more)

### Community 61 - "parseOpexMonthQuery"
Cohesion: 0.12
Nodes (16): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherPlanPage(), metadata, OpexSummaryPage() (+8 more)

### Community 62 - "cashflow/paths.ts"
Cohesion: 0.15
Nodes (16): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE, CASHFLOW_PLAN_HREF, CASHFLOW_SECTION_TITLE (+8 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "property-tax.ts"
Cohesion: 0.42
Nodes (8): isMoney(), monthRecord(), propertyTaxForMonth(), propertyTaxMonthsList(), PropertyTaxMonthView, setPropertyTaxPlan(), setPropertyTaxPlanRejection(), usePropertyTax()

### Community 65 - "credit-resources/paths.ts"
Cohesion: 0.19
Nodes (12): CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_PLAN_HREF, CREDIT_RESOURCES_PLAN_TITLE, CREDIT_RESOURCES_SECTION_TITLE (+4 more)

### Community 66 - "next"
Cohesion: 0.09
Nodes (40): nextConfig, next, CashflowPlanPage(), metadata, metadata, RecipesCostPage(), metadata, RecipesFinishedCostPage() (+32 more)

### Community 68 - "entityNameRowClassName"
Cohesion: 0.06
Nodes (69): DerivativeMovementRow, DerivativeMovementSection, MaterialWarehouseMovement, ConsumptionLine, ConsumptionSection, DerivativeConsumptionTable(), DerivativeRow(), inputKind() (+61 more)

### Community 69 - "DerivativeFormTable.tsx"
Cohesion: 0.16
Nodes (11): Material, EntryFormRow, buildCandidateGroups(), CandidateGroup, CandidateRow, DerivativeComponentKind, RecipeComponentSearch(), SelectedGroup (+3 more)

### Community 70 - "monthKeyFromDate"
Cohesion: 0.08
Nodes (47): Home(), metadata, metadata, PlanPage(), metadata, ProductionPage(), activeCategories(), recommendedVolumePiecesForMonths() (+39 more)

### Community 71 - "DerivativeCostTable.tsx"
Cohesion: 0.12
Nodes (33): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell(), CostRow(), DerivativeCostTable() (+25 more)

### Community 72 - "derivatives.ts"
Cohesion: 0.08
Nodes (45): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection (+37 more)

### Community 73 - "production-journal.ts"
Cohesion: 0.07
Nodes (54): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionPlanPage() (+46 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (61): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection() (+53 more)

### Community 75 - "sales-plan.ts"
Cohesion: 0.16
Nodes (24): costWithVat(), amountExVat(), amountWithVat(), ratioRound(), factRow(), productSide(), productionPlanLineMetrics, activeSalesPlans() (+16 more)

### Community 76 - "opexHrefWithQuery"
Cohesion: 0.20
Nodes (10): OpexGroupFactRedirectPage(), OpexHrFactRedirectPage(), OpexOtherFactRedirectPage(), OpexTransportFactRedirectPage(), OPEX_HR_FACT_HREF, OPEX_OTHER_FACT_HREF, OPEX_TRANSPORT_FACT_HREF, opexGroupFactHrefPath() (+2 more)

### Community 77 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (43): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+35 more)

### Community 78 - "products.ts"
Cohesion: 0.07
Nodes (61): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+53 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.05
Nodes (49): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, isShopPositionId() (+41 more)

### Community 88 - "SettingsScreen.tsx"
Cohesion: 0.10
Nodes (28): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+20 more)

### Community 89 - "RecipeJournalsTable.tsx"
Cohesion: 0.22
Nodes (14): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+6 more)

### Community 92 - "keepWithNext"
Cohesion: 0.08
Nodes (69): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+61 more)

### Community 93 - "opex/paths.ts"
Cohesion: 0.13
Nodes (22): monthHref(), OPEX_GROUP_BASE_HREF, OPEX_GROUP_FACT_BASE_HREF, OPEX_HR_HREF, OPEX_HR_PLAN_HREF, OPEX_OTHER_FACT_NAV_LABEL, OPEX_OTHER_PLAN_HREF, OPEX_OTHER_TITLE (+14 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 556 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OpexGroupPlanScreen`, `react`, `ProductionJournalFactScreen.tsx`, `IconChevronDown`, `package.json`, `DerivativeCreateScreen.tsx`, `movement-plan.ts`, `SaleScreen.tsx`, `MaterialDocumentScreen.tsx`, `production-plan.ts`, `materials/paths.ts`, `access.ts`, `DerivativeConsumptionScreen.tsx`, `MaterialsPlanScreen.tsx`, `recipes/cost/[id]/page.tsx`, `FinishedGoodsFactScreen.tsx`, `TransportSummaryScreen.tsx`, `AppShell.tsx`, `recipes/paths.ts`, `RoleProvider.tsx`, `vat/paths.ts`, `planMonthOpen`, `FinishedGoodsMonthScreen.tsx`, `ProductionJournalScreen.tsx`, `parseOpexMonthQuery`, `cashflow/paths.ts`, `credit-resources/paths.ts`, `monthKeyFromDate`, `derivatives.ts`, `production-journal.ts`, `opexHrefWithQuery`, `products.ts`, `SettingsScreen.tsx`, `RecipeJournalsTable.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08283730158730158 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ProductionJournalFactScreen.tsx`, `IconChevronDown`, `package.json`, `SummaryTable.tsx`, `DerivativeCreateScreen.tsx`, `movement-plan.ts`, `MaterialReceiptFormTable.tsx`, `SaleScreen.tsx`, `MaterialDocumentScreen.tsx`, `DerivativeMovementSummaryTable.tsx`, `production-plan.ts`, `materials/paths.ts`, `access.ts`, `DerivativeConsumptionScreen.tsx`, `MaterialsPlanScreen.tsx`, `DocumentProvider.tsx`, `FinishedGoodsFactScreen.tsx`, `index.ts`, `TransportSummaryScreen.tsx`, `AppShell.tsx`, `RoleProvider.tsx`, `planMonthOpen`, `FinishedGoodsMonthScreen.tsx`, `ProductionJournalScreen.tsx`, `next`, `entityNameRowClassName`, `DerivativeFormTable.tsx`, `monthKeyFromDate`, `DerivativeCostTable.tsx`, `production-journal.ts`, `products.ts`, `SettingsScreen.tsx`, `RecipeJournalsTable.tsx`, `keepWithNext`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.1035007610350076 - nodes in this community are weakly interconnected._
- **Should `ProductionJournalFactScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07908163265306123 - nodes in this community are weakly interconnected._
- **Should `IconChevronDown` be split into smaller, more focused modules?**
  _Cohesion score 0.1484480431848853 - nodes in this community are weakly interconnected._