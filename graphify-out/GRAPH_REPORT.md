# Graph Report - food-proto  (2026-11-10)

## Corpus Check
- 274 files · ~160,372 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2531 nodes · 9926 edges · 81 communities (74 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45ce6eb0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- transport.ts
- SaleScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- FinishedGoodsMonthTable.tsx
- sales-plan.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- PageFrame
- document.ts
- credit-resources.ts
- MaterialsPlanScreen.tsx
- mock-materials.ts
- sales-fact/paths.ts
- materialMovementMonth
- SummaryTable.tsx
- useDocumentStore
- entityNameRowClassName
- Флоу товара
- keepWithNext
- FinishedGoodsMonthScreen.tsx
- MaterialDocumentScreen.tsx
- RecipeJournalsTable.tsx
- credit-resources/paths.ts
- production-fact.ts
- sales/text.ts
- cashflow/paths.ts
- Icons.tsx
- SalesJournalScreen.tsx
- MaterialReceiptFormTable.tsx
- index.ts
- AppShell.tsx
- flow.md
- next
- PlanRedirect.tsx
- RecipePrint.tsx
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- monthKeyFromDate
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- sales.ts
- DocumentProvider.tsx
- inputs/README.md
- useRole
- vat/paths.ts
- IconPlus
- Отчет общий движения производных
- MaterialJournalScreen.tsx
- PlanningScreen.tsx
- MaterialsNormsScreen
- Себестоимость готовой продукции
- TransportFactScreen
- vat-report.ts
- ProductionEntryScreen.tsx
- operating-expense.ts
- finished-product-cost.ts
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- Отчет подневный продаж
- materials/paths.ts
- mock-opex.ts
- SummaryHeadlineTable.tsx
- MaterialsSummaryTable.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 116 edges
2. `next` - 108 edges
3. `PageFrame()` - 105 edges
4. `react` - 82 edges
5. `useOpex()` - 77 edges
6. `entityNameRowClassName()` - 74 edges
7. `ColumnLabel()` - 72 edges
8. `useRole()` - 67 edges
9. `keepWithNext()` - 65 edges
10. `IconChevronDown()` - 63 edges

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

## Communities (81 total, 7 thin omitted)

### Community 0 - "transport.ts"
Cohesion: 0.11
Nodes (30): HireSeed, isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportCarrier, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan (+22 more)

### Community 1 - "SaleScreen.tsx"
Cohesion: 0.19
Nodes (24): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), SaleRejection, emptySaleLineDraft(), rowMetrics(), SaleLineDraft, SaleLineField (+16 more)

### Community 2 - "products.ts"
Cohesion: 0.15
Nodes (29): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+21 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.10
Nodes (41): buildRow(), costForQuantity(), DerivativeMovementMonthView, derivativeNormMetrics(), derivativeNormsList(), derivativeOpeningsList(), factConsumptionQuantityForDerivative(), factProductionVolumePiecesForProduct() (+33 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (38): mockCreditors, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember (+30 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.21
Nodes (18): buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeConsumptionPrice() (+10 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+35 more)

### Community 7 - "materials.ts"
Cohesion: 0.12
Nodes (44): MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine(), isMaterialGroupId() (+36 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (44): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+36 more)

### Community 11 - "sales-plan.ts"
Cohesion: 0.22
Nodes (19): activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan(), isPrice() (+11 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.08
Nodes (62): DerivativePage(), metadata, DERIVATIVE_WORKSHOPS, activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), lineAmountWithVat(), quantityForAmount() (+54 more)

### Community 14 - "PageFrame"
Cohesion: 0.10
Nodes (46): activeCategories(), shiftMonth(), ensureRangeIncludesMonth(), lastHorizonMonth(), monthsInRange(), normalizeMonthRange(), FullscreenToggle(), FullscreenToggle() (+38 more)

### Community 15 - "document.ts"
Cohesion: 0.07
Nodes (31): Creditor, CreditResourceMonthLine, DeletableRecord, DERIVATIVE_UNITS, DerivativeNorm, DerivativeNormLine, DerivativeOpening, DerivativeOpeningLine (+23 more)

### Community 16 - "credit-resources.ts"
Cohesion: 0.10
Nodes (53): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+45 more)

### Community 17 - "MaterialsPlanScreen.tsx"
Cohesion: 0.10
Nodes (22): MATERIAL_GROUPS, MATERIAL_UNITS, MATERIAL_WAREHOUSES, MaterialGroupId, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialGroupMovement (+14 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "sales-fact/paths.ts"
Cohesion: 0.16
Nodes (14): metadata, SalePage(), metadata, NewSalePage(), metadata, SalesFactPage(), defaultSaleDay(), NEW_SALE_TITLE (+6 more)

### Community 20 - "materialMovementMonth"
Cohesion: 0.14
Nodes (25): Свод, Свод, costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity() (+17 more)

### Community 21 - "SummaryTable.tsx"
Cohesion: 0.15
Nodes (24): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+16 more)

### Community 22 - "useDocumentStore"
Cohesion: 0.12
Nodes (32): commitDocumentUpdate(), useDocumentStore(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+24 more)

### Community 23 - "entityNameRowClassName"
Cohesion: 0.07
Nodes (69): toggle(), LineRows(), WorkshopBlock(), DerivativeRow(), WorkshopBlock(), GroupBlock(), groupEndClass(), MaterialRow() (+61 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.14
Nodes (38): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+30 more)

### Community 26 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.11
Nodes (27): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+19 more)

### Community 27 - "MaterialDocumentScreen.tsx"
Cohesion: 0.15
Nodes (21): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), occurredOnOpen() (+13 more)

### Community 28 - "RecipeJournalsTable.tsx"
Cohesion: 0.13
Nodes (23): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE, RecipeJournalsScreen() (+15 more)

### Community 29 - "credit-resources/paths.ts"
Cohesion: 0.12
Nodes (21): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, columnEdge(), CreditResourcesSummaryScreen() (+13 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.14
Nodes (30): periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts() (+22 more)

### Community 31 - "sales/text.ts"
Cohesion: 0.13
Nodes (20): SalesPlanRejection, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), parseCreditMoney() (+12 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.29
Nodes (8): CashflowSummaryPage(), metadata, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF, CASHFLOW_SUMMARY_TITLE, cashflowSummaryHref(), monthHref(), parseCashflowMonthQuery()

### Community 33 - "Icons.tsx"
Cohesion: 0.12
Nodes (52): react, HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, CashflowSummaryScreen(), defaultOpenIds(), CreditResourcesFactScreen(), inputKind() (+44 more)

### Community 34 - "SalesJournalScreen.tsx"
Cohesion: 0.21
Nodes (15): metadata, SalesJournalPage(), Sale, saleTotals, workingSalesInMonth(), parseSalesJournalQuery(), saleHref(), saleNewHref() (+7 more)

### Community 35 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (48): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+40 more)

### Community 36 - "index.ts"
Cohesion: 0.08
Nodes (56): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+48 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.09
Nodes (33): Архитектура прототипа, Поток данных, Слои, Чего не делать, MATERIALS_SECTION_TITLE, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, pathnameSection() (+25 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "next"
Cohesion: 0.07
Nodes (42): nextConfig, next, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata (+34 more)

### Community 40 - "PlanRedirect.tsx"
Cohesion: 0.28
Nodes (9): Home(), metadata, metadata, PlanPage(), SummaryLens, parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref() (+1 more)

### Community 41 - "RecipePrint.tsx"
Cohesion: 0.13
Nodes (36): activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection, derivativeReferencedInRecipes() (+28 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.07
Nodes (36): metadata, onest, RootLayout(), unbounded, metadata, SettingsPage(), readRole(), ROLE_STORAGE_KEY (+28 more)

### Community 45 - "hr.ts"
Cohesion: 0.06
Nodes (62): isShopPositionId(), HR_DEPARTMENT_IDS, HrDayFact, HrMonthFactStaffLine, HrMonthPlan, HrMonthPlanOutsourcingLine, HrMonthPlanStaffLine, HrPosition (+54 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.07
Nodes (76): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+68 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.06
Nodes (80): Единицы, Удаление, costWithVat(), UnitCost, monthInterestAmounts(), Product, productCostPerPiece(), amountWithVat() (+72 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.11
Nodes (25): RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, RecipesFinishedCostPage(), metadata, NewDerivativePage(), metadata (+17 more)

### Community 50 - "monthKeyFromDate"
Cohesion: 0.07
Nodes (63): isOccurredOn(), recommendedDayKey(), operatingExpenseOtherGroupDayView(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), maxProductionEntryOccurredOn(), defaultSalesFactDay(), monthDates() (+55 more)

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

### Community 57 - "sales.ts"
Cohesion: 0.31
Nodes (15): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), PLAN_HORIZON_MONTHS (+7 more)

### Community 58 - "DocumentProvider.tsx"
Cohesion: 0.14
Nodes (19): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+11 more)

### Community 60 - "useRole"
Cohesion: 0.06
Nodes (62): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexHrPage(), metadata (+54 more)

### Community 61 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 62 - "IconPlus"
Cohesion: 0.29
Nodes (11): AddPositionDialog(), AddLineDialog(), AddOtherLineDialog(), AddNamedDialog(), AddCategoryDialog(), submit(), AddProductDialog(), submit() (+3 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "MaterialJournalScreen.tsx"
Cohesion: 0.39
Nodes (7): MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref(), formatProductionEntryDate()

### Community 65 - "PlanningScreen.tsx"
Cohesion: 0.18
Nodes (18): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+10 more)

### Community 66 - "MaterialsNormsScreen"
Cohesion: 0.40
Nodes (5): MaterialsNormsPage(), metadata, materialNormQuantity(), MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 68 - "TransportFactScreen"
Cohesion: 0.17
Nodes (14): OpexGroupFactPage(), metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), OPEX_HR_FACT_TITLE (+6 more)

### Community 69 - "vat-report.ts"
Cohesion: 0.46
Nodes (7): line(), side(), sumChildren(), VatMoneySide, vatOf(), VatReportLine, vatReportMonthView

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (70): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+62 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (79): isDeletionMark(), OpexGroupCode, deleteHrPosition(), activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT, agencyPlanExVat() (+71 more)

### Community 75 - "finished-product-cost.ts"
Cohesion: 0.13
Nodes (22): FinishedProductRecipePage(), metadata, ProductRecipeLine, buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution (+14 more)

### Community 81 - "materials/paths.ts"
Cohesion: 0.13
Nodes (21): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialWarehouseId, MaterialWarehouseMovement (+13 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (44): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), MOCK_MONTHS, MOCK_VEHICLE_IDS (+36 more)

### Community 86 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 88 - "MaterialsSummaryTable.tsx"
Cohesion: 0.05
Nodes (71): Подсказки заголовков таблицы, DerivativeMovementRow, DerivativeMovementSection, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable() (+63 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 532 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `SaleScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `PageFrame`, `MaterialsPlanScreen.tsx`, `sales-fact/paths.ts`, `useDocumentStore`, `FinishedGoodsMonthScreen.tsx`, `MaterialDocumentScreen.tsx`, `RecipeJournalsTable.tsx`, `credit-resources/paths.ts`, `cashflow/paths.ts`, `Icons.tsx`, `SalesJournalScreen.tsx`, `AppShell.tsx`, `PlanRedirect.tsx`, `RecipePrint.tsx`, `RoleProvider.tsx`, `recipes/paths.ts`, `monthKeyFromDate`, `useRole`, `vat/paths.ts`, `MaterialJournalScreen.tsx`, `PlanningScreen.tsx`, `MaterialsNormsScreen`, `TransportFactScreen`, `ProductionEntryScreen.tsx`, `finished-product-cost.ts`, `materials/paths.ts`, `MaterialsSummaryTable.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `transport.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10752688172043011 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `SaleScreen.tsx`, `sales-plan.ts`, `PageFrame`, `MaterialsPlanScreen.tsx`, `sales-fact/paths.ts`, `useDocumentStore`, `entityNameRowClassName`, `FinishedGoodsMonthScreen.tsx`, `MaterialDocumentScreen.tsx`, `credit-resources/paths.ts`, `production-fact.ts`, `Icons.tsx`, `SalesJournalScreen.tsx`, `next`, `PlanRedirect.tsx`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `recipes/paths.ts`, `sales.ts`, `useRole`, `MaterialJournalScreen.tsx`, `PlanningScreen.tsx`, `TransportFactScreen`, `ProductionEntryScreen.tsx`, `materials/paths.ts`, `MaterialsSummaryTable.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14772727272727273 - nodes in this community are weakly interconnected._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10202020202020202 - nodes in this community are weakly interconnected._
- **Should `mock-document.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04734299516908213 - nodes in this community are weakly interconnected._