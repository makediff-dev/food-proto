# Graph Report - food-proto  (2026-11-13)

## Corpus Check
- 281 files · ~166,501 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2614 nodes · 10255 edges · 85 communities (78 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `817b2cc8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- sales-fact/paths.ts
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- entityNameRowClassName
- finished-goods.ts
- compilerOptions
- FinishedProductEditScreen.tsx
- keepWithNext
- Icons.tsx
- monthKeyFromDate
- SummaryHeadlineTable.tsx
- mock-materials.ts
- SummaryScreen.tsx
- credit-resources.ts
- MaterialsSummaryTable.tsx
- production-plan.ts
- DerivativeCostTable.tsx
- Флоу товара
- document.ts
- MovementPlanScreen.tsx
- PageFrame
- opex/paths.ts
- credit-resources/paths.ts
- production-fact.ts
- FinishedGoodsFactScreen.tsx
- cashflow/paths.ts
- PlanRedirect.tsx
- DocumentProvider.tsx
- MaterialsSummaryScreen.tsx
- index.ts
- AppShell.tsx
- flow.md
- sales-fact/text.ts
- DerivativeCreateScreen.tsx
- derivatives.ts
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- hr.ts
- RecipeJournalsTable.tsx
- Отчет общий движения
- summary.ts
- next
- ProductionJournalFactScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- parseOpexMonthQuery
- PlanningScreen.tsx
- inputs/README.md
- OtherPlanScreen
- vat/paths.ts
- OtherFactScreen
- Отчет общий движения производных
- Отчет подневный движения
- SummaryTable.tsx
- use-materials.ts
- Себестоимость готовой продукции
- ProductionPlanScreen.tsx
- Отчет подневный производства
- SaleScreen.tsx
- SettingsScreen.tsx
- OpexGroupFactScreen
- ProductionEntryScreen.tsx
- operating-expense.ts
- sales-fact.ts
- RecipeComponentSearch
- MaterialsPlanScreen.tsx
- sales.ts
- Отчет общий производства
- Отчет подневный продаж
- TransportFactScreen
- mock-opex.ts
- MaterialsNormsScreen
- MaterialDocumentScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 118 edges
2. `next` - 110 edges
3. `PageFrame()` - 107 edges
4. `react` - 84 edges
5. `useOpex()` - 83 edges
6. `entityNameRowClassName()` - 78 edges
7. `ColumnLabel()` - 74 edges
8. `useRole()` - 69 edges
9. `keepWithNext()` - 66 edges
10. `IconChevronDown()` - 64 edges

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

## Communities (85 total, 7 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.07
Nodes (74): HireSeed, HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine (+66 more)

### Community 1 - "sales-fact/paths.ts"
Cohesion: 0.15
Nodes (16): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+8 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.09
Nodes (56): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+48 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.07
Nodes (56): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, buildRow(), costForQuantity() (+48 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (39): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+31 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (42): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+34 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+35 more)

### Community 7 - "materials.ts"
Cohesion: 0.10
Nodes (42): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+34 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "entityNameRowClassName"
Cohesion: 0.06
Nodes (84): DerivativeMovementRow, DerivativeMovementSection, toggle(), LineRows(), DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), COLUMN_KIND (+76 more)

### Community 11 - "finished-goods.ts"
Cohesion: 0.09
Nodes (61): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+53 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.10
Nodes (51): ProductRecipeLine, activeMaterials(), ProductRecipeRejection, gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse() (+43 more)

### Community 14 - "keepWithNext"
Cohesion: 0.06
Nodes (85): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, TotalCell() (+77 more)

### Community 15 - "Icons.tsx"
Cohesion: 0.10
Nodes (65): react, HR_DEPARTMENT_LABELS, CashflowSummaryScreen(), defaultOpenIds(), VarianceSense, COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+57 more)

### Community 16 - "monthKeyFromDate"
Cohesion: 0.17
Nodes (23): monthKeyFromDate(), planMonthOpen(), shiftMonth(), saleTotals, lastHorizonMonth(), FullscreenToggle(), InventoryScreen(), resolveMonth() (+15 more)

### Community 17 - "SummaryHeadlineTable.tsx"
Cohesion: 0.29
Nodes (12): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+4 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (33): activeCategories(), recommendedVolumePiecesForMonths(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, planningHref() (+25 more)

### Community 20 - "credit-resources.ts"
Cohesion: 0.06
Nodes (82): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+74 more)

### Community 21 - "MaterialsSummaryTable.tsx"
Cohesion: 0.06
Nodes (52): costWithVat(), MaterialMovementTotals, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS (+44 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.12
Nodes (29): commitDocumentUpdate(), ProductionPlanLine, normForProduct(), plannedProductionVolumePieces(), targetClosingPiecesFromNorm(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection() (+21 more)

### Community 23 - "DerivativeCostTable.tsx"
Cohesion: 0.11
Nodes (32): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell(), CostRow(), DerivativeCostTable() (+24 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "document.ts"
Cohesion: 0.06
Nodes (47): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+39 more)

### Community 26 - "MovementPlanScreen.tsx"
Cohesion: 0.11
Nodes (30): metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage(), clampSummaryMonth(), lastSummaryMonth() (+22 more)

### Community 27 - "PageFrame"
Cohesion: 0.14
Nodes (19): metadata, ProductionJournalPage(), useDocumentStore(), productionEntryPieces(), workingProductionEntriesInMonth(), inputKind(), PropertyTaxScreen(), DerivativeMovementInventoryScreen() (+11 more)

### Community 28 - "opex/paths.ts"
Cohesion: 0.15
Nodes (20): monthHref(), OPEX_GROUP_BASE_HREF, OPEX_HR_FACT_HREF, OPEX_HR_HREF, OPEX_HR_PLAN_HREF, OPEX_OTHER_FACT_HREF, OPEX_SUMMARY_HREF, OPEX_TRANSPORT_FACT_HREF (+12 more)

### Community 29 - "credit-resources/paths.ts"
Cohesion: 0.13
Nodes (20): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CreditResourcesFactScreen(), inputKind() (+12 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.12
Nodes (37): planOpeningPrice(), priceAverage(), rangePlanProduction(), rangePlanSales(), amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens() (+29 more)

### Community 31 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.10
Nodes (32): metadata, MovementFactPage(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle() (+24 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.19
Nodes (13): CashflowSummaryPage(), metadata, CashflowPropertyTaxPage(), metadata, CASHFLOW_PROPERTY_TAX_HREF, CASHFLOW_PROPERTY_TAX_TITLE, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF (+5 more)

### Community 33 - "PlanRedirect.tsx"
Cohesion: 0.33
Nodes (7): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, PlanRedirect()

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.16
Nodes (17): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+9 more)

### Community 35 - "MaterialsSummaryScreen.tsx"
Cohesion: 0.33
Nodes (8): MaterialsPage(), metadata, materialMovementMonth, MaterialsSummaryScreen(), buildSections(), MaterialsSummaryTable(), MATERIALS_SUMMARY_TITLE, materialsSummaryHref()

### Community 36 - "index.ts"
Cohesion: 0.08
Nodes (62): adjacentDay(), COLUMNS, ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+54 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.09
Nodes (37): Поток данных, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF (+29 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "sales-fact/text.ts"
Cohesion: 0.11
Nodes (25): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), parsePropertyTaxMoney() (+17 more)

### Community 40 - "DerivativeCreateScreen.tsx"
Cohesion: 0.14
Nodes (32): derivativeWorkshopById(), warehouseIdForWorkshop(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS (+24 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.11
Nodes (30): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeCompositionLines() (+22 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.16
Nodes (18): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT, ALL_NAV_SECTIONS (+10 more)

### Community 45 - "hr.ts"
Cohesion: 0.06
Nodes (68): HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrDayStaffLine, HrDepartmentId, isOccurredOn(), finishedGoodsSummaryAsOfDate(), averageSalary(), dayFactsInMonth() (+60 more)

### Community 46 - "RecipeJournalsTable.tsx"
Cohesion: 0.13
Nodes (22): react-dom, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RecipeJournalsScreen() (+14 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.10
Nodes (50): Единицы, monthInterestAmounts(), SalesPlan, productCostPerPiece(), averageAmount(), percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts() (+42 more)

### Community 49 - "next"
Cohesion: 0.10
Nodes (29): nextConfig, next, RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage() (+21 more)

### Community 50 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.12
Nodes (24): metadata, ProductionFactPage(), metadata, ProductionPage(), defaultProductionJournalFactDay(), parseProductionFactQuery(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE (+16 more)

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

### Community 57 - "parseOpexMonthQuery"
Cohesion: 0.12
Nodes (16): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexSummaryPage(), metadata, OpexTransportPage() (+8 more)

### Community 58 - "PlanningScreen.tsx"
Cohesion: 0.18
Nodes (18): metadata, PlanningPage(), missingPlanProducts(), AddNamedDialog(), TransportPlanScreen(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref() (+10 more)

### Community 60 - "OtherPlanScreen"
Cohesion: 0.29
Nodes (7): metadata, OpexOtherPlanPage(), AddOtherLineDialog(), OtherPlanScreen(), OPEX_OTHER_PLAN_TITLE, opexGroupHref(), opexOtherPlanHref()

### Community 61 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 62 - "OtherFactScreen"
Cohesion: 0.40
Nodes (5): metadata, OpexOtherFactPage(), OtherFactScreen(), OPEX_OTHER_FACT_TITLE, opexOtherFactHref()

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 65 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (33): priceWithVatFromExVat(), SummaryGroup, SummaryRow, SummaryVariance, CreditResourcesPlanScreen(), inputKind(), VAT_PARSE_ERROR, averagedUnitCost() (+25 more)

### Community 66 - "use-materials.ts"
Cohesion: 0.16
Nodes (29): addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair() (+21 more)

### Community 68 - "ProductionPlanScreen.tsx"
Cohesion: 0.21
Nodes (13): metadata, ProductionPlanPage(), missingProductionPlanProducts(), activeProducts(), parseProductionPlanQuery(), PRODUCTION_PLAN_TITLE, productionPlanHref(), FullscreenToggle() (+5 more)

### Community 70 - "SaleScreen.tsx"
Cohesion: 0.20
Nodes (24): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), salesJournalHref(), emptySaleLineDraft(), rowMetrics(), SaleLineDraft, SaleLineField (+16 more)

### Community 71 - "SettingsScreen.tsx"
Cohesion: 0.09
Nodes (30): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+22 more)

### Community 72 - "OpexGroupFactScreen"
Cohesion: 0.22
Nodes (16): generateMetadata(), OpexGroupFactPage(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), isOpexGroupCode(), operatingExpenseOtherGroupMonthView() (+8 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (45): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection() (+37 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (57): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection() (+49 more)

### Community 75 - "sales-fact.ts"
Cohesion: 0.09
Nodes (34): Архитектура прототипа, Слои, Удаление, Чего не делать, UnitCost, Product, ProductCategory, dayGridProducts() (+26 more)

### Community 76 - "RecipeComponentSearch"
Cohesion: 0.29
Nodes (4): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups(), IconSearch()

### Community 77 - "MaterialsPlanScreen.tsx"
Cohesion: 0.09
Nodes (28): MaterialsInventoryPage(), metadata, MaterialsPlanPage(), metadata, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWarehouseId (+20 more)

### Community 78 - "sales.ts"
Cohesion: 0.28
Nodes (16): SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), PLAN_HORIZON_MONTHS, replaceSales() (+8 more)

### Community 83 - "TransportFactScreen"
Cohesion: 0.17
Nodes (14): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), dayHref(), OPEX_HR_FACT_TITLE (+6 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.08
Nodes (40): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), isShopPositionId(), MOCK_MONTHS (+32 more)

### Community 89 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 103 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (24): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MaterialReceiptsPage(), metadata, MATERIAL_WAREHOUSES, materialById() (+16 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 541 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `sales-fact/paths.ts`, `sales-plan.ts`, `derivative-movement.ts`, `package.json`, `FinishedProductEditScreen.tsx`, `Icons.tsx`, `monthKeyFromDate`, `SummaryScreen.tsx`, `MovementPlanScreen.tsx`, `PageFrame`, `credit-resources/paths.ts`, `FinishedGoodsFactScreen.tsx`, `cashflow/paths.ts`, `PlanRedirect.tsx`, `DocumentProvider.tsx`, `MaterialsSummaryScreen.tsx`, `AppShell.tsx`, `DerivativeCreateScreen.tsx`, `derivatives.ts`, `RecipeJournalsTable.tsx`, `ProductionJournalFactScreen.tsx`, `parseOpexMonthQuery`, `PlanningScreen.tsx`, `OtherPlanScreen`, `vat/paths.ts`, `OtherFactScreen`, `ProductionPlanScreen.tsx`, `SaleScreen.tsx`, `SettingsScreen.tsx`, `OpexGroupFactScreen`, `ProductionEntryScreen.tsx`, `MaterialsPlanScreen.tsx`, `TransportFactScreen`, `MaterialsNormsScreen`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06842105263157895 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `sales-fact/paths.ts`, `sales-plan.ts`, `derivative-movement.ts`, `materials.ts`, `entityNameRowClassName`, `finished-goods.ts`, `Icons.tsx`, `SummaryScreen.tsx`, `MovementPlanScreen.tsx`, `PageFrame`, `credit-resources/paths.ts`, `production-fact.ts`, `FinishedGoodsFactScreen.tsx`, `PlanRedirect.tsx`, `MaterialsSummaryScreen.tsx`, `sales-fact/text.ts`, `hr.ts`, `summary.ts`, `next`, `ProductionJournalFactScreen.tsx`, `PlanningScreen.tsx`, `OtherPlanScreen`, `OtherFactScreen`, `SummaryTable.tsx`, `ProductionPlanScreen.tsx`, `SaleScreen.tsx`, `OpexGroupFactScreen`, `ProductionEntryScreen.tsx`, `sales-fact.ts`, `MaterialsPlanScreen.tsx`, `sales.ts`, `TransportFactScreen`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08602150537634409 - nodes in this community are weakly interconnected._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06829488919041157 - nodes in this community are weakly interconnected._
- **Should `mock-document.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.045328399629972246 - nodes in this community are weakly interconnected._