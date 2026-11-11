# Graph Report - food-proto  (2026-11-11)

## Corpus Check
- 281 files · ~165,615 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2607 nodes · 10224 edges · 92 communities (89 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ba67fa9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- SalesJournalScreen.tsx
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
- ProductionFactTable.tsx
- PageFrame
- credit-resources.ts
- SummaryHeadlineTable.tsx
- mock-materials.ts
- SummaryScreen.tsx
- cashflow.ts
- MaterialsSummaryTable.tsx
- production-plan.ts
- index.ts
- Флоу товара
- document.ts
- monthKeyFromDate
- HrFactScreen.tsx
- FinishedGoodsMonthScreen.tsx
- credit-resources/paths.ts
- production-fact.ts
- useDocumentStore
- cashflow/paths.ts
- FinishedGoodsFactTable.tsx
- DocumentProvider.tsx
- MaterialReceiptFormTable.tsx
- SalesFactTable.tsx
- AppShell.tsx
- flow.md
- Cells.tsx
- RecipePrint.tsx
- derivatives.ts
- Отчет общий сырья
- roles.ts
- postcss.config.mjs
- hr.ts
- Icons.tsx
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- ProductionJournalScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- TransportSummaryScreen.tsx
- PlanningScreen.tsx
- inputs/README.md
- access.ts
- vat/paths.ts
- movement-plan.ts
- Отчет общий движения производных
- Инвентаризация
- SummaryTable.tsx
- use-materials.ts
- Себестоимость готовой продукции
- ProductionPlanScreen.tsx
- keepWithNext
- SaleScreen.tsx
- SettingsScreen.tsx
- next
- ProductionEntryFormTable.tsx
- operating-expense.ts
- sales-fact.ts
- DerivativeCreateScreen.tsx
- finished-product-cost.ts
- sales.ts
- README.md
- SaleFormTable.tsx
- amountExVat
- layout.tsx
- TransportFactScreen.tsx
- mock-opex.ts
- use-finished-recipes.ts
- SaleScreen
- recipes/cost/page.tsx
- TableNumber
- MaterialsNormsScreen
- Операционные расходы
- MaterialJournalScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 118 edges
2. `next` - 110 edges
3. `PageFrame()` - 107 edges
4. `react` - 84 edges
5. `useOpex()` - 83 edges
6. `entityNameRowClassName()` - 76 edges
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

## Communities (92 total, 3 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.07
Nodes (74): HireSeed, HrTaxRatesMonth, isDeletionMark(), isOccurredOn(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan (+66 more)

### Community 1 - "SalesJournalScreen.tsx"
Cohesion: 0.14
Nodes (22): metadata, SalesJournalPage(), metadata, SalesFactPage(), Sale, saleTotals, workingSales(), workingSalesInMonth() (+14 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.08
Nodes (55): metadata, PlanningArchivePage(), metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+47 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.07
Nodes (59): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, buildRow(), costForQuantity() (+51 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.04
Nodes (40): mockCreditors, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember (+32 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.15
Nodes (27): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+19 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (31): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение денежных средств (+23 more)

### Community 7 - "materials.ts"
Cohesion: 0.09
Nodes (48): costExVat(), MaterialGroupId, MaterialReceiptLine, MaterialUnit, MaterialWeightPair, addMoney(), addMoneyNullable(), bookClosingQuantity() (+40 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "entityNameRowClassName"
Cohesion: 0.09
Nodes (55): CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), cashflowSummaryHref(), monthHref(), WorkshopBlock(), DerivativeRow() (+47 more)

### Community 11 - "finished-goods.ts"
Cohesion: 0.15
Nodes (35): buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide(), emptyRangeView(), emptyTotals(), factualClosingPiecesThrough() (+27 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.13
Nodes (37): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent(), enableByPiece() (+29 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.19
Nodes (22): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+14 more)

### Community 15 - "PageFrame"
Cohesion: 0.08
Nodes (51): react, metadata, OpexTransportPlanPage(), creditResourcesMonthView, cashflowPropertyTaxHref(), inputKind(), PropertyTaxScreen(), CreditResourcesFactScreen() (+43 more)

### Community 16 - "credit-resources.ts"
Cohesion: 0.17
Nodes (34): activeCreditors(), addCreditor(), addCreditorRejection(), CreditFieldRejection, CreditMonthField, CreditMonthViewOptions, creditorsList(), creditorVisibleInMonth() (+26 more)

### Community 17 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (30): Home(), metadata, activeCategories(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref() (+22 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.09
Nodes (49): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, cashflowOpexAmount(), creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth() (+41 more)

### Community 21 - "MaterialsSummaryTable.tsx"
Cohesion: 0.07
Nodes (46): DerivativeRow(), RowCell(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS (+38 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "index.ts"
Cohesion: 0.08
Nodes (73): DerivativeMovementRow, DerivativeMovementSection, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, VarianceSense, COLUMN_KIND, ColumnKey (+65 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "document.ts"
Cohesion: 0.07
Nodes (38): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat(), Creditor, DeletableRecord (+30 more)

### Community 26 - "monthKeyFromDate"
Cohesion: 0.09
Nodes (38): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), monthKeyFromDate(), planMonthOpen() (+30 more)

### Community 27 - "HrFactScreen.tsx"
Cohesion: 0.18
Nodes (16): metadata, OpexHrFactPage(), HR_DEPARTMENT_LABELS, hrDayOutsourcingValue(), hrDayStaffValue(), FactDepartment, HrFactScreen(), open() (+8 more)

### Community 28 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 29 - "credit-resources/paths.ts"
Cohesion: 0.14
Nodes (18): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+10 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.20
Nodes (23): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+15 more)

### Community 31 - "useDocumentStore"
Cohesion: 0.09
Nodes (43): useDocumentStore(), recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), defaultSalesFactDay(), shiftMonth(), lastHorizonMonth(), DayDateControl() (+35 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.23
Nodes (10): CashflowSummaryPage(), metadata, CashflowPropertyTaxPage(), metadata, CASHFLOW_PROPERTY_TAX_HREF, CASHFLOW_PROPERTY_TAX_TITLE, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF (+2 more)

### Community 33 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.13
Nodes (23): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула, FinishedGoodsDayView, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals (+15 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.18
Nodes (17): Архитектура прототипа, Поток данных, Слои, Чего не делать, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+9 more)

### Community 35 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (41): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), DerivativePage(), metadata, Material, MATERIAL_GROUPS (+33 more)

### Community 36 - "SalesFactTable.tsx"
Cohesion: 0.10
Nodes (31): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, DayLabel(), dayOfMonth() (+23 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.12
Nodes (24): OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, opexGroupFactHrefPath(), opexGroupHrefPath(), opexGroupPlanHrefPath(), AppShell(), buildNavGroups(), buildOpexNav() (+16 more)

### Community 38 - "flow.md"
Cohesion: 0.22
Nodes (8): Отчет подневный движения, Чем день отличается от свода, Колонки строки товара, Отчет подневный производства, Группы, Отчет общий производства, Колонки строки товара, Отчет подневный продаж

### Community 39 - "Cells.tsx"
Cohesion: 0.11
Nodes (27): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), parsePropertyTaxMoney() (+19 more)

### Community 40 - "RecipePrint.tsx"
Cohesion: 0.09
Nodes (37): react-dom, metadata, RecipeFinishedPage(), MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, productCompositionLines() (+29 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.12
Nodes (31): activeDerivatives(), addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, derivativeWorkshopById(), isDerivativeUnit(), lineKey() (+23 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "roles.ts"
Cohesion: 0.17
Nodes (14): ALL_EDIT, ALL_NAV_SECTIONS, DEFAULT_ROLE_ID, NavSectionId, NO_EDIT, PERMISSION_MATRIX_ROWS, permissionAllowed(), PermissionFlagKey (+6 more)

### Community 45 - "hr.ts"
Cohesion: 0.09
Nodes (51): isShopPositionId(), HrDepartmentId, isHrShopDepartmentId(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), averageSalary(), dayFactsInMonth() (+43 more)

### Community 46 - "Icons.tsx"
Cohesion: 0.14
Nodes (26): ProductRow(), CandidateRowView(), GridInput(), componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable() (+18 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.13
Nodes (37): Единицы, monthInterestAmounts(), productCostPerPiece(), planPhase, actualRangeSummary(), applyFactScale(), applyPlanScale(), applySummaryLens() (+29 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.12
Nodes (24): RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), deleteDerivative() (+16 more)

### Community 50 - "ProductionJournalScreen.tsx"
Cohesion: 0.13
Nodes (23): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), ProductionEntry, productionEntryPieces() (+15 more)

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

### Community 57 - "TransportSummaryScreen.tsx"
Cohesion: 0.16
Nodes (16): metadata, OpexTransportPage(), ReportSubBannerGroup, OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey (+8 more)

### Community 58 - "PlanningScreen.tsx"
Cohesion: 0.20
Nodes (16): metadata, PlanningPage(), activeProducts(), missingPlanProducts(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), planningHref() (+8 more)

### Community 60 - "access.ts"
Cohesion: 0.22
Nodes (12): DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath() (+4 more)

### Community 61 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 62 - "movement-plan.ts"
Cohesion: 0.13
Nodes (31): Удаление, FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), finishedGoodsGridProducts(), FinishedGoodsOpeningRejection, hasStoredInventoryLine() (+23 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "Инвентаризация"
Cohesion: 0.67
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 65 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (29): SalesPlanRejection, SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock(), editableFieldNear() (+21 more)

### Community 66 - "use-materials.ts"
Cohesion: 0.18
Nodes (26): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+18 more)

### Community 68 - "ProductionPlanScreen.tsx"
Cohesion: 0.15
Nodes (20): metadata, ProductionPlanPage(), missingProductionPlanProducts(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), parseProductionPlanQuery(), PRODUCTION_PLAN_TITLE (+12 more)

### Community 69 - "keepWithNext"
Cohesion: 0.22
Nodes (23): TotalCell(), TotalCell(), ProductUnitPrice(), VarianceValue(), RowCell(), CategoryBlock(), ProductionPlanTable(), RowCell() (+15 more)

### Community 70 - "SaleScreen.tsx"
Cohesion: 0.23
Nodes (21): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), emptySaleLineDraft(), rowMetrics(), SaleLineDraft, initialDrafts(), lineDraftFromSale() (+13 more)

### Community 71 - "SettingsScreen.tsx"
Cohesion: 0.12
Nodes (20): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+12 more)

### Community 72 - "next"
Cohesion: 0.07
Nodes (63): nextConfig, next, generateMetadata(), OpexGroupFactPage(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage() (+55 more)

### Community 73 - "ProductionEntryFormTable.tsx"
Cohesion: 0.07
Nodes (58): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductCategory, ProductionEntryLine, addProductionEntry(), addProductionEntryRejection() (+50 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (58): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection() (+50 more)

### Community 75 - "sales-fact.ts"
Cohesion: 0.10
Nodes (35): costWithVat(), UnitCost, Product, amountWithVat(), averageAmount(), percentHundredths(), vatPercentHundredths(), dayGridProducts() (+27 more)

### Community 76 - "DerivativeCreateScreen.tsx"
Cohesion: 0.16
Nodes (15): Derivative, draftsFromLines(), buildCandidateGroups(), CandidateGroup, CandidateRow, componentDraftKey(), DerivativeComponentKind, DerivativeCompositionEditor() (+7 more)

### Community 77 - "finished-product-cost.ts"
Cohesion: 0.18
Nodes (17): MaterialWarehouseId, buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode, finishedProductCostMonth() (+9 more)

### Community 78 - "sales.ts"
Cohesion: 0.33
Nodes (14): SaleLine, addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), PLAN_HORIZON_MONTHS, replaceSales() (+6 more)

### Community 79 - "README.md"
Cohesion: 0.24
Nodes (5): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Запуск, Куда смотреть

### Community 80 - "SaleFormTable.tsx"
Cohesion: 0.23
Nodes (15): buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, formatKopecks(), GridInput(), groupTotals() (+7 more)

### Community 81 - "amountExVat"
Cohesion: 0.26
Nodes (15): plannedProductionVolumePieces(), priceAverage(), rangePlanProduction(), rangePlanSales(), targetClosingPiecesFromNorm(), amountExVat(), productSide(), productionPlanLineMetrics (+7 more)

### Community 82 - "layout.tsx"
Cohesion: 0.18
Nodes (10): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+2 more)

### Community 83 - "TransportFactScreen.tsx"
Cohesion: 0.30
Nodes (10): metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref(), TRANSPORT_ERROR, resolveDay() (+2 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.07
Nodes (44): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), MOCK_MONTHS, MOCK_VEHICLE_IDS (+36 more)

### Community 85 - "use-finished-recipes.ts"
Cohesion: 0.27
Nodes (8): FinishedProductRecipePage(), metadata, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), FinishedProductEditScreen(), useFinishedRecipes()

### Community 86 - "SaleScreen"
Cohesion: 0.28
Nodes (7): metadata, SalePage(), metadata, NewSalePage(), defaultSaleDay(), NEW_SALE_TITLE, SaleScreen()

### Community 87 - "recipes/cost/page.tsx"
Cohesion: 0.32
Nodes (6): RecipesCostDetailPage(), metadata, RecipesCostPage(), parseRecipesCostMonthQuery(), RECIPES_COST_HREF, RECIPES_COST_TITLE

### Community 88 - "TableNumber"
Cohesion: 0.27
Nodes (16): CategoryBlock(), FinishedGoodsMonthTable(), groupEndClass(), ProductRow(), RowCell(), TotalsCell(), RowCell(), TotalsCell() (+8 more)

### Community 89 - "MaterialsNormsScreen"
Cohesion: 0.40
Nodes (5): MaterialsNormsPage(), metadata, materialNormQuantity(), MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 93 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 103 - "MaterialJournalScreen.tsx"
Cohesion: 0.11
Nodes (27): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+19 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 540 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `SalesJournalScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `package.json`, `entityNameRowClassName`, `FinishedProductEditScreen.tsx`, `PageFrame`, `SummaryScreen.tsx`, `index.ts`, `monthKeyFromDate`, `HrFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `credit-resources/paths.ts`, `useDocumentStore`, `cashflow/paths.ts`, `MaterialReceiptFormTable.tsx`, `AppShell.tsx`, `RecipePrint.tsx`, `Icons.tsx`, `recipes/paths.ts`, `ProductionJournalScreen.tsx`, `TransportSummaryScreen.tsx`, `PlanningScreen.tsx`, `access.ts`, `vat/paths.ts`, `ProductionPlanScreen.tsx`, `SaleScreen.tsx`, `SettingsScreen.tsx`, `ProductionEntryFormTable.tsx`, `DerivativeCreateScreen.tsx`, `layout.tsx`, `TransportFactScreen.tsx`, `use-finished-recipes.ts`, `SaleScreen`, `recipes/cost/page.tsx`, `MaterialsNormsScreen`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06842105263157895 - nodes in this community are weakly interconnected._
- **Why does `Предметная область` connect `Предметная область` to `Операционные расходы`, `README.md`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `SalesJournalScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14461538461538462 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `SalesJournalScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `entityNameRowClassName`, `finished-goods.ts`, `PageFrame`, `SummaryScreen.tsx`, `index.ts`, `HrFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `production-fact.ts`, `useDocumentStore`, `MaterialReceiptFormTable.tsx`, `hr.ts`, `summary.ts`, `ProductionJournalScreen.tsx`, `TransportSummaryScreen.tsx`, `PlanningScreen.tsx`, `ProductionPlanScreen.tsx`, `SaleScreen.tsx`, `next`, `ProductionEntryFormTable.tsx`, `sales-fact.ts`, `sales.ts`, `TransportFactScreen.tsx`, `SaleScreen`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08283730158730158 - nodes in this community are weakly interconnected._