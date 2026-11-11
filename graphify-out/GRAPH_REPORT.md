# Graph Report - food-proto  (2026-11-11)

## Corpus Check
- 275 files · ~161,123 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2546 nodes · 9964 edges · 96 communities (89 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c66ccc4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- transport.ts
- SaleScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- FinishedGoodsMonthTable.tsx
- production-journal-fact.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- useDocumentStore
- document.ts
- credit-resources.ts
- MaterialsPlanScreen.tsx
- mock-materials.ts
- use-opex.ts
- PageFrame
- SummaryTable.tsx
- production-plan.ts
- DerivativeCostTable.tsx
- Флоу товара
- ProductionFactTable.tsx
- MovementPlanScreen.tsx
- use-materials.ts
- RecipePrint.tsx
- next
- production-fact.ts
- Cells.tsx
- cashflow/paths.ts
- ColumnLabel
- products.ts
- MaterialReceiptFormTable.tsx
- index.ts
- AppShell.tsx
- flow.md
- access.ts
- monthKeyFromDate
- derivatives.ts
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- summary.ts
- recipes/cost/page.tsx
- ProductionJournalFactScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- movement-plan.ts
- DocumentProvider.tsx
- inputs/README.md
- opex/paths.ts
- vat/paths.ts
- FinishedProductsScreen.tsx
- Отчет общий движения производных
- FinishedGoodsFactScreen.tsx
- HrPlanScreen.tsx
- DocumentForm
- Себестоимость готовой продукции
- TransportFactScreen.tsx
- vat-report.ts
- Icons.tsx
- document-file.ts
- HrFactScreen.tsx
- ProductionEntryScreen.tsx
- operating-expense.ts
- IconChevronDown
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- SummaryScreen.tsx
- Отчет подневный продаж
- MaterialDocumentScreen.tsx
- PlanningScreen.tsx
- production-journal.ts
- mock-opex.ts
- sales.ts
- HrSummaryScreen.tsx
- TransportSummaryScreen.tsx
- entityNameRowClassName
- sales-fact.ts
- isMonthKey
- amountExVat
- AppShell
- OpexSummaryScreen.tsx
- settings/page.tsx
- use-movement-plan.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 116 edges
2. `next` - 108 edges
3. `PageFrame()` - 105 edges
4. `react` - 83 edges
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

### Community 0 - "transport.ts"
Cohesion: 0.10
Nodes (38): HireSeed, isOccurredOn(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlanLine, activeTransportCarriers(), addTransportCarrier() (+30 more)

### Community 1 - "SaleScreen.tsx"
Cohesion: 0.15
Nodes (29): metadata, SalePage(), metadata, NewSalePage(), defaultSaleDay(), saleLineAmountWithVat(), saleLinePriceWithVat(), NEW_SALE_TITLE (+21 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.09
Nodes (45): Home(), metadata, metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+37 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (34): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+26 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (38): mockCreditors, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember (+30 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (42): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+34 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+35 more)

### Community 7 - "materials.ts"
Cohesion: 0.09
Nodes (46): costExVat(), MaterialOpeningLine, MaterialReceiptLine, NORMED_MATERIAL_GROUP_ID, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity() (+38 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (44): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+36 more)

### Community 11 - "production-journal-fact.ts"
Cohesion: 0.20
Nodes (16): Удаление, productionSpendOn(), dayGridProducts(), periodGridCategories(), dayTotals(), productionEntryDayPieces(), ProductionJournalFactDayView, ProductionJournalFactGroup (+8 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (53): DerivativePage(), metadata, outputPieceThousandthsOf(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantity(), formatQuantityDraft() (+45 more)

### Community 14 - "useDocumentStore"
Cohesion: 0.10
Nodes (32): metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), useDocumentStore(), ProductionEntry (+24 more)

### Community 15 - "document.ts"
Cohesion: 0.10
Nodes (22): NameRejection, Creditor, DeletableRecord, Derivative, DERIVATIVE_UNITS, DERIVATIVE_WORKSHOPS, MATERIAL_GROUPS, MATERIAL_WAREHOUSES (+14 more)

### Community 16 - "credit-resources.ts"
Cohesion: 0.10
Nodes (53): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+45 more)

### Community 17 - "MaterialsPlanScreen.tsx"
Cohesion: 0.08
Nodes (29): MaterialsInventoryPage(), metadata, MaterialsPlanPage(), metadata, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWarehouseId (+21 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "use-opex.ts"
Cohesion: 0.14
Nodes (31): isDeletionMark(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrFieldRejection, HrTaxRateField, isHrDepartmentIdSafe() (+23 more)

### Community 20 - "PageFrame"
Cohesion: 0.10
Nodes (37): react, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, metadata (+29 more)

### Community 21 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (49): priceWithVatFromExVat(), TotalCell(), ProductUnitPrice(), RowCell(), TotalCell(), CategoryBlock(), COLUMN_KIND, ColumnKey (+41 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "DerivativeCostTable.tsx"
Cohesion: 0.16
Nodes (22): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell(), CostRow(), DerivativeCostTable() (+14 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 26 - "MovementPlanScreen.tsx"
Cohesion: 0.08
Nodes (41): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+33 more)

### Community 27 - "use-materials.ts"
Cohesion: 0.21
Nodes (24): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isVatPercent(), materialById() (+16 more)

### Community 28 - "RecipePrint.tsx"
Cohesion: 0.11
Nodes (29): derivativeWorkshopById(), warehouseIdForWorkshop(), buildCandidateGroups(), componentDraftKey(), RecipeComponentSearch(), componentLabel(), CompositionLine(), DeleteAction() (+21 more)

### Community 29 - "next"
Cohesion: 0.09
Nodes (33): nextConfig, next, CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata (+25 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.17
Nodes (25): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+17 more)

### Community 31 - "Cells.tsx"
Cohesion: 0.17
Nodes (19): formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), parseCreditMoney(), parseInterestRate() (+11 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.29
Nodes (8): CashflowSummaryPage(), metadata, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF, CASHFLOW_SUMMARY_TITLE, cashflowSummaryHref(), monthHref(), parseCashflowMonthQuery()

### Community 33 - "ColumnLabel"
Cohesion: 0.10
Nodes (27): Подсказки заголовков таблицы, DerivativeMovementPlanTable(), FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS (+19 more)

### Community 34 - "products.ts"
Cohesion: 0.17
Nodes (23): ProductRecipeLine, addProduct(), appendProductionPlanLines(), appendSalesPlanLines(), isWarehouseId(), lineKey(), ProductCompositionLineView, ProductRecipeRejection (+15 more)

### Community 35 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (57): ProductCategory, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+49 more)

### Community 36 - "index.ts"
Cohesion: 0.08
Nodes (57): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+49 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.10
Nodes (29): CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, opexGroupFactHrefPath(), opexGroupHrefPath(), opexGroupPlanHrefPath() (+21 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "access.ts"
Cohesion: 0.15
Nodes (12): RecipesFinishedCostDetailPage(), CREDIT_RESOURCES_SUMMARY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, parseRecipesFinishedCostMonthQuery(), RECIPES_FINISHED_COST_HREF, HOME_SECTION_ORDER (+4 more)

### Community 40 - "monthKeyFromDate"
Cohesion: 0.12
Nodes (34): metadata, SalesJournalPage(), metadata, SalesFactPage(), maxSaleOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth() (+26 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.11
Nodes (35): metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection (+27 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (22): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+14 more)

### Community 45 - "hr.ts"
Cohesion: 0.07
Nodes (56): OutsourcingSeed, costWithVat(), HR_SHOP_DEPARTMENT_IDS, HrDayOutsourcingLine, HrDayStaffLine, HrMonthFactStaffLine, HrMonthPlanOutsourcingLine, HrMonthPlanStaffLine (+48 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.17
Nodes (21): FinishedGoodsOpeningLine, bookClosingReferencedProductIds(), closingInventoryDeviationPieces(), closingNormMetrics(), emptyPlanSide(), FinishedGoodsDayView, finishedGoodsGridProducts(), finishedGoodsMonthView (+13 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.11
Nodes (42): Единицы, monthInterestAmounts(), factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, actualRangeSummary(), applyFactScale() (+34 more)

### Community 49 - "recipes/cost/page.tsx"
Cohesion: 0.32
Nodes (6): RecipesCostDetailPage(), metadata, RecipesCostPage(), parseRecipesCostMonthQuery(), RECIPES_COST_HREF, RECIPES_COST_TITLE

### Community 50 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (19): metadata, ProductionFactPage(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), DayDateControl() (+11 more)

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

### Community 57 - "movement-plan.ts"
Cohesion: 0.17
Nodes (25): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookOpeningPiecesForProduct(), closingStockPieces(), hasStoredInventoryLine(), storedInventoryPiecesForProduct(), buildRow(), emptyNormLine() (+17 more)

### Community 58 - "DocumentProvider.tsx"
Cohesion: 0.21
Nodes (14): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+6 more)

### Community 60 - "opex/paths.ts"
Cohesion: 0.10
Nodes (45): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexOtherFactPage(), metadata (+37 more)

### Community 61 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 62 - "FinishedProductsScreen.tsx"
Cohesion: 0.23
Nodes (11): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductEditScreen(), FinishedProductsScreen() (+3 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.12
Nodes (29): defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+21 more)

### Community 65 - "HrPlanScreen.tsx"
Cohesion: 0.11
Nodes (36): metadata, OpexHrPlanPage(), metadata, OpexTransportPlanPage(), HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, CashflowSummaryScreen() (+28 more)

### Community 66 - "DocumentForm"
Cohesion: 0.17
Nodes (15): MaterialsNormsPage(), metadata, activeMaterials(), isPrice(), materialReceiptRejection(), occurredOnOpen(), maxProductionEntryOccurredOn(), DocumentForm() (+7 more)

### Community 68 - "TransportFactScreen.tsx"
Cohesion: 0.30
Nodes (10): metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), dayHref(), OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref(), resolveDay() (+2 more)

### Community 69 - "vat-report.ts"
Cohesion: 0.46
Nodes (7): line(), side(), sumChildren(), VatMoneySide, vatOf(), VatReportLine, vatReportMonthView

### Community 70 - "Icons.tsx"
Cohesion: 0.20
Nodes (16): permissionAllowed(), ROLES, RolesMatrix(), MockSection(), RoleSection(), SettingsScreen(), Glyph(), IconClose() (+8 more)

### Community 71 - "document-file.ts"
Cohesion: 0.17
Nodes (15): DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile(), ParseDocumentResult, serializeDocument() (+7 more)

### Community 72 - "HrFactScreen.tsx"
Cohesion: 0.21
Nodes (15): OpexGroupFactPage(), metadata, OpexHrFactPage(), HR_DEPARTMENT_IDS, hrDayOutsourcingValue(), hrDayStaffValue(), hrMonthStaffValue(), FactDepartment (+7 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.12
Nodes (25): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), defaultProductionEntryDay(), ProductionEntryRejection, productionLineAmountWithVat(), NEW_PRODUCTION_ENTRY_TITLE (+17 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.07
Nodes (50): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), buildOtherGroupView() (+42 more)

### Community 75 - "IconChevronDown"
Cohesion: 0.16
Nodes (25): LineRows(), DerivativeMovementInventoryTable(), WorkshopBlock(), WorkshopBlock(), CategoryBlock(), DepartmentBlock(), GroupBlock(), CategoryBlock() (+17 more)

### Community 79 - "SummaryScreen.tsx"
Cohesion: 0.18
Nodes (22): ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref(), FullscreenToggle(), productionFactPageTitle(), Workspace() (+14 more)

### Community 81 - "MaterialDocumentScreen.tsx"
Cohesion: 0.12
Nodes (25): MaterialsPage(), metadata, MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MaterialReceiptsPage(), metadata (+17 more)

### Community 82 - "PlanningScreen.tsx"
Cohesion: 0.20
Nodes (16): metadata, PlanningPage(), deletedCategories(), activeProducts(), deletedProducts(), missingPlanProducts(), parsePlanningQuery(), PLANNING_SECTION_TITLE (+8 more)

### Community 83 - "production-journal.ts"
Cohesion: 0.27
Nodes (16): ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection() (+8 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.05
Nodes (50): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), isShopPositionId(), MOCK_MONTHS (+42 more)

### Community 85 - "sales.ts"
Cohesion: 0.28
Nodes (16): SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales(), saleById() (+8 more)

### Community 86 - "HrSummaryScreen.tsx"
Cohesion: 0.22
Nodes (14): metadata, OpexHrPage(), DepartmentBlock(), HrSummaryScreen(), OPEX_HR_TITLE, opexHrHref(), formatHours(), formatQuantity() (+6 more)

### Community 87 - "TransportSummaryScreen.tsx"
Cohesion: 0.16
Nodes (15): metadata, OpexTransportPage(), ReportSubBannerGroup, OPEX_TRANSPORT_TITLE, HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey, hireColumns() (+7 more)

### Community 88 - "entityNameRowClassName"
Cohesion: 0.09
Nodes (58): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeRow() (+50 more)

### Community 89 - "sales-fact.ts"
Cohesion: 0.20
Nodes (16): UnitCost, percentHundredths(), vatPercentHundredths(), periodGridProducts(), ProductionJournalFactRow, dayTotals(), productById(), rowMetrics() (+8 more)

### Community 90 - "isMonthKey"
Cohesion: 0.27
Nodes (16): isMonthKey(), buildGroups(), emptyRangeView(), emptyTotals(), factualClosingPiecesThrough(), finishedGoodsMonthDays(), finishedGoodsRangeView, finishedGoodsSummaryAsOfDate() (+8 more)

### Community 91 - "amountExVat"
Cohesion: 0.23
Nodes (16): plannedProductionVolumePieces(), planOpeningPrice(), rangePlanProduction(), rangePlanSales(), targetClosingPiecesFromNorm(), amountExVat(), productSide(), productionLineAmountExVat() (+8 more)

### Community 92 - "AppShell"
Cohesion: 0.19
Nodes (12): Архитектура прототипа, Поток данных, Слои, Чего не делать, pathnameSection(), roleCanAccessPath(), roleHomeHref(), RoleGate() (+4 more)

### Community 93 - "OpexSummaryScreen.tsx"
Cohesion: 0.25
Nodes (9): metadata, OpexSummaryPage(), COLUMN_GROUPS, columnEdgeClass(), ColumnKey, COLUMNS, GROUP_END_KEYS, OpexSummaryScreen() (+1 more)

### Community 94 - "settings/page.tsx"
Cohesion: 0.32
Nodes (4): metadata, SettingsPage(), SETTINGS_HREF, SETTINGS_TITLE

### Community 95 - "use-movement-plan.ts"
Cohesion: 0.36
Nodes (7): FinishedGoodsOpeningRejection, isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, FinishedGoodsNormRejection, useMovementPlan()

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 536 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `SaleScreen.tsx`, `sales-plan.ts`, `package.json`, `DerivativeCreateScreen.tsx`, `useDocumentStore`, `MaterialsPlanScreen.tsx`, `PageFrame`, `MovementPlanScreen.tsx`, `RecipePrint.tsx`, `cashflow/paths.ts`, `AppShell.tsx`, `access.ts`, `monthKeyFromDate`, `derivatives.ts`, `RoleProvider.tsx`, `recipes/cost/page.tsx`, `ProductionJournalFactScreen.tsx`, `opex/paths.ts`, `vat/paths.ts`, `FinishedProductsScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `HrPlanScreen.tsx`, `DocumentForm`, `TransportFactScreen.tsx`, `HrFactScreen.tsx`, `ProductionEntryScreen.tsx`, `IconChevronDown`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `PlanningScreen.tsx`, `HrSummaryScreen.tsx`, `TransportSummaryScreen.tsx`, `AppShell`, `OpexSummaryScreen.tsx`, `settings/page.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `transport.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09716599190283401 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `SaleScreen.tsx`, `sales-plan.ts`, `package.json`, `FinishedGoodsMonthTable.tsx`, `DerivativeCreateScreen.tsx`, `useDocumentStore`, `MaterialsPlanScreen.tsx`, `SummaryTable.tsx`, `DerivativeCostTable.tsx`, `ProductionFactTable.tsx`, `MovementPlanScreen.tsx`, `RecipePrint.tsx`, `next`, `Cells.tsx`, `ColumnLabel`, `MaterialReceiptFormTable.tsx`, `index.ts`, `AppShell.tsx`, `monthKeyFromDate`, `RoleProvider.tsx`, `ProductionJournalFactScreen.tsx`, `DocumentProvider.tsx`, `opex/paths.ts`, `FinishedGoodsFactScreen.tsx`, `HrPlanScreen.tsx`, `TransportFactScreen.tsx`, `Icons.tsx`, `HrFactScreen.tsx`, `ProductionEntryScreen.tsx`, `IconChevronDown`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `PlanningScreen.tsx`, `HrSummaryScreen.tsx`, `TransportSummaryScreen.tsx`, `entityNameRowClassName`, `AppShell`, `OpexSummaryScreen.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `SaleScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14583333333333334 - nodes in this community are weakly interconnected._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09351432880844646 - nodes in this community are weakly interconnected._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._