# Graph Report - food-proto  (2026-11-10)

## Corpus Check
- 271 files · ~159,767 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2521 nodes · 9902 edges · 93 communities (86 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c9bd9ff1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- RecipePrint.tsx
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- credit-resources.ts
- transportMonthView
- compilerOptions
- DerivativeCreateScreen.tsx
- planMonthOpen
- sales-plan.ts
- cashflow.ts
- recipes/paths.ts
- mock-materials.ts
- SaleScreen.tsx
- EntryForm
- index.ts
- production-plan.ts
- derivative-movement/plan/page.tsx
- Флоу товара
- ProductionFactTable.tsx
- FinishedGoodsFactScreen.tsx
- layout.tsx
- Icons.tsx
- entityNameRowClassName
- production-fact.ts
- FinishedGoodsMonthScreen.tsx
- cashflow/paths.ts
- TransportFactScreen.tsx
- document.ts
- ProductionEntryFormTable.tsx
- useDocumentStore
- AppShell.tsx
- flow.md
- monthKeyFromDate
- SummaryScreen.tsx
- derivatives.ts
- Отчет общий сырья
- MaterialDocumentScreen.tsx
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- summary.ts
- finished/cost/page.tsx
- ProductionJournalFactScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- keepWithNext
- roles.ts
- inputs/README.md
- next
- SummaryTable.tsx
- Отчет общий движения производных
- FinishedGoodsMonthTable.tsx
- PlanningScreen.tsx
- use-opex.ts
- Себестоимость готовой продукции
- use-materials.ts
- DocumentProvider.tsx
- credit-resources/paths.ts
- TransportSummaryScreen.tsx
- MaterialReceiptFormTable.tsx
- production-journal.ts
- operating-expense.ts
- ProductionJournalScreen.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- RecipeComponentSearch
- Отчет подневный продаж
- materials/text.ts
- derivative-movement/paths.ts
- access.ts
- mock-opex.ts
- production/paths.ts
- SummaryHeadlineTable.tsx
- README.md
- MaterialsSummaryTable.tsx
- initialCashBalance
- AGENTS.md
- Операционные расходы
- Движение готовой продукции
- Движение производных

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

## Communities (93 total, 7 thin omitted)

### Community 0 - "RecipePrint.tsx"
Cohesion: 0.14
Nodes (26): react-dom, derivativeWorkshopById(), warehouseIdForWorkshop(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths() (+18 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.25
Nodes (12): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), defaultProductionEntryDay(), PRODUCTION_JOURNAL_TITLE, emptyProductionEntryLineDraft(), entryFormProducts() (+4 more)

### Community 2 - "products.ts"
Cohesion: 0.11
Nodes (41): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+33 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (33): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+25 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (40): mockCreditors, mockCreditResourceMonths, mockInitialCashBalance, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+32 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.08
Nodes (47): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+39 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (24): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение кредитных ресурсов, Отчет общий (производство), Отчет подневный (производство), Период и ассортимент (+16 more)

### Community 7 - "materials.ts"
Cohesion: 0.09
Nodes (47): costExVat(), MaterialGroupId, MaterialReceiptLine, MaterialUnit, MaterialWeightPair, addMoney(), addMoneyNullable(), bookClosingQuantity() (+39 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "credit-resources.ts"
Cohesion: 0.18
Nodes (34): activeCreditors(), addCreditor(), addCreditorRejection(), CreditFieldRejection, CreditMonthField, CreditMonthViewOptions, creditorsList(), creditorVisibleInMonth() (+26 more)

### Community 11 - "transportMonthView"
Cohesion: 0.25
Nodes (9): hireAmount(), hirePlanLine(), ownDayFuelAmountExVat(), ownDayKmThousandths(), ownPlanAmountExVat(), ownPlanCostPerKmExVat(), previousDay(), transportMonthView (+1 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.12
Nodes (48): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), formatQuantity(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent() (+40 more)

### Community 14 - "planMonthOpen"
Cohesion: 0.08
Nodes (50): metadata, ProductionPlanPage(), activeCategories(), setDerivativeNormRejection(), FinishedGoodsOpeningRejection, isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+42 more)

### Community 15 - "sales-plan.ts"
Cohesion: 0.15
Nodes (22): metadata, OpexSummaryPage(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), isPrice(), isVolume() (+14 more)

### Community 16 - "cashflow.ts"
Cohesion: 0.24
Nodes (19): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+11 more)

### Community 17 - "recipes/paths.ts"
Cohesion: 0.11
Nodes (24): RecipesCostDetailPage(), metadata, RecipesCostPage(), FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), metadata (+16 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (77): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+69 more)

### Community 20 - "EntryForm"
Cohesion: 0.22
Nodes (12): ProductionEntryRejection, productionJournalHref(), piecesForAmount(), rowMetrics(), EntryForm(), parsedLines(), save(), entryFormCategories() (+4 more)

### Community 21 - "index.ts"
Cohesion: 0.09
Nodes (46): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+38 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): commitDocumentUpdate(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+16 more)

### Community 23 - "derivative-movement/plan/page.tsx"
Cohesion: 0.50
Nodes (4): DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_PLAN_TITLE, parseDerivativeMovementPlanQuery()

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 26 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.11
Nodes (30): DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay(), resolveMonth(), viewLinkClass() (+22 more)

### Community 27 - "layout.tsx"
Cohesion: 0.25
Nodes (7): metadata, onest, RootLayout(), unbounded, writeRole(), RoleProvider(), roleById()

### Community 28 - "Icons.tsx"
Cohesion: 0.09
Nodes (44): WorkshopBlock(), WorkshopBlock(), WorkshopBlock(), WorkshopCell(), GroupBlock(), CategoryBlock(), CategoryBlock(), CategoryBlock() (+36 more)

### Community 29 - "entityNameRowClassName"
Cohesion: 0.07
Nodes (61): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), creditResourcesMonthView, HrDepartmentId, HR_DEPARTMENT_LABELS, hrDayOutsourcingValue() (+53 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.10
Nodes (38): periodReferencedProductIds(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts() (+30 more)

### Community 31 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.12
Nodes (24): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+16 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.23
Nodes (10): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF (+2 more)

### Community 33 - "TransportFactScreen.tsx"
Cohesion: 0.33
Nodes (10): metadata, OpexTransportFactPage(), defaultSalesFactDay(), transportHireDayValue(), transportOwnDayValue(), OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref(), resolveDay() (+2 more)

### Community 34 - "document.ts"
Cohesion: 0.06
Nodes (33): Creditor, CreditResourceMonthLine, DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNormLine, FinishedGoodsOpeningLine, HR_DEPARTMENT_IDS, HrDayFact (+25 more)

### Community 35 - "ProductionEntryFormTable.tsx"
Cohesion: 0.16
Nodes (19): ProductCategory, buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormRow (+11 more)

### Community 36 - "useDocumentStore"
Cohesion: 0.11
Nodes (33): useDocumentStore(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell(), CostRow() (+25 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.11
Nodes (25): OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, opexGroupFactHrefPath(), opexGroupHrefPath(), opexGroupPlanHrefPath(), AppShell(), buildNavGroups(), buildOpexNav() (+17 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "monthKeyFromDate"
Cohesion: 0.08
Nodes (50): react, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage() (+42 more)

### Community 40 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (30): Home(), metadata, metadata, PlanPage(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens (+22 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.12
Nodes (31): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection (+23 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "MaterialDocumentScreen.tsx"
Cohesion: 0.14
Nodes (22): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), materialReceiptsInMonth() (+14 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (48): HR_SHOP_DEPARTMENT_IDS, HrDayOutsourcingLine, HrMonthPlanOutsourcingLine, HrMonthPlanStaffLine, activeHrPositions(), addHrPosition(), addHrPositionRejection(), averageSalary() (+40 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.08
Nodes (74): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+66 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.08
Nodes (64): Единицы, Удаление, UnitCost, monthInterestAmounts(), Product, SalesPlan, productCostPerPiece(), averageAmount() (+56 more)

### Community 49 - "finished/cost/page.tsx"
Cohesion: 0.32
Nodes (6): RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), parseRecipesFinishedCostMonthQuery(), RECIPES_FINISHED_COST_HREF, RECIPES_FINISHED_COST_TITLE

### Community 50 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.22
Nodes (13): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), ProductionJournalFactScreen(), resolveDay() (+5 more)

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

### Community 57 - "keepWithNext"
Cohesion: 0.13
Nodes (37): TotalCell(), ProductUnitPrice(), Pieces(), RowCell(), TotalCell(), TotalsCell(), TotalCell(), ArrowButton() (+29 more)

### Community 58 - "roles.ts"
Cohesion: 0.10
Nodes (25): metadata, SettingsPage(), readRole(), ROLE_STORAGE_KEY, ALL_EDIT, ALL_NAV_SECTIONS, DEFAULT_ROLE_ID, isRoleId() (+17 more)

### Community 60 - "next"
Cohesion: 0.09
Nodes (52): nextConfig, next, generateMetadata(), OpexGroupFactPage(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage() (+44 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.08
Nodes (35): costWithVat(), amountWithVat(), priceWithVatFromExVat(), SalesPlanRejection, SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR (+27 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.11
Nodes (38): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+30 more)

### Community 65 - "PlanningScreen.tsx"
Cohesion: 0.09
Nodes (40): metadata, OpexTransportPlanPage(), metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts() (+32 more)

### Community 66 - "use-opex.ts"
Cohesion: 0.10
Nodes (55): isDeletionMark(), isHrShopDepartmentId(), isOccurredOn(), isTransportHireKind(), deleteHrPosition(), isHeadcountThousandths(), isHours(), isMoney() (+47 more)

### Community 68 - "use-materials.ts"
Cohesion: 0.21
Nodes (24): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isVatPercent(), materialById() (+16 more)

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.17
Nodes (17): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+9 more)

### Community 70 - "credit-resources/paths.ts"
Cohesion: 0.14
Nodes (18): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+10 more)

### Community 71 - "TransportSummaryScreen.tsx"
Cohesion: 0.16
Nodes (15): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey, hireColumns() (+7 more)

### Community 72 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (37): Material, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormRow, EntryFormTotals (+29 more)

### Community 73 - "production-journal.ts"
Cohesion: 0.26
Nodes (17): ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection(), productionEntryByIdOrNull() (+9 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.07
Nodes (49): OpexGroupCode, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT, amountsForOtherLine(), buildOtherGroupView(), catalogCode() (+41 more)

### Community 75 - "ProductionJournalScreen.tsx"
Cohesion: 0.24
Nodes (13): metadata, ProductionJournalPage(), ProductionEntry, productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), productionEntryHref(), productionEntryNewHref() (+5 more)

### Community 79 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

### Community 81 - "materials/text.ts"
Cohesion: 0.15
Nodes (15): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, MaterialDocumentRejection, materialNormQuantity(), MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection (+7 more)

### Community 82 - "derivative-movement/paths.ts"
Cohesion: 0.19
Nodes (12): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE (+4 more)

### Community 83 - "access.ts"
Cohesion: 0.23
Nodes (11): RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref(), SECTION_HOME, ROLES_HREF (+3 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (49): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, isShopPositionId() (+41 more)

### Community 85 - "production/paths.ts"
Cohesion: 0.21
Nodes (11): metadata, ProductionFactPage(), metadata, ProductionPage(), NEW_PRODUCTION_ENTRY_TITLE, parseProductionFactQuery(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE (+3 more)

### Community 86 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 87 - "README.md"
Cohesion: 0.27
Nodes (6): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула, Запуск, Куда смотреть

### Community 88 - "MaterialsSummaryTable.tsx"
Cohesion: 0.06
Nodes (70): DerivativeMovementRow, DerivativeMovementSection, MaterialWarehouseMovement, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, derivativeNormRangeInvalid() (+62 more)

### Community 89 - "initialCashBalance"
Cohesion: 0.33
Nodes (6): Архитектура прототипа, Поток данных, Слои, Чего не делать, Движение денежных средств, initialCashBalance()

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

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 529 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `planMonthOpen`, `sales-plan.ts`, `recipes/paths.ts`, `SaleScreen.tsx`, `derivative-movement/plan/page.tsx`, `FinishedGoodsFactScreen.tsx`, `layout.tsx`, `Icons.tsx`, `entityNameRowClassName`, `FinishedGoodsMonthScreen.tsx`, `cashflow/paths.ts`, `TransportFactScreen.tsx`, `AppShell.tsx`, `monthKeyFromDate`, `SummaryScreen.tsx`, `derivatives.ts`, `MaterialDocumentScreen.tsx`, `finished/cost/page.tsx`, `ProductionJournalFactScreen.tsx`, `roles.ts`, `PlanningScreen.tsx`, `credit-resources/paths.ts`, `TransportSummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `materials/text.ts`, `derivative-movement/paths.ts`, `access.ts`, `production/paths.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RecipePrint.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `planMonthOpen`, `sales-plan.ts`, `SaleScreen.tsx`, `EntryForm`, `FinishedGoodsFactScreen.tsx`, `entityNameRowClassName`, `production-fact.ts`, `FinishedGoodsMonthScreen.tsx`, `TransportFactScreen.tsx`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `ProductionJournalFactScreen.tsx`, `next`, `PlanningScreen.tsx`, `TransportSummaryScreen.tsx`, `production-journal.ts`, `ProductionJournalScreen.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11207729468599034 - nodes in this community are weakly interconnected._
- **Why does `PrototypeDocument` connect `derivative-cost.ts` to `RecipePrint.tsx`, `ProductionEntryScreen.tsx`, `products.ts`, `derivative-movement.ts`, `mock-document.ts`, `materials.ts`, `credit-resources.ts`, `sales-plan.ts`, `cashflow.ts`, `SaleScreen.tsx`, `production-plan.ts`, `production-fact.ts`, `document.ts`, `derivatives.ts`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `use-opex.ts`, `DocumentProvider.tsx`, `production-journal.ts`, `operating-expense.ts`, `ProductionJournalScreen.tsx`, `initialCashBalance`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._