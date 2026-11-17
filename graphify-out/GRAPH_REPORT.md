# Graph Report - food-proto  (2026-11-17)

## Corpus Check
- 297 files · ~176,667 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2797 nodes · 11103 edges · 89 communities (86 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5db7800e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- next
- index.ts
- ProductionJournalFactScreen.tsx
- entityNameRowClassName
- Cells.tsx
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- materials.ts
- SummaryTable.tsx
- compilerOptions
- DerivativeCreateScreen.tsx
- ProductionFactTable.tsx
- MaterialReceiptFormTable.tsx
- SaleScreen.tsx
- credit-resources.ts
- derivative-movement.ts
- MaterialDocumentScreen.tsx
- cashflow.ts
- README.md
- production-plan.ts
- PropertyTaxScreen.tsx
- Флоу товара
- resolveMaterialMonth
- access.ts
- PageFrame
- MaterialsPlanScreen.tsx
- mock-document.ts
- production-fact.ts
- document.ts
- recipes/paths.ts
- DocumentProvider.tsx
- hr.ts
- MovementPlanScreen.tsx
- SalesFactTable.tsx
- AppShell
- flow.md
- Операционные расходы
- AppShell.tsx
- useDocumentStore
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- vat/paths.ts
- monthKeyFromDate
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
- credit-resources/fact/page.tsx
- vat-report.ts
- inputs/README.md
- tax-payment.ts
- OpexGroupPlanScreen
- CashflowFactScreen.tsx
- Отчет общий движения производных
- property-tax.ts
- finished-product-cost.ts
- FinishedProductCostScreen.tsx
- Себестоимость готовой продукции
- MaterialsPlanTable.tsx
- DerivativeEditScreen
- SummaryScreen.tsx
- ColumnLabel
- isQuantityThousandths
- production-journal.ts
- operating-expense.ts
- sales-plan.ts
- derivatives.ts
- products.ts
- SummaryHeadlineTable.tsx
- use-materials.ts
- SalesJournalScreen.tsx
- mock-opex.ts
- SettingsScreen.tsx
- RecipePrint.tsx
- sales.ts
- FinishedGoodsMonthTable.tsx
- opex/paths.ts
- realConsumptionQuantityForMaterialDay
- sales-fact/paths.ts

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

## Communities (89 total, 3 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.07
Nodes (71): HireSeed, HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine (+63 more)

### Community 1 - "next"
Cohesion: 0.12
Nodes (17): nextConfig, next, CashflowOpexGroupFactPage(), CashflowHrFactPage(), metadata, CashflowOtherFactPage(), metadata, MaterialsNormsPage() (+9 more)

### Community 2 - "index.ts"
Cohesion: 0.12
Nodes (52): react, HR_DEPARTMENT_LABELS, CreditResourcesPlanScreen(), inputKind(), ConsumptionLine, ConsumptionSection, ConsumptionLine, ConsumptionSection (+44 more)

### Community 3 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.08
Nodes (51): defaultProductionJournalFactDay(), salesFactGridProducts(), shiftMonth(), lastHorizonMonth(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle() (+43 more)

### Community 4 - "entityNameRowClassName"
Cohesion: 0.13
Nodes (43): CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), VarianceSense, DerivativeRow(), inputKind(), SectionBlock() (+35 more)

### Community 5 - "Cells.tsx"
Cohesion: 0.13
Nodes (24): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), parseDecimal(), roundKopecksToRubles(), parsePropertyTaxMoney(), CREDIT_ERROR (+16 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (31): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение денежных средств (+23 more)

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
Cohesion: 0.08
Nodes (50): costExVat(), MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), calculatedConsumptionQuantityForMaterialDay(), closingMaterialQuantity() (+42 more)

### Community 11 - "SummaryTable.tsx"
Cohesion: 0.14
Nodes (22): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+14 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (56): productByIdOrNull(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), lineAmountWithVat(), quantityForAmount(), rowMetrics(), commit(), formatQuantity() (+48 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (47): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+39 more)

### Community 16 - "SaleScreen.tsx"
Cohesion: 0.23
Nodes (21): saleLineAmountWithVat(), saleLinePriceWithVat(), emptySaleLineDraft(), rowMetrics(), SaleLineDraft, SaleLineField, initialDrafts(), lineDraftFromSale() (+13 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.07
Nodes (68): CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, activeCreditors(), addCreditor(), addCreditorRejection(), creditDayAmounts() (+60 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.09
Nodes (46): DerivativeMovementPlanPage(), metadata, buildRow(), costForQuantity(), derivativeConsumptionDayRecord(), derivativeConsumptionDaysList(), DerivativeConsumptionRejection, derivativeMovementMonth() (+38 more)

### Community 19 - "MaterialDocumentScreen.tsx"
Cohesion: 0.10
Nodes (28): metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), MaterialConsumptionRejection, MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection (+20 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.24
Nodes (19): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+11 more)

### Community 21 - "README.md"
Cohesion: 0.18
Nodes (8): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Как собрать первый прототип, Порядок, Формула, Запуск, Куда смотреть

### Community 22 - "production-plan.ts"
Cohesion: 0.12
Nodes (28): commitDocumentUpdate(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+20 more)

### Community 23 - "PropertyTaxScreen.tsx"
Cohesion: 0.16
Nodes (20): PROFIT_TAX_PERCENT, ProfitTaxRateChange, byMonth(), DEFAULT_PROFIT_TAX_HUNDREDTHS, isRateHundredths(), PROFIT_TAX_RATE_SCALE, profitTaxRateChanges(), profitTaxRateHundredths() (+12 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "resolveMaterialMonth"
Cohesion: 0.10
Nodes (33): MaterialsConsumptionPage(), metadata, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialReceiptPage(), metadata (+25 more)

### Community 26 - "access.ts"
Cohesion: 0.15
Nodes (16): RecipesFinishedCostDetailPage(), DERIVATIVE_MOVEMENT_CONSUMPTION_HREF, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, parseRecipesFinishedCostMonthQuery(), RECIPES_FINISHED_COST_HREF, HOME_SECTION_ORDER (+8 more)

### Community 27 - "PageFrame"
Cohesion: 0.12
Nodes (26): DerivativeConsumptionPage(), metadata, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeConsumptionScreen(), open() (+18 more)

### Community 28 - "MaterialsPlanScreen.tsx"
Cohesion: 0.13
Nodes (16): MaterialsPlanPage(), metadata, Material, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialUnit, MaterialWarehouseId, MaterialWeightPair (+8 more)

### Community 29 - "mock-document.ts"
Cohesion: 0.04
Nodes (45): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, boostTenPercent(), burger, caesar, CatalogProductId, catalogProductIds (+37 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.09
Nodes (46): Удаление, Product, dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens() (+38 more)

### Community 31 - "document.ts"
Cohesion: 0.05
Nodes (49): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+41 more)

### Community 32 - "recipes/paths.ts"
Cohesion: 0.14
Nodes (19): RecipesCostDetailPage(), metadata, RecipesCostPage(), FinishedProductRecipePage(), metadata, metadata, NewDerivativePage(), derivativeCostMonth() (+11 more)

### Community 33 - "DocumentProvider.tsx"
Cohesion: 0.23
Nodes (14): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+6 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (56): isShopPositionId(), HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrDayFact, HrDayStaffLine, HrDepartmentId, HrMonthFactStaffLine, HrPosition (+48 more)

### Community 35 - "MovementPlanScreen.tsx"
Cohesion: 0.10
Nodes (27): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FinishedGoodsFactScreen(), FullscreenToggle() (+19 more)

### Community 36 - "SalesFactTable.tsx"
Cohesion: 0.07
Nodes (74): Подсказки заголовков таблицы, adjacentDay(), TotalCell(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+66 more)

### Community 37 - "AppShell"
Cohesion: 0.15
Nodes (10): Архитектура прототипа, Поток данных, Слои, Чего не делать, metadata, onest, RootLayout(), unbounded (+2 more)

### Community 38 - "flow.md"
Cohesion: 0.18
Nodes (11): Инвентаризация, Колонки, Что пишется, Отчет подневный движения, Чем день отличается от свода, Колонки строки товара, Отчет подневный производства, Группы (+3 more)

### Community 39 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 40 - "AppShell.tsx"
Cohesion: 0.09
Nodes (34): CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_PLAN_HREF, CASHFLOW_PLAN_TITLE, CASHFLOW_SECTION_TITLE (+26 more)

### Community 41 - "useDocumentStore"
Cohesion: 0.12
Nodes (26): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), useDocumentStore(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes() (+18 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.16
Nodes (18): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT, ALL_NAV_SECTIONS (+10 more)

### Community 45 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 46 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (61): CashflowTransportFactPage(), metadata, isOccurredOn(), applyDayFactToGroup(), operatingExpenseOtherDayView(), operatingExpenseOtherGroupDayView(), maxProductionEntryOccurredOn(), defaultSaleDay() (+53 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.07
Nodes (64): costWithVat(), UnitCost, monthInterestAmounts(), SalesPlan, productCostPerPiece(), amountWithVat(), averageAmount(), percentHundredths() (+56 more)

### Community 49 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 50 - "finished-goods.ts"
Cohesion: 0.07
Nodes (78): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+70 more)

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

### Community 57 - "credit-resources/fact/page.tsx"
Cohesion: 0.50
Nodes (4): CreditResourcesFactPage(), metadata, CREDIT_RESOURCES_FACT_TITLE, parseCreditDayQuery()

### Community 58 - "vat-report.ts"
Cohesion: 0.31
Nodes (17): add(), DEDUCTIBLE_GROUP_ORDER, expenseDeductibleLines(), hireTransportVat(), line(), materialDeductibleLines(), outsourcingDeductibleLine(), ownFuelVat() (+9 more)

### Community 60 - "tax-payment.ts"
Cohesion: 0.26
Nodes (14): TaxPaymentKind, dayRecord(), isSignedMoney(), isTaxPaymentKind(), setTaxPaymentDay(), setTaxPaymentDayRejection(), TAX_PAYMENT_KINDS, TAX_PAYMENT_LABEL (+6 more)

### Community 61 - "OpexGroupPlanScreen"
Cohesion: 0.12
Nodes (23): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexHrPage(), metadata (+15 more)

### Community 62 - "CashflowFactScreen.tsx"
Cohesion: 0.26
Nodes (12): CashflowFactPage(), metadata, taxPaymentForDay(), CashflowFactScreen(), open(), inputKind(), PaymentRow(), resolveDay() (+4 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "property-tax.ts"
Cohesion: 0.42
Nodes (8): isMoney(), monthRecord(), propertyTaxMonthsList(), PropertyTaxMonthView, PropertyTaxRejection, setPropertyTaxPlan(), setPropertyTaxPlanRejection(), usePropertyTax()

### Community 65 - "finished-product-cost.ts"
Cohesion: 0.16
Nodes (22): Свод, Свод, componentUnitPriceInternal(), derivativeConsumptionPrice(), buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail (+14 more)

### Community 66 - "FinishedProductCostScreen.tsx"
Cohesion: 0.43
Nodes (6): metadata, RecipesFinishedCostPage(), finishedProductCostMonth(), FinishedProductCostScreen(), RECIPES_FINISHED_COST_TITLE, recipesFinishedCostHref()

### Community 68 - "MaterialsPlanTable.tsx"
Cohesion: 0.04
Nodes (77): DerivativeMovementRow, DerivativeMovementSection, COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), DerivativeRow(), RowCell() (+69 more)

### Community 69 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

### Community 70 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (32): Единицы, Home(), metadata, activeCategories(), actualRangeSummary(), calendarDays(), ensureRangeIncludesMonth(), monthsInRange() (+24 more)

### Community 71 - "ColumnLabel"
Cohesion: 0.09
Nodes (40): DerivativeConsumptionTable(), DerivativeMovementInventoryTable(), MaterialsConsumptionTable(), HrPlanScreen(), ProductionPlanTable(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass() (+32 more)

### Community 72 - "isQuantityThousandths"
Cohesion: 0.19
Nodes (15): ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS (+7 more)

### Community 73 - "production-journal.ts"
Cohesion: 0.05
Nodes (70): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+62 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (59): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection() (+51 more)

### Community 75 - "sales-plan.ts"
Cohesion: 0.10
Nodes (34): metadata, PlanningPage(), SalesPlanLine, activeProducts(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines() (+26 more)

### Community 77 - "derivatives.ts"
Cohesion: 0.09
Nodes (42): buildCostRow(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeCostDetail, DerivativeCostLineContribution (+34 more)

### Community 78 - "products.ts"
Cohesion: 0.11
Nodes (41): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+33 more)

### Community 80 - "SummaryHeadlineTable.tsx"
Cohesion: 0.28
Nodes (12): formatTaxRateLabel(), headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS (+4 more)

### Community 81 - "use-materials.ts"
Cohesion: 0.18
Nodes (28): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+20 more)

### Community 82 - "SalesJournalScreen.tsx"
Cohesion: 0.21
Nodes (15): metadata, SalesJournalPage(), Sale, saleTotals, workingSales(), workingSalesInMonth(), parseSalesJournalQuery(), saleHref() (+7 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (45): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), MOCK_MONTHS, MOCK_VEHICLE_IDS (+37 more)

### Community 88 - "SettingsScreen.tsx"
Cohesion: 0.08
Nodes (30): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+22 more)

### Community 89 - "RecipePrint.tsx"
Cohesion: 0.14
Nodes (20): MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent (+12 more)

### Community 91 - "sales.ts"
Cohesion: 0.31
Nodes (15): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), PLAN_HORIZON_MONTHS (+7 more)

### Community 92 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.08
Nodes (49): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_GROUPS (+41 more)

### Community 93 - "opex/paths.ts"
Cohesion: 0.06
Nodes (44): OpexGroupFactRedirectPage(), OpexHrFactRedirectPage(), OpexOtherFactRedirectPage(), metadata, OpexSummaryPage(), OpexTransportFactRedirectPage(), metadata, OpexTransportPage() (+36 more)

### Community 96 - "realConsumptionQuantityForMaterialDay"
Cohesion: 1.00
Nodes (3): realConsumptionQuantityForMaterialDay(), buildSections(), dayGridMaterials()

### Community 97 - "sales-fact/paths.ts"
Cohesion: 0.16
Nodes (13): metadata, SalePage(), metadata, NewSalePage(), metadata, SalesFactPage(), NEW_SALE_TITLE, parseSalesFactQuery() (+5 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 556 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `index.ts`, `ProductionJournalFactScreen.tsx`, `entityNameRowClassName`, `package.json`, `DerivativeCreateScreen.tsx`, `SaleScreen.tsx`, `credit-resources.ts`, `derivative-movement.ts`, `MaterialDocumentScreen.tsx`, `PropertyTaxScreen.tsx`, `resolveMaterialMonth`, `access.ts`, `PageFrame`, `MaterialsPlanScreen.tsx`, `recipes/paths.ts`, `MovementPlanScreen.tsx`, `AppShell`, `AppShell.tsx`, `useDocumentStore`, `vat/paths.ts`, `monthKeyFromDate`, `FinishedGoodsMonthScreen.tsx`, `credit-resources/fact/page.tsx`, `OpexGroupPlanScreen`, `CashflowFactScreen.tsx`, `FinishedProductCostScreen.tsx`, `MaterialsPlanTable.tsx`, `DerivativeEditScreen`, `SummaryScreen.tsx`, `production-journal.ts`, `sales-plan.ts`, `products.ts`, `SalesJournalScreen.tsx`, `SettingsScreen.tsx`, `RecipePrint.tsx`, `opex/paths.ts`, `sales-fact/paths.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07039573820395738 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `next`, `ProductionJournalFactScreen.tsx`, `entityNameRowClassName`, `Cells.tsx`, `package.json`, `SummaryTable.tsx`, `DerivativeCreateScreen.tsx`, `ProductionFactTable.tsx`, `MaterialReceiptFormTable.tsx`, `SaleScreen.tsx`, `credit-resources.ts`, `derivative-movement.ts`, `MaterialDocumentScreen.tsx`, `PropertyTaxScreen.tsx`, `resolveMaterialMonth`, `access.ts`, `PageFrame`, `MaterialsPlanScreen.tsx`, `recipes/paths.ts`, `DocumentProvider.tsx`, `MovementPlanScreen.tsx`, `SalesFactTable.tsx`, `AppShell.tsx`, `RoleProvider.tsx`, `monthKeyFromDate`, `FinishedGoodsMonthScreen.tsx`, `CashflowFactScreen.tsx`, `FinishedProductCostScreen.tsx`, `MaterialsPlanTable.tsx`, `SummaryScreen.tsx`, `ColumnLabel`, `production-journal.ts`, `sales-plan.ts`, `products.ts`, `SalesJournalScreen.tsx`, `SettingsScreen.tsx`, `RecipePrint.tsx`, `FinishedGoodsMonthTable.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._
- **Why does `Предметная область` connect `Предметная область` to `README.md`, `Операционные расходы`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11554690035702694 - nodes in this community are weakly interconnected._