# Graph Report - food-proto  (2026-11-06)

## Corpus Check
- 265 files · ~155,765 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2466 nodes · 9536 edges · 79 communities (72 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `47efe34b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- FinishedProductEditScreen.tsx
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
- ratioRound
- compilerOptions
- DerivativeCreateScreen.tsx
- monthKeyFromDate
- opex/paths.ts
- MaterialsPlanScreen.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- SaleScreen.tsx
- next
- index.ts
- production-plan.ts
- Icons.tsx
- Флоу товара
- keepWithNext
- ProductionJournalFactScreen.tsx
- RoleProvider.tsx
- movementRow
- PageFrame
- production-fact.ts
- FinishedGoodsMonthScreen.tsx
- cashflow/paths.ts
- TransportFactScreen
- document.ts
- sales.ts
- DerivativeCostTable.tsx
- AppShell.tsx
- flow.md
- credit-resources/paths.ts
- SummaryScreen.tsx
- derivatives.ts
- Отчет общий сырья
- useRole
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- sales-plan.ts
- recipes/paths.ts
- sales-fact/text.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SalesJournalScreen.tsx
- settings/page.tsx
- inputs/README.md
- sales/page.tsx
- AddProductDialog
- SummaryTable.tsx
- Отчет общий движения производных
- use-opex.ts
- Себестоимость готовой продукции
- FinishedProductEditScreen
- DocumentProvider.tsx
- SaleFormTable.tsx
- useDocumentStore
- operating-expense.ts
- MaterialReceiptFormTable.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- DerivativeCompositionEditor
- Отчет подневный продаж
- mock-opex.ts
- Как собрать первый прототип

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 110 edges
2. `next` - 102 edges
3. `PageFrame()` - 99 edges
4. `react` - 79 edges
5. `entityNameRowClassName()` - 72 edges
6. `ColumnLabel()` - 66 edges
7. `useOpex()` - 65 edges
8. `useRole()` - 65 edges
9. `keepWithNext()` - 65 edges
10. `IconChevronDown()` - 61 edges

## Surprising Connections (you probably didn't know these)
- `Движение денежных средств` --references--> `initialCashBalance()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Верхний блок сводки` --references--> `monthInterestAmounts()`  [INFERRED]
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

## Communities (79 total, 7 thin omitted)

### Community 0 - "FinishedProductEditScreen.tsx"
Cohesion: 0.20
Nodes (21): ProductRecipeRejection, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), componentDraftKey(), DerivativeLineDraft, derivativePrintModel(), draftsFromSavedLines(), formatPrintKilograms() (+13 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (71): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+63 more)

### Community 2 - "products.ts"
Cohesion: 0.07
Nodes (57): Home(), metadata, metadata, PlanningArchivePage(), metadata, PlanPage(), addCategory(), categoryNameRejection() (+49 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.07
Nodes (59): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, buildRow(), costForQuantity() (+51 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (36): mockCreditors, mockCreditResourceMonths, mockInitialCashBalance, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+28 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (42): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+34 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Слои, Чего не делать, HR (`HR`), Блоки (+35 more)

### Community 7 - "materials.ts"
Cohesion: 0.12
Nodes (44): MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine(), isMaterialGroupId() (+36 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "credit-resources.ts"
Cohesion: 0.11
Nodes (51): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+43 more)

### Community 11 - "ratioRound"
Cohesion: 0.13
Nodes (27): averageSalary(), dayFactsInMonth(), emptySide(), factShopHeadcountThousandths(), factShopSalaryExVat(), hrMonthView, hrPositionsForDepartment(), outsourcingAmountExVat() (+19 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.09
Nodes (51): DerivativePage(), metadata, metadata, NewDerivativePage(), isDerivativeWorkshopId(), activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams() (+43 more)

### Community 14 - "monthKeyFromDate"
Cohesion: 0.08
Nodes (55): metadata, PlanningPage(), activeCategories(), missingProductionPlanProducts(), activeProducts(), maxSaleOccurredOn(), createRejection(), missingPlanProducts() (+47 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.08
Nodes (30): metadata, OpexHrPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage(), metadata, OpexSummaryPage() (+22 more)

### Community 16 - "MaterialsPlanScreen.tsx"
Cohesion: 0.12
Nodes (19): MaterialsPlanPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialMovementRow (+11 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.13
Nodes (22): react-dom, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref(), RECIPES_FINISHED_TITLE (+14 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "SaleScreen.tsx"
Cohesion: 0.23
Nodes (21): saleLineAmountWithVat(), saleLinePriceWithVat(), formatKopecks(), formatKopecks(), emptySaleLineDraft(), rowMetrics(), initialDrafts(), lineDraftFromSale() (+13 more)

### Community 20 - "next"
Cohesion: 0.09
Nodes (29): nextConfig, next, MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata (+21 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (68): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND (+60 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): commitDocumentUpdate(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+16 more)

### Community 23 - "Icons.tsx"
Cohesion: 0.06
Nodes (55): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeRow() (+47 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.06
Nodes (94): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, TotalCell(), CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell() (+86 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.06
Nodes (56): dayTotals(), defaultProductionJournalFactDay(), ProductionJournalFactDayView, productionJournalFactGridProducts(), ProductionJournalFactGroup, productionJournalFactGroups(), productionJournalFactMonth(), ProductionJournalFactTotals (+48 more)

### Community 27 - "RoleProvider.tsx"
Cohesion: 0.10
Nodes (29): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+21 more)

### Community 28 - "movementRow"
Cohesion: 0.17
Nodes (20): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+12 more)

### Community 29 - "PageFrame"
Cohesion: 0.07
Nodes (87): react, metadata, OpexHrPlanPage(), creditResourcesMonthView, HR_DEPARTMENT_LABELS, CashflowFactScreen(), inputKind(), CashflowSummaryScreen() (+79 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.15
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 31 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.12
Nodes (26): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+18 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.23
Nodes (10): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF (+2 more)

### Community 33 - "TransportFactScreen"
Cohesion: 0.17
Nodes (14): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), dayHref(), OPEX_HR_FACT_TITLE (+6 more)

### Community 34 - "document.ts"
Cohesion: 0.08
Nodes (27): Creditor, CreditResourceMonthLine, DeletableRecord, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpeningLine, HR_DEPARTMENT_IDS, HrDayOutsourcingLine (+19 more)

### Community 35 - "sales.ts"
Cohesion: 0.34
Nodes (14): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales() (+6 more)

### Community 36 - "DerivativeCostTable.tsx"
Cohesion: 0.09
Nodes (38): editableFieldNear(), ProductRow(), editableFieldNear(), ProductRow(), ProductRow(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass() (+30 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.08
Nodes (38): Поток данных, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, MATERIALS_SECTION_TITLE, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER (+30 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "credit-resources/paths.ts"
Cohesion: 0.14
Nodes (18): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+10 more)

### Community 40 - "SummaryScreen.tsx"
Cohesion: 0.18
Nodes (26): Единицы, actualRangeSummary(), calendarDays(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), rangeSummary(), summaryForLens() (+18 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.13
Nodes (31): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), derivativeCompositionLines() (+23 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "useRole"
Cohesion: 0.12
Nodes (29): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, isPrice(), materialReceiptById(), materialReceiptRejection() (+21 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (46): isShopPositionId(), HR_SHOP_DEPARTMENT_IDS, HrDepartmentId, HrMonthFact, HrMonthPlanOutsourcingLine, isHrShopDepartmentId(), activeHrPositions(), addHrPosition() (+38 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.07
Nodes (85): Удаление, Product, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics() (+77 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "sales-plan.ts"
Cohesion: 0.06
Nodes (75): costWithVat(), UnitCost, monthInterestAmounts(), SalesPlan, productCostPerPiece(), amountWithVat(), averageAmount(), percentHundredths() (+67 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.15
Nodes (20): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), derivativeCostMonth(), finishedProductCostMonth() (+12 more)

### Community 50 - "sales-fact/text.ts"
Cohesion: 0.18
Nodes (16): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), parseDecimal(), roundKopecksToRubles(), parseCreditMoney(), parseInterestRate() (+8 more)

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

### Community 57 - "SalesJournalScreen.tsx"
Cohesion: 0.13
Nodes (25): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), Sale, defaultSaleDay() (+17 more)

### Community 58 - "settings/page.tsx"
Cohesion: 0.32
Nodes (4): metadata, SettingsPage(), SETTINGS_HREF, SETTINGS_TITLE

### Community 60 - "sales/page.tsx"
Cohesion: 0.47
Nodes (5): metadata, SalesFactPage(), parseSalesFactQuery(), SALES_FACT_TITLE, SalesFactScreen()

### Community 61 - "AddProductDialog"
Cohesion: 0.67
Nodes (3): submit(), AddProductDialog(), submit()

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.16
Nodes (20): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+12 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 66 - "use-opex.ts"
Cohesion: 0.11
Nodes (45): HrTaxRatesMonth, isDeletionMark(), isOccurredOn(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportCarrier, TransportHireMonthPlan, TransportHireMonthPlanLine (+37 more)

### Community 68 - "FinishedProductEditScreen"
Cohesion: 0.67
Nodes (3): FinishedProductRecipePage(), metadata, FinishedProductEditScreen()

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.17
Nodes (19): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+11 more)

### Community 72 - "SaleFormTable.tsx"
Cohesion: 0.13
Nodes (21): ProductCategory, GridInput(), EntryFormGroup, GridInput(), buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey (+13 more)

### Community 73 - "useDocumentStore"
Cohesion: 0.25
Nodes (13): useDocumentStore(), ProductRecipeLine, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths() (+5 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.08
Nodes (41): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+33 more)

### Community 75 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (52): toggle(), LineRows(), WorkshopBlock(), WorkshopBlock(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS (+44 more)

### Community 79 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (44): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, MOCK_MONTHS (+36 more)

### Community 88 - "Как собрать первый прототип"
Cohesion: 0.50
Nodes (4): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 526 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FinishedProductEditScreen.tsx`, `ProductionEntryScreen.tsx`, `products.ts`, `derivative-movement.ts`, `package.json`, `DerivativeCreateScreen.tsx`, `monthKeyFromDate`, `opex/paths.ts`, `MaterialsPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `SaleScreen.tsx`, `index.ts`, `ProductionJournalFactScreen.tsx`, `RoleProvider.tsx`, `PageFrame`, `FinishedGoodsMonthScreen.tsx`, `cashflow/paths.ts`, `TransportFactScreen`, `AppShell.tsx`, `credit-resources/paths.ts`, `SummaryScreen.tsx`, `derivatives.ts`, `useRole`, `recipes/paths.ts`, `SalesJournalScreen.tsx`, `settings/page.tsx`, `sales/page.tsx`, `FinishedProductEditScreen`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05421686746987952 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `products.ts`, `derivative-movement.ts`, `MaterialsPlanScreen.tsx`, `SaleScreen.tsx`, `next`, `index.ts`, `ProductionJournalFactScreen.tsx`, `PageFrame`, `production-fact.ts`, `FinishedGoodsMonthScreen.tsx`, `TransportFactScreen`, `sales.ts`, `SummaryScreen.tsx`, `useRole`, `hr.ts`, `finished-goods.ts`, `sales-plan.ts`, `recipes/paths.ts`, `SalesJournalScreen.tsx`, `sales/page.tsx`, `MaterialReceiptFormTable.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06760316066725197 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `FinishedProductEditScreen.tsx`, `ProductionEntryScreen.tsx`, `products.ts`, `derivative-movement.ts`, `package.json`, `DerivativeCreateScreen.tsx`, `monthKeyFromDate`, `MaterialsPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `SaleScreen.tsx`, `next`, `index.ts`, `Icons.tsx`, `keepWithNext`, `ProductionJournalFactScreen.tsx`, `RoleProvider.tsx`, `FinishedGoodsMonthScreen.tsx`, `DerivativeCostTable.tsx`, `AppShell.tsx`, `SummaryScreen.tsx`, `useRole`, `recipes/paths.ts`, `SalesJournalScreen.tsx`, `SummaryTable.tsx`, `DocumentProvider.tsx`, `SaleFormTable.tsx`, `MaterialReceiptFormTable.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06519114688128773 - nodes in this community are weakly interconnected._