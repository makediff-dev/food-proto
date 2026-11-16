# Graph Report - food-proto  (2026-11-16)

## Corpus Check
- 289 files · ~168,934 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2685 nodes · 10534 edges · 96 communities (89 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a5c03df`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- SummaryTable.tsx
- ProductionPlanScreen.tsx
- sales-fact.ts
- mock-document.ts
- FinishedGoodsMonthTable.tsx
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- materialMovementMonth
- finished-goods.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- keepWithNext
- MaterialReceiptFormTable.tsx
- opex/paths.ts
- credit-resources.ts
- derivative-movement.ts
- MaterialsPlanScreen.tsx
- cashflow.ts
- production-journal.ts
- production-plan.ts
- OpexSummaryScreen.tsx
- Флоу товара
- MaterialJournalScreen.tsx
- FinishedGoodsMonthScreen.tsx
- movement-plan.ts
- next
- recipe-yield.ts
- production-fact.ts
- document.ts
- recipes/paths.ts
- DocumentProvider.tsx
- hr.ts
- monthKeyFromDate
- index.ts
- AppShell.tsx
- flow.md
- resolveMaterialMonth
- cashflow/paths.ts
- derivatives.ts
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- vat/paths.ts
- isOccurredOn
- Отчет общий движения
- summary.ts
- DerivativeMovementPlanScreen.tsx
- PlanningScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- credit-resources/paths.ts
- DerivativeFormTable.tsx
- inputs/README.md
- MaterialsSummaryTable.tsx
- opexHrefWithQuery
- entityNameRowClassName
- Отчет общий движения производных
- sales-plan.ts
- derivative-cost.ts
- MaterialDocumentScreen.tsx
- Себестоимость готовой продукции
- IconChevronDown
- Отчет подневный движения
- Icons.tsx
- DerivativeCostTable.tsx
- document-file.ts
- ProductionEntryScreen.tsx
- operating-expense.ts
- useRole
- RecipeJournalsTable.tsx
- materials.ts
- products.ts
- Отчет подневный производства
- CashflowFactScreen.tsx
- SaleScreen.tsx
- SalesJournalScreen.tsx
- HrFactScreen.tsx
- mock-opex.ts
- SummaryScreen.tsx
- Отчет общий производства
- Отчет подневный продаж
- SettingsScreen.tsx
- Архитектура прототипа
- ProductionEntryFormTable.tsx
- opex/text.ts
- CreditResourcesSummaryScreen.tsx
- ProductionEntryScreen
- FinishedGoodsFactTable
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

## Communities (96 total, 7 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.07
Nodes (78): HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan, activeHrPositions() (+70 more)

### Community 1 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (34): SalesPlanRejection, SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock(), editableFieldNear() (+26 more)

### Community 2 - "ProductionPlanScreen.tsx"
Cohesion: 0.09
Nodes (32): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+24 more)

### Community 3 - "sales-fact.ts"
Cohesion: 0.10
Nodes (40): Удаление, UnitCost, Product, PrototypeDocument, productCostPerPiece(), amountExVat(), amountWithVat(), averageAmount() (+32 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.04
Nodes (45): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+37 more)

### Community 5 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.11
Nodes (38): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+30 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (31): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение денежных средств (+23 more)

### Community 7 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "materialMovementMonth"
Cohesion: 0.16
Nodes (21): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+13 more)

### Community 11 - "finished-goods.ts"
Cohesion: 0.13
Nodes (42): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+34 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (62): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), recipeComponentsKilogramThousandths(), MaterialDialog(), commit(), formatQuantity(), formatQuantityDraft() (+54 more)

### Community 14 - "keepWithNext"
Cohesion: 0.12
Nodes (42): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+34 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.12
Nodes (27): Material, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormRow, EntryFormTotals (+19 more)

### Community 16 - "opex/paths.ts"
Cohesion: 0.07
Nodes (43): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherPlanPage(), metadata, OpexTransportPage() (+35 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.13
Nodes (44): activeCreditors(), addCreditor(), addCreditorRejection(), creditDayAmounts(), CreditDayField, CreditFieldRejection, CreditMonthField, CreditMonthViewOptions (+36 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.10
Nodes (37): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+29 more)

### Community 19 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (23): MaterialsNormsPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MATERIAL_WAREHOUSES, MaterialUnit, MaterialWeightPair, NORMED_MATERIAL_GROUP_ID (+15 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.08
Nodes (58): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+50 more)

### Community 21 - "production-journal.ts"
Cohesion: 0.32
Nodes (14): ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection() (+6 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+16 more)

### Community 23 - "OpexSummaryScreen.tsx"
Cohesion: 0.19
Nodes (13): metadata, OpexSummaryPage(), COLUMN_GROUPS, columnEdgeClass(), ColumnKey, COLUMNS, GROUP_END_KEYS, GroupBlock() (+5 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialJournalScreen.tsx"
Cohesion: 0.11
Nodes (28): MaterialsInventoryPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata, MaterialWarehouseId, materialReceiptsInMonth() (+20 more)

### Community 26 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.14
Nodes (22): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth() (+14 more)

### Community 27 - "movement-plan.ts"
Cohesion: 0.13
Nodes (32): commitDocumentUpdate(), FinishedGoodsNormLine, FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+24 more)

### Community 28 - "next"
Cohesion: 0.14
Nodes (20): nextConfig, next, MaterialsPage(), metadata, metadata, RecipesCostPage(), metadata, RecipesFinishedCostPage() (+12 more)

### Community 29 - "recipe-yield.ts"
Cohesion: 0.18
Nodes (15): ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths() (+7 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.16
Nodes (30): periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows() (+22 more)

### Community 31 - "document.ts"
Cohesion: 0.06
Nodes (41): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+33 more)

### Community 32 - "recipes/paths.ts"
Cohesion: 0.09
Nodes (33): RecipesCostDetailPage(), RecipesFinishedCostDetailPage(), metadata, RecipeFinishedPage(), metadata, NewDerivativePage(), metadata, RecipeDerivativesPage() (+25 more)

### Community 33 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (12): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+4 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (50): isShopPositionId(), HR_DEPARTMENT_IDS, HrDayStaffLine, HrMonthFact, HrMonthFactStaffLine, HrMonthPlan, isHrShopDepartmentId(), averageSalary() (+42 more)

### Community 35 - "monthKeyFromDate"
Cohesion: 0.12
Nodes (29): metadata, MovementPlanPage(), activeCategories(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), DerivativeMovementInventoryScreen() (+21 more)

### Community 36 - "index.ts"
Cohesion: 0.08
Nodes (70): react, adjacentDay(), defaultOpenIds(), VarianceSense, COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND (+62 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.08
Nodes (38): Поток данных, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, MOVEMENT_SECTION_TITLE, OPEX_OTHER_FACT_NAV_LABEL, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE (+30 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "resolveMaterialMonth"
Cohesion: 0.26
Nodes (17): CashflowOpexGroupFactPage(), generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), isOpexGroupCode(), operatingExpenseOtherGroupDayView() (+9 more)

### Community 40 - "cashflow/paths.ts"
Cohesion: 0.15
Nodes (16): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE (+8 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.14
Nodes (25): DerivativePage(), metadata, activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection (+17 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (22): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+14 more)

### Community 45 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 46 - "isOccurredOn"
Cohesion: 0.10
Nodes (45): CashflowOtherFactPage(), metadata, CashflowTransportFactPage(), metadata, creditResourcesMonthView, isOccurredOn(), occurredOnOpen(), applyDayFactToGroup() (+37 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.10
Nodes (44): Единицы, monthInterestAmounts(), SalesPlan, ratioRound(), monthOperatingExpenseAmounts(), productionPlanLineMetrics, priceExVatTenThousandths(), priceWithVatFromExVat() (+36 more)

### Community 49 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.15
Nodes (19): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), DerivativeMovementPlanScreen() (+11 more)

### Community 50 - "PlanningScreen.tsx"
Cohesion: 0.16
Nodes (21): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+13 more)

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
Cohesion: 0.15
Nodes (16): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+8 more)

### Community 58 - "DerivativeFormTable.tsx"
Cohesion: 0.18
Nodes (9): buildCandidateGroups(), CandidateGroup, CandidateRow, DerivativeComponentKind, DerivativeFormEmpty(), RecipeComponentSearch(), SelectedGroup, selectedGroups() (+1 more)

### Community 60 - "MaterialsSummaryTable.tsx"
Cohesion: 0.05
Nodes (63): costWithVat(), DerivativeMovementRow, DerivativeMovementSection, MaterialPlanField, COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable() (+55 more)

### Community 61 - "opexHrefWithQuery"
Cohesion: 0.20
Nodes (10): OpexGroupFactRedirectPage(), OpexHrFactRedirectPage(), OpexOtherFactRedirectPage(), OpexTransportFactRedirectPage(), OPEX_HR_FACT_HREF, OPEX_OTHER_FACT_HREF, OPEX_TRANSPORT_FACT_HREF, opexGroupFactHrefPath() (+2 more)

### Community 62 - "entityNameRowClassName"
Cohesion: 0.25
Nodes (19): HrDepartmentId, HrDepartmentView, CashflowSummaryScreen(), toggle(), LineRows(), AddPositionDialog(), DepartmentBlock(), HrPlanScreen() (+11 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "sales-plan.ts"
Cohesion: 0.28
Nodes (14): activeProducts(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan(), isPrice(), isVolume() (+6 more)

### Community 65 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (41): Свод, Свод, FinishedProductRecipePage(), metadata, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch() (+33 more)

### Community 66 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (23): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), formatRubles() (+15 more)

### Community 68 - "IconChevronDown"
Cohesion: 0.13
Nodes (28): DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), CategoryBlock(), columnEdgeClass(), CostRow(), DerivativeCostTable(), WorkshopBlock() (+20 more)

### Community 70 - "Icons.tsx"
Cohesion: 0.08
Nodes (55): defaultProductionJournalFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+47 more)

### Community 71 - "DerivativeCostTable.tsx"
Cohesion: 0.09
Nodes (37): COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, CostCell(), GROUP_END_KEYS, COLUMN_GROUPS, COLUMN_KIND (+29 more)

### Community 72 - "document-file.ts"
Cohesion: 0.19
Nodes (12): DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile(), ParseDocumentResult, serializeDocument() (+4 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.18
Nodes (17): ProductionEntryRejection, productionLineAmountWithVat(), emptyProductionEntryLineDraft(), piecesForAmount(), ProductionEntryLineDraft, ProductionEntryLineField, rowMetrics(), EntryForm() (+9 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.07
Nodes (45): OpexGroupCode, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), buildOtherGroupView() (+37 more)

### Community 75 - "useRole"
Cohesion: 0.22
Nodes (20): CreditResourcesPlanScreen(), inputKind(), creditResourcesPlanHref(), AddLineDialog(), OtherGroupBlock(), AddOtherLineDialog(), OPEX_OTHER_PLAN_TITLE, OPEX_LINE_ERROR (+12 more)

### Community 76 - "RecipeJournalsTable.tsx"
Cohesion: 0.23
Nodes (13): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+5 more)

### Community 77 - "materials.ts"
Cohesion: 0.12
Nodes (45): MaterialGroupId, MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine() (+37 more)

### Community 78 - "products.ts"
Cohesion: 0.10
Nodes (43): Home(), metadata, metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+35 more)

### Community 80 - "CashflowFactScreen.tsx"
Cohesion: 0.13
Nodes (23): TaxPaymentRejection, inputKind(), PaymentRow(), cashflowPlanHref(), cashflowSummaryHref(), monthHref(), inputKind(), PropertyTaxScreen() (+15 more)

### Community 81 - "SaleScreen.tsx"
Cohesion: 0.10
Nodes (47): metadata, SalePage(), metadata, NewSalePage(), SaleLine, addSale(), addSaleRejection(), defaultSaleDay() (+39 more)

### Community 82 - "SalesJournalScreen.tsx"
Cohesion: 0.14
Nodes (22): metadata, SalesJournalPage(), metadata, SalesFactPage(), Sale, saleTotals, workingSalesInMonth(), parseSalesFactQuery() (+14 more)

### Community 83 - "HrFactScreen.tsx"
Cohesion: 0.22
Nodes (14): CashflowHrFactPage(), metadata, HR_DEPARTMENT_LABELS, hrDayOutsourcingValue(), hrDayStaffValue(), outsourcingAmountExVat(), DepartmentBlock(), FactDepartment (+6 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (45): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, MOCK_MONTHS (+37 more)

### Community 85 - "SummaryScreen.tsx"
Cohesion: 0.19
Nodes (22): ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SalesComparison, SummaryLens, productionFactHref(), FullscreenToggle(), productionFactPageTitle() (+14 more)

### Community 88 - "SettingsScreen.tsx"
Cohesion: 0.17
Nodes (13): metadata, SettingsPage(), ROLES_HREF, ROLES_TITLE, PERMISSION_MATRIX_ROWS, permissionAllowed(), ROLES, RolesMatrix() (+5 more)

### Community 89 - "Архитектура прототипа"
Cohesion: 0.13
Nodes (12): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Слои, Чего не делать, Как собрать первый прототип, Подсказки заголовков таблицы (+4 more)

### Community 90 - "ProductionEntryFormTable.tsx"
Cohesion: 0.20
Nodes (16): ProductCategory, buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals (+8 more)

### Community 91 - "opex/text.ts"
Cohesion: 0.19
Nodes (14): fromRublesUpTo(), parseDecimal(), parsePropertyTaxMoney(), CREDIT_ERROR, parseCreditMoney(), parseInterestRate(), AGENCY_LINE_HINT, formatQuantity() (+6 more)

### Community 92 - "CreditResourcesSummaryScreen.tsx"
Cohesion: 0.17
Nodes (10): COLUMN_GROUPS, COLUMN_KIND, columnEdge(), ColumnKey, COLUMNS, CreditResourcesSummaryScreen(), GROUP_END, creditResourcesSummaryHref() (+2 more)

### Community 93 - "ProductionEntryScreen"
Cohesion: 0.24
Nodes (8): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), defaultProductionEntryDay(), productionEntryByIdOrNull(), NEW_PRODUCTION_ENTRY_TITLE, ProductionEntryScreen()

### Community 94 - "FinishedGoodsFactTable"
Cohesion: 0.60
Nodes (5): CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), ProductRow(), visibleDayRows()

### Community 95 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 541 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionPlanScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `opex/paths.ts`, `MaterialsPlanScreen.tsx`, `OpexSummaryScreen.tsx`, `MaterialJournalScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `recipes/paths.ts`, `monthKeyFromDate`, `index.ts`, `AppShell.tsx`, `resolveMaterialMonth`, `cashflow/paths.ts`, `derivatives.ts`, `RoleProvider.tsx`, `vat/paths.ts`, `isOccurredOn`, `DerivativeMovementPlanScreen.tsx`, `PlanningScreen.tsx`, `credit-resources/paths.ts`, `opexHrefWithQuery`, `entityNameRowClassName`, `derivative-cost.ts`, `MaterialDocumentScreen.tsx`, `IconChevronDown`, `Icons.tsx`, `ProductionEntryScreen.tsx`, `useRole`, `RecipeJournalsTable.tsx`, `products.ts`, `CashflowFactScreen.tsx`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`, `HrFactScreen.tsx`, `SummaryScreen.tsx`, `SettingsScreen.tsx`, `CreditResourcesSummaryScreen.tsx`, `ProductionEntryScreen`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06550632911392405 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionPlanScreen.tsx`, `sales-fact.ts`, `finished-goods.ts`, `opex/paths.ts`, `MaterialsPlanScreen.tsx`, `production-journal.ts`, `OpexSummaryScreen.tsx`, `MaterialJournalScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `next`, `production-fact.ts`, `hr.ts`, `index.ts`, `resolveMaterialMonth`, `isOccurredOn`, `summary.ts`, `DerivativeMovementPlanScreen.tsx`, `PlanningScreen.tsx`, `entityNameRowClassName`, `sales-plan.ts`, `MaterialDocumentScreen.tsx`, `IconChevronDown`, `Icons.tsx`, `ProductionEntryScreen.tsx`, `useRole`, `products.ts`, `CashflowFactScreen.tsx`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`, `HrFactScreen.tsx`, `SummaryScreen.tsx`, `CreditResourcesSummaryScreen.tsx`, `ProductionEntryScreen`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `SummaryTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Why does `PrototypeDocument` connect `sales-fact.ts` to `use-opex.ts`, `ProductionPlanScreen.tsx`, `mock-document.ts`, `finished-goods.ts`, `DerivativeCreateScreen.tsx`, `credit-resources.ts`, `derivative-movement.ts`, `cashflow.ts`, `production-journal.ts`, `production-plan.ts`, `movement-plan.ts`, `recipe-yield.ts`, `production-fact.ts`, `document.ts`, `DocumentProvider.tsx`, `hr.ts`, `AppShell.tsx`, `derivatives.ts`, `summary.ts`, `sales-plan.ts`, `derivative-cost.ts`, `document-file.ts`, `ProductionEntryScreen.tsx`, `operating-expense.ts`, `materials.ts`, `products.ts`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Should `ProductionPlanScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09390243902439024 - nodes in this community are weakly interconnected._