# Graph Report - food-proto  (2026-11-10)

## Corpus Check
- 271 files · ~159,798 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2521 nodes · 9902 edges · 100 communities (93 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ce87874`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RecipePrint.tsx
- SaleScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- opex/paths.ts
- sales-fact.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- monthKeyFromDate
- sales-plan.ts
- cashflow.ts
- FinishedProductsScreen.tsx
- mock-materials.ts
- SalesJournalScreen.tsx
- movement-plan.ts
- ProductionJournalFactTable.tsx
- production-plan.ts
- IconChevronDown
- Флоу товара
- keepWithNext
- FinishedGoodsFactScreen.tsx
- Cells.tsx
- RecipeJournalsTable.tsx
- entityNameRowClassName
- production-fact.ts
- FinishedGoodsMonthScreen.tsx
- cashflow/paths.ts
- PageFrame
- document.ts
- SaleFormTable.tsx
- index.ts
- AppShell.tsx
- flow.md
- resolveMaterialMonth
- SummaryScreen.tsx
- derivatives.ts
- Отчет общий сырья
- MaterialJournalScreen.tsx
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- ProductionJournalFactScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SalesFactTable.tsx
- RoleProvider.tsx
- inputs/README.md
- next
- FinishedGoodsFactTable.tsx
- SummaryTable.tsx
- Отчет общий движения производных
- TableNumber
- PlanningScreen.tsx
- transport.ts
- Себестоимость готовой продукции
- use-materials.ts
- DerivativesScreen.tsx
- credit-resources/paths.ts
- DerivativeMovementSummaryTable.tsx
- MaterialReceiptFormTable.tsx
- ProductionEntryScreen.tsx
- operating-expense.ts
- ProductionPlanScreen.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- DerivativeFormTable.tsx
- Отчет подневный продаж
- materials/paths.ts
- derivative-movement/paths.ts
- sales.ts
- mock-opex.ts
- finished-product-cost.ts
- CashflowFactScreen.tsx
- README.md
- MaterialsSummaryTable.tsx
- initialCashBalance
- AGENTS.md
- Операционные расходы
- Движение готовой продукции
- Движение производных
- PlanRedirect.tsx
- IconFullscreen
- SaleScreen
- useOpenCategories
- recipes/new/page.tsx
- MaterialUnit

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 116 edges
2. `next` - 108 edges
3. `PageFrame()` - 105 edges
4. `react` - 82 edges
5. `useOpex()` - 77 edges
6. `entityNameRowClassName()` - 74 edges
7. `ColumnLabel()` - 72 edges
8. `useRole()` - 69 edges
9. `keepWithNext()` - 65 edges
10. `planMonthOpen()` - 62 edges

## Surprising Connections (you probably didn't know these)
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Верхний блок сводки` --references--> `monthInterestAmounts()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts
- `Движение денежных средств` --references--> `initialCashBalance()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts

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

## Communities (100 total, 7 thin omitted)

### Community 0 - "RecipePrint.tsx"
Cohesion: 0.27
Nodes (14): derivativeWorkshopById(), warehouseIdForWorkshop(), componentDraftKey(), derivativePrintModel(), draftsFromSavedLines(), formatPrintPercent(), GroupRows(), lineFromDraft() (+6 more)

### Community 1 - "SaleScreen.tsx"
Cohesion: 0.22
Nodes (22): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), SaleRejection, emptySaleLineDraft(), rowMetrics(), initialDrafts(), lineDraftFromSale() (+14 more)

### Community 2 - "products.ts"
Cohesion: 0.06
Nodes (83): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+75 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (34): buildRow(), costForQuantity(), DerivativeMovementMonthView, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection, derivativeOpeningsList() (+26 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (38): mockCreditors, mockCreditResourceMonths, mockInitialCashBalance, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+30 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.19
Nodes (20): Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal() (+12 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (24): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение кредитных ресурсов, Отчет общий (производство), Отчет подневный (производство), Период и ассортимент (+16 more)

### Community 7 - "materials.ts"
Cohesion: 0.08
Nodes (46): MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+38 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "opex/paths.ts"
Cohesion: 0.08
Nodes (36): OpexGroupFactPage(), metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), dayHref(), monthHref(), OPEX_GROUP_BASE_HREF (+28 more)

### Community 11 - "sales-fact.ts"
Cohesion: 0.13
Nodes (32): Удаление, UnitCost, Product, PrototypeDocument, productCostPerPiece(), averageAmount(), dayGridProducts(), periodGridCategories() (+24 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.11
Nodes (50): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatMaterialWeightPair(), formatQuantity(), formatQuantityDraft(), MATERIAL_NAME_ERROR, MATERIAL_NORM_ERROR (+42 more)

### Community 14 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (35): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), monthKeyFromDate(), planMonthOpen() (+27 more)

### Community 15 - "sales-plan.ts"
Cohesion: 0.15
Nodes (25): costWithVat(), priceAverage(), rangePlanProduction(), rangePlanSales(), amountExVat(), amountWithVat(), productionLineAmountExVat(), productionPlanLineMetrics (+17 more)

### Community 16 - "cashflow.ts"
Cohesion: 0.26
Nodes (18): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+10 more)

### Community 17 - "FinishedProductsScreen.tsx"
Cohesion: 0.23
Nodes (11): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductEditScreen(), FinishedProductsScreen() (+3 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "SalesJournalScreen.tsx"
Cohesion: 0.16
Nodes (21): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, workingSalesInMonth(), parseSalesFactQuery(), parseSalesJournalQuery() (+13 more)

### Community 20 - "movement-plan.ts"
Cohesion: 0.14
Nodes (31): bookClosingPiecesForProduct(), closingStockPieces(), FinishedGoodsOpeningRejection, hasStoredInventoryLine(), isOpeningPieces(), openingPiecesForProduct(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+23 more)

### Community 21 - "ProductionJournalFactTable.tsx"
Cohesion: 0.13
Nodes (22): ProductionJournalFactDayView, ProductionJournalFactGroup, ProductionJournalFactTotals, ArrowButton(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+14 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.10
Nodes (34): Архитектура прототипа, Единицы, Слои, Чего не делать, commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, plannedProductionVolumePieces() (+26 more)

### Community 23 - "IconChevronDown"
Cohesion: 0.16
Nodes (31): LineRows(), WorkshopBlock(), SectionBlock(), CategoryBlock(), FinishedGoodsMonthTable(), groupEndClass(), ProductRow(), CategoryBlock() (+23 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.24
Nodes (16): ColumnHeadings(), columnsOf(), MetricCell(), Pieces(), ProductionFactTable(), ProductSideCells(), ProductVarianceCells(), SectionHeading() (+8 more)

### Community 26 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.13
Nodes (26): defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass(), WEEKDAY_LABELS (+18 more)

### Community 27 - "Cells.tsx"
Cohesion: 0.13
Nodes (20): formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), parseInterestRate(), parseHours() (+12 more)

### Community 28 - "RecipeJournalsTable.tsx"
Cohesion: 0.25
Nodes (12): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+4 more)

### Community 29 - "entityNameRowClassName"
Cohesion: 0.12
Nodes (24): creditResourcesMonthView, CreditResourcesFactScreen(), inputKind(), CreditResourcesPlanScreen(), inputKind(), COLUMN_GROUPS, COLUMN_KIND, columnEdge() (+16 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.16
Nodes (28): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+20 more)

### Community 31 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.27
Nodes (13): metadata, MovementPage(), activeCategories(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle() (+5 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.23
Nodes (10): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF (+2 more)

### Community 33 - "PageFrame"
Cohesion: 0.12
Nodes (55): react, HR_DEPARTMENT_LABELS, hrDayOutsourcingValue(), hrDayStaffValue(), salesPlanForMonth(), salesPlanTotals, transportHireDayValue(), transportOwnDayValue() (+47 more)

### Community 34 - "document.ts"
Cohesion: 0.06
Nodes (34): Creditor, CreditResourceMonthLine, DeletableRecord, DERIVATIVE_UNITS, DERIVATIVE_WORKSHOPS, FinishedGoodsNormLine, FinishedGoodsOpeningLine, HR_DEPARTMENT_IDS (+26 more)

### Community 35 - "SaleFormTable.tsx"
Cohesion: 0.12
Nodes (26): ProductCategory, EntryFormGroup, formatKopecks(), GridInput(), RowCell(), buildGroups(), CategoryBlock(), COLUMN_KIND (+18 more)

### Community 36 - "index.ts"
Cohesion: 0.07
Nodes (82): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMNS, COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+74 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.10
Nodes (29): PRODUCTION_SECTION_TITLE, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref(), SECTION_HOME, RoleGate(), NavSectionId (+21 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "resolveMaterialMonth"
Cohesion: 0.14
Nodes (22): useDocumentStore(), derivativeMovementMonth(), DerivativeMovementInventoryScreen(), DerivativeMovementInventoryTable(), DerivativeMovementSummaryScreen(), DerivativeMovementSummaryTable(), derivativeMovementInventoryHref(), derivativeMovementSummaryHref() (+14 more)

### Community 40 - "SummaryScreen.tsx"
Cohesion: 0.23
Nodes (16): monthsInRange(), SummaryLens, productionFactHref(), productionFactPageTitle(), Workspace(), open(), monthFieldClassName, primaryButtonClassName (+8 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.12
Nodes (33): activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativesList(), isDerivativeUnit(), isDerivativeWorkshopId() (+25 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "MaterialJournalScreen.tsx"
Cohesion: 0.27
Nodes (11): Свод, costExVat(), materialById(), materialConsumptionPrice(), materialPlanPrice(), materialReceiptsInMonth(), planLineFor(), priceOf() (+3 more)

### Community 45 - "hr.ts"
Cohesion: 0.06
Nodes (63): HR_SHOP_DEPARTMENT_IDS, HrDayFact, HrDayOutsourcingLine, HrDepartmentId, HrMonthFact, HrMonthFactStaffLine, HrMonthPlan, HrMonthPlanOutsourcingLine (+55 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.15
Nodes (33): isMonthKey(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), emptyPlanSide(), emptyRangeView() (+25 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.12
Nodes (41): monthInterestAmounts(), percentHundredths(), vatPercentHundredths(), planPhase, actualRangeSummary(), applyFactScale(), applyPlanScale(), applySummaryLens() (+33 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.15
Nodes (16): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), parseDerivativeWorkshopQuery(), parseRecipesCostMonthQuery() (+8 more)

### Community 50 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.16
Nodes (18): metadata, ProductionFactPage(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), DayDateControl(), onKeyDown() (+10 more)

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

### Community 57 - "SalesFactTable.tsx"
Cohesion: 0.17
Nodes (24): SalesFactDayView, SalesFactGroup, SalesFactTotals, ProductUnitPrice(), ArrowButton(), AverageCost(), CategoryBlock(), COLUMN_KIND (+16 more)

### Community 58 - "RoleProvider.tsx"
Cohesion: 0.06
Nodes (51): metadata, onest, RootLayout(), unbounded, metadata, SettingsPage(), clearDocument(), DOCUMENT_STORAGE_KEY (+43 more)

### Community 60 - "next"
Cohesion: 0.08
Nodes (31): nextConfig, next, generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata (+23 more)

### Community 61 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.15
Nodes (21): FinishedGoodsDayView, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND (+13 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (32): SalesPlanRejection, SummaryGroup, SummaryRow, SummarySide, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock() (+24 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "TableNumber"
Cohesion: 0.28
Nodes (15): RowCell(), TotalsCell(), CategoryBlock(), editableFieldNear(), InventoryTable(), ProductRow(), RowCell(), TotalsCell() (+7 more)

### Community 65 - "PlanningScreen.tsx"
Cohesion: 0.17
Nodes (19): metadata, PlanningPage(), missingProductionPlanProducts(), activeProducts(), missingPlanProducts(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref() (+11 more)

### Community 66 - "transport.ts"
Cohesion: 0.12
Nodes (31): HireSeed, isOccurredOn(), TransportHireKind, operatingExpenseOtherGroupDayView(), operatingExpenseOtherGroupMonthView(), hireAmount(), hirePlanLine(), isMoney() (+23 more)

### Community 68 - "use-materials.ts"
Cohesion: 0.19
Nodes (25): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+17 more)

### Community 69 - "DerivativesScreen.tsx"
Cohesion: 0.18
Nodes (15): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes(), derivativeSections() (+7 more)

### Community 70 - "credit-resources/paths.ts"
Cohesion: 0.16
Nodes (15): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+7 more)

### Community 71 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.07
Nodes (38): DerivativeMovementRow, DerivativeMovementSection, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS (+30 more)

### Community 72 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.10
Nodes (39): metadata, NewMaterialReceiptPage(), Material, MATERIAL_GROUPS, MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), DocumentForm() (+31 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.10
Nodes (40): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), defaultProductionEntryDay() (+32 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (78): isDeletionMark(), OpexGroupCode, deleteHrPosition(), setHrDayStaff(), activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+70 more)

### Community 75 - "ProductionPlanScreen.tsx"
Cohesion: 0.10
Nodes (30): metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), ProductionEntry, productionEntryPieces() (+22 more)

### Community 79 - "DerivativeFormTable.tsx"
Cohesion: 0.16
Nodes (14): buildCandidateGroups(), CandidateGroup, CandidateRow, CandidateRowView(), DerivativeComponentKind, DerivativeCompositionEditor(), DerivativeFormEmpty(), DerivativeFormTable() (+6 more)

### Community 81 - "materials/paths.ts"
Cohesion: 0.10
Nodes (24): MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+16 more)

### Community 82 - "derivative-movement/paths.ts"
Cohesion: 0.15
Nodes (16): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+8 more)

### Community 83 - "sales.ts"
Cohesion: 0.31
Nodes (15): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), PLAN_HORIZON_MONTHS (+7 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (45): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), isShopPositionId(), MOCK_MONTHS (+37 more)

### Community 85 - "finished-product-cost.ts"
Cohesion: 0.21
Nodes (15): buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode, finishedProductCostMonth(), FinishedProductCostMonthView (+7 more)

### Community 86 - "CashflowFactScreen.tsx"
Cohesion: 0.14
Nodes (20): CashflowFactScreen(), inputKind(), CashflowSummaryScreen(), toggle(), defaultOpenIds(), cashflowFactHref(), cashflowSummaryHref(), monthHref() (+12 more)

### Community 87 - "README.md"
Cohesion: 0.27
Nodes (6): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула, Запуск, Куда смотреть

### Community 88 - "MaterialsSummaryTable.tsx"
Cohesion: 0.09
Nodes (37): DerivativeNormField, DerivativeRow(), DerivativeMovementPlanScreen(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), derivativeNormRangeInvalid() (+29 more)

### Community 89 - "initialCashBalance"
Cohesion: 0.67
Nodes (3): Поток данных, Движение денежных средств, initialCashBalance()

### Community 90 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 91 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 92 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 93 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

### Community 94 - "PlanRedirect.tsx"
Cohesion: 0.29
Nodes (9): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref(), PlanRedirect() (+1 more)

### Community 95 - "IconFullscreen"
Cohesion: 0.33
Nodes (11): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+3 more)

### Community 96 - "SaleScreen"
Cohesion: 0.28
Nodes (7): metadata, SalePage(), metadata, NewSalePage(), defaultSaleDay(), NEW_SALE_TITLE, SaleScreen()

### Community 97 - "useOpenCategories"
Cohesion: 0.33
Nodes (5): buildGroups(), groupTotals(), ProductionEntryFormTable(), TotalCell(), useOpenCategories()

### Community 98 - "recipes/new/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, NewDerivativePage(), DerivativeCreateScreen(), NEW_DERIVATIVE_TITLE

### Community 99 - "MaterialUnit"
Cohesion: 0.50
Nodes (4): MaterialUnit, MaterialWeightPair, MaterialMovementRow, MaterialMovementTotals

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 529 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `SaleScreen.tsx`, `products.ts`, `package.json`, `opex/paths.ts`, `DerivativeCreateScreen.tsx`, `monthKeyFromDate`, `FinishedProductsScreen.tsx`, `SalesJournalScreen.tsx`, `IconChevronDown`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `entityNameRowClassName`, `FinishedGoodsMonthScreen.tsx`, `cashflow/paths.ts`, `PageFrame`, `index.ts`, `AppShell.tsx`, `resolveMaterialMonth`, `SummaryScreen.tsx`, `MaterialJournalScreen.tsx`, `recipes/paths.ts`, `ProductionJournalFactScreen.tsx`, `RoleProvider.tsx`, `PlanningScreen.tsx`, `DerivativesScreen.tsx`, `credit-resources/paths.ts`, `DerivativeMovementSummaryTable.tsx`, `MaterialReceiptFormTable.tsx`, `ProductionEntryScreen.tsx`, `ProductionPlanScreen.tsx`, `materials/paths.ts`, `derivative-movement/paths.ts`, `CashflowFactScreen.tsx`, `MaterialsSummaryTable.tsx`, `PlanRedirect.tsx`, `SaleScreen`, `recipes/new/page.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06030855539971949 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `SaleScreen.tsx`, `sales-fact.ts`, `sales-plan.ts`, `SalesJournalScreen.tsx`, `IconChevronDown`, `FinishedGoodsFactScreen.tsx`, `entityNameRowClassName`, `production-fact.ts`, `FinishedGoodsMonthScreen.tsx`, `PageFrame`, `index.ts`, `resolveMaterialMonth`, `SummaryScreen.tsx`, `MaterialJournalScreen.tsx`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `ProductionJournalFactScreen.tsx`, `PlanningScreen.tsx`, `DerivativeMovementSummaryTable.tsx`, `MaterialReceiptFormTable.tsx`, `ProductionEntryScreen.tsx`, `ProductionPlanScreen.tsx`, `sales.ts`, `CashflowFactScreen.tsx`, `MaterialsSummaryTable.tsx`, `PlanRedirect.tsx`, `SaleScreen`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11261261261261261 - nodes in this community are weakly interconnected._
- **Why does `PrototypeDocument` connect `sales-fact.ts` to `RecipePrint.tsx`, `SaleScreen.tsx`, `products.ts`, `derivative-movement.ts`, `mock-document.ts`, `derivative-cost.ts`, `materials.ts`, `sales-plan.ts`, `cashflow.ts`, `SalesJournalScreen.tsx`, `movement-plan.ts`, `production-plan.ts`, `production-fact.ts`, `document.ts`, `derivatives.ts`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `RoleProvider.tsx`, `transport.ts`, `ProductionEntryScreen.tsx`, `operating-expense.ts`, `ProductionPlanScreen.tsx`, `sales.ts`, `finished-product-cost.ts`, `initialCashBalance`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `mock-document.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04830917874396135 - nodes in this community are weakly interconnected._