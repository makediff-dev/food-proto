# Graph Report - food-proto  (2026-11-16)

## Corpus Check
- 285 files · ~168,314 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2651 nodes · 10422 edges · 88 communities (84 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7c5904f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- monthKeyFromDate
- keepWithNext
- useRole
- derivative-movement.ts
- mock-document.ts
- ratioRound
- Предметная область
- shiftMonth
- package.json
- biome.json
- MaterialReceiptFormTable.tsx
- finished-goods.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- FinishedGoodsFactTable.tsx
- MaterialsNormsScreen.tsx
- FinishedGoodsMonthScreen.tsx
- CreditResourcesSummaryScreen.tsx
- document.ts
- SummaryScreen.tsx
- CashflowFactScreen.tsx
- MaterialsSummaryTable.tsx
- production-plan.ts
- opex/paths.ts
- Флоу товара
- migrate-document.ts
- Icons.tsx
- derivative-movement/paths.ts
- credit-resources/paths.ts
- recipes/paths.ts
- production-fact.ts
- DocumentProvider.tsx
- cashflow/paths.ts
- IconChevronDown
- hr.ts
- access.ts
- index.ts
- AppShell.tsx
- flow.md
- README.md
- recipe-yield.ts
- derivatives.ts
- Отчет общий сырья
- RoleProvider.tsx
- postcss.config.mjs
- use-opex.ts
- OpexSummaryScreen.tsx
- Отчет общий движения
- summary.ts
- MaterialJournalScreen.tsx
- ProductionJournalFactScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- materials/text.ts
- PlanningScreen.tsx
- inputs/README.md
- ColumnLabel
- vat/paths.ts
- SalesFactScreen.tsx
- Отчет общий движения производных
- recipes/cost/page.tsx
- Операционные расходы
- use-materials.ts
- Себестоимость готовой продукции
- FinishedGoodsFactScreen.tsx
- DerivativeEditScreen
- SalesJournalScreen.tsx
- sales-plan.ts
- SummaryTable.tsx
- ProductionEntryScreen.tsx
- operating-expense.ts
- sales-fact.ts
- RecipeJournalsTable.tsx
- materials.ts
- products.ts
- Инвентаризация
- SaleScreen.tsx
- next
- mock-opex.ts
- planMonthOpen
- settings/page.tsx
- entityNameRowClassName
- RecipeComponentSearch
- DocumentForm

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 120 edges
2. `next` - 112 edges
3. `PageFrame()` - 109 edges
4. `react` - 85 edges
5. `useOpex()` - 83 edges
6. `entityNameRowClassName()` - 80 edges
7. `ColumnLabel()` - 76 edges
8. `useRole()` - 71 edges
9. `keepWithNext()` - 66 edges
10. `planMonthOpen()` - 65 edges

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

## Communities (88 total, 4 thin omitted)

### Community 0 - "monthKeyFromDate"
Cohesion: 0.15
Nodes (27): react, derivativeMovementMonth(), monthKeyFromDate(), DerivativeMovementInventoryScreen(), DerivativeMovementPlanScreen(), DerivativeMovementPlanTable(), derivativeNormRangeInvalid(), DerivativeMovementSummaryScreen() (+19 more)

### Community 1 - "keepWithNext"
Cohesion: 0.11
Nodes (46): TotalCell(), TotalCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell() (+38 more)

### Community 2 - "useRole"
Cohesion: 0.14
Nodes (33): metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage(), salesPlanForMonth(), salesPlanTotals, CreditResourcesPlanScreen(), inputKind() (+25 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.13
Nodes (32): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+24 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.04
Nodes (42): mockCreditors, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember (+34 more)

### Community 5 - "ratioRound"
Cohesion: 0.09
Nodes (47): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+39 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (31): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение денежных средств (+23 more)

### Community 7 - "shiftMonth"
Cohesion: 0.12
Nodes (27): metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), productionEntryPieces(), shiftMonth() (+19 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.05
Nodes (73): Material, ProductCategory, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, emptyMaterialReceiptLineDraft(), EntryFormGroup (+65 more)

### Community 11 - "finished-goods.ts"
Cohesion: 0.08
Nodes (64): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+56 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (59): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), recipeComponentsKilogramThousandths(), commit(), formatQuantity(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm() (+51 more)

### Community 14 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.08
Nodes (52): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND (+44 more)

### Community 15 - "MaterialsNormsScreen.tsx"
Cohesion: 0.29
Nodes (9): MaterialsNormsPage(), metadata, MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID, activeMaterials(), materialNormQuantity(), MaterialsNormsScreen(), NormCell() (+1 more)

### Community 16 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 17 - "CreditResourcesSummaryScreen.tsx"
Cohesion: 0.16
Nodes (15): creditResourcesMonthView, CreditResourcesFactScreen(), inputKind(), COLUMN_GROUPS, COLUMN_KIND, columnEdge(), ColumnKey, COLUMNS (+7 more)

### Community 18 - "document.ts"
Cohesion: 0.05
Nodes (47): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+39 more)

### Community 19 - "SummaryScreen.tsx"
Cohesion: 0.13
Nodes (31): Home(), metadata, metadata, PlanPage(), activeCategories(), ensureRangeIncludesMonth(), normalizeMonthRange(), SummaryLens (+23 more)

### Community 20 - "CashflowFactScreen.tsx"
Cohesion: 0.05
Nodes (86): CashflowFactPage(), metadata, buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines() (+78 more)

### Community 21 - "MaterialsSummaryTable.tsx"
Cohesion: 0.07
Nodes (44): DerivativeRow(), DerivativeRow(), RowCell(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+36 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+16 more)

### Community 23 - "opex/paths.ts"
Cohesion: 0.07
Nodes (44): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexTransportPage(), metadata (+36 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "migrate-document.ts"
Cohesion: 0.10
Nodes (26): DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile(), ParseDocumentResult, serializeDocument() (+18 more)

### Community 26 - "Icons.tsx"
Cohesion: 0.19
Nodes (20): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+12 more)

### Community 27 - "derivative-movement/paths.ts"
Cohesion: 0.15
Nodes (16): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+8 more)

### Community 28 - "credit-resources/paths.ts"
Cohesion: 0.17
Nodes (14): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+6 more)

### Community 29 - "recipes/paths.ts"
Cohesion: 0.11
Nodes (24): RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), metadata (+16 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.12
Nodes (38): plannedProductionVolumePieces(), planOpeningPrice(), priceAverage(), rangePlanProduction(), rangePlanSales(), amountExVat(), actualRangeProductionFact(), applyProductionFactLens() (+30 more)

### Community 31 - "DocumentProvider.tsx"
Cohesion: 0.17
Nodes (15): metadata, onest, unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument() (+7 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.19
Nodes (12): CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_PLAN_HREF, CASHFLOW_PLAN_TITLE, CASHFLOW_SECTION_TITLE (+4 more)

### Community 33 - "IconChevronDown"
Cohesion: 0.09
Nodes (50): DerivativeMovementInventoryTable(), WorkshopBlock(), WorkshopBlock(), WorkshopBlock(), GroupBlock(), SectionBlock(), CategoryBlock(), InventoryTable() (+42 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (60): isShopPositionId(), HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrDayFact, HrMonthFactStaffLine, HrMonthPlanStaffLine, isHrShopDepartmentId(), isMonthKey() (+52 more)

### Community 35 - "access.ts"
Cohesion: 0.16
Nodes (14): RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref(), SECTION_HOME, ROLES_HREF (+6 more)

### Community 36 - "index.ts"
Cohesion: 0.10
Nodes (55): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMN_KIND, ColumnKey (+47 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.13
Nodes (22): MOVEMENT_SECTION_TITLE, opexGroupFactHrefPath(), opexGroupHrefPath(), opexGroupPlanHrefPath(), PRODUCTION_SECTION_TITLE, buildOpexNav(), CASHFLOW_NAV, currentNavLabel() (+14 more)

### Community 38 - "flow.md"
Cohesion: 0.22
Nodes (8): Отчет подневный движения, Чем день отличается от свода, Колонки строки товара, Отчет подневный производства, Группы, Отчет общий производства, Колонки строки товара, Отчет подневный продаж

### Community 39 - "README.md"
Cohesion: 0.16
Nodes (9): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула, Запуск (+1 more)

### Community 40 - "recipe-yield.ts"
Cohesion: 0.18
Nodes (13): DerivativeAddRejection, ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, RecipeLineRef (+5 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.12
Nodes (33): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection (+25 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "RoleProvider.tsx"
Cohesion: 0.13
Nodes (25): RootLayout(), readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT (+17 more)

### Community 45 - "use-opex.ts"
Cohesion: 0.09
Nodes (59): HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan, deleteHrPosition() (+51 more)

### Community 46 - "OpexSummaryScreen.tsx"
Cohesion: 0.23
Nodes (10): metadata, OpexSummaryPage(), COLUMN_GROUPS, columnEdgeClass(), ColumnKey, COLUMNS, GROUP_END_KEYS, GroupBlock() (+2 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.10
Nodes (46): Единицы, monthInterestAmounts(), SalesPlan, finishedGoodsSummaryAsOfDate(), productCostPerPiece(), factVolumeScale(), planVolumeScale(), daysInMonth() (+38 more)

### Community 49 - "MaterialJournalScreen.tsx"
Cohesion: 0.12
Nodes (23): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+15 more)

### Community 50 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.16
Nodes (17): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), DayDateControl() (+9 more)

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

### Community 57 - "materials/text.ts"
Cohesion: 0.13
Nodes (14): MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialMovementRow, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, materialUnitHint() (+6 more)

### Community 58 - "PlanningScreen.tsx"
Cohesion: 0.20
Nodes (14): metadata, PlanningPage(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), AddCategoryDialog(), submit(), AddProductDialog() (+6 more)

### Community 60 - "ColumnLabel"
Cohesion: 0.09
Nodes (41): metadata, OpexHrFactPage(), metadata, OpexHrPage(), metadata, OpexHrPlanPage(), HrDepartmentId, HR_DEPARTMENT_LABELS (+33 more)

### Community 61 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 62 - "SalesFactScreen.tsx"
Cohesion: 0.15
Nodes (21): finishedGoodsFactPageTitle(), productionJournalFactPageTitle(), salesFactHref(), DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth(), resolveDay() (+13 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "recipes/cost/page.tsx"
Cohesion: 0.32
Nodes (6): RecipesCostDetailPage(), metadata, RecipesCostPage(), parseRecipesCostMonthQuery(), RECIPES_COST_HREF, RECIPES_COST_TITLE

### Community 65 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 66 - "use-materials.ts"
Cohesion: 0.22
Nodes (23): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isVatPercent(), materialById() (+15 more)

### Community 68 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.17
Nodes (16): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+8 more)

### Community 69 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

### Community 70 - "SalesJournalScreen.tsx"
Cohesion: 0.27
Nodes (11): saleTotals, workingSalesInMonth(), saleHref(), saleNewHref(), groupSalesByDay(), saleComposition(), SalesJournalScreen(), Workspace() (+3 more)

### Community 71 - "sales-plan.ts"
Cohesion: 0.13
Nodes (24): costWithVat(), UnitCost, amountWithVat(), ProductionJournalFactRow, activeProducts(), SalesFactRow, activeSalesPlans(), addSalesPlan() (+16 more)

### Community 72 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (36): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+28 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (45): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), commitDocumentUpdate(), ProductionEntryLine, productAllowedInPeriodSale(), addProductionEntry() (+37 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (65): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection() (+57 more)

### Community 75 - "sales-fact.ts"
Cohesion: 0.11
Nodes (36): Архитектура прототипа, Поток данных, Слои, Удаление, Чего не делать, Product, PrototypeDocument, averageAmount() (+28 more)

### Community 76 - "RecipeJournalsTable.tsx"
Cohesion: 0.22
Nodes (14): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+6 more)

### Community 77 - "materials.ts"
Cohesion: 0.10
Nodes (43): costExVat(), MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity() (+35 more)

### Community 78 - "products.ts"
Cohesion: 0.06
Nodes (80): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+72 more)

### Community 79 - "Инвентаризация"
Cohesion: 0.67
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 81 - "SaleScreen.tsx"
Cohesion: 0.08
Nodes (54): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+46 more)

### Community 83 - "next"
Cohesion: 0.17
Nodes (20): nextConfig, next, OpexGroupFactPage(), metadata, OpexTransportFactPage(), operatingExpenseOtherGroupDayView(), defaultSalesFactDay(), transportHireDayValue() (+12 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (47): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, MOCK_MONTHS (+39 more)

### Community 85 - "planMonthOpen"
Cohesion: 0.13
Nodes (25): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), useDocumentStore(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField (+17 more)

### Community 89 - "settings/page.tsx"
Cohesion: 0.32
Nodes (4): metadata, SettingsPage(), SETTINGS_HREF, SETTINGS_TITLE

### Community 92 - "entityNameRowClassName"
Cohesion: 0.15
Nodes (27): CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), VarianceSense, cashflowPlanHref(), cashflowSummaryHref(), monthHref() (+19 more)

### Community 103 - "DocumentForm"
Cohesion: 0.15
Nodes (17): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), isPrice(), materialReceiptById(), materialReceiptRejection(), materialReceiptsList() (+9 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 544 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `monthKeyFromDate`, `useRole`, `shiftMonth`, `package.json`, `MaterialReceiptFormTable.tsx`, `DerivativeCreateScreen.tsx`, `MaterialsNormsScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `CreditResourcesSummaryScreen.tsx`, `SummaryScreen.tsx`, `CashflowFactScreen.tsx`, `opex/paths.ts`, `derivative-movement/paths.ts`, `credit-resources/paths.ts`, `recipes/paths.ts`, `DocumentProvider.tsx`, `cashflow/paths.ts`, `access.ts`, `AppShell.tsx`, `derivatives.ts`, `OpexSummaryScreen.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `PlanningScreen.tsx`, `ColumnLabel`, `vat/paths.ts`, `SalesFactScreen.tsx`, `recipes/cost/page.tsx`, `FinishedGoodsFactScreen.tsx`, `DerivativeEditScreen`, `SalesJournalScreen.tsx`, `ProductionEntryScreen.tsx`, `RecipeJournalsTable.tsx`, `products.ts`, `SaleScreen.tsx`, `planMonthOpen`, `settings/page.tsx`, `entityNameRowClassName`, `DocumentForm`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `monthKeyFromDate` be split into smaller, more focused modules?**
  _Cohesion score 0.1494949494949495 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `useRole`, `shiftMonth`, `MaterialReceiptFormTable.tsx`, `finished-goods.ts`, `FinishedGoodsMonthScreen.tsx`, `CreditResourcesSummaryScreen.tsx`, `SummaryScreen.tsx`, `CashflowFactScreen.tsx`, `opex/paths.ts`, `production-fact.ts`, `hr.ts`, `OpexSummaryScreen.tsx`, `summary.ts`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `PlanningScreen.tsx`, `ColumnLabel`, `SalesFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesJournalScreen.tsx`, `sales-plan.ts`, `ProductionEntryScreen.tsx`, `sales-fact.ts`, `SaleScreen.tsx`, `next`, `planMonthOpen`, `entityNameRowClassName`, `DocumentForm`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `keepWithNext` be split into smaller, more focused modules?**
  _Cohesion score 0.11378353376503238 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `production-fact.ts` to `derivative-movement.ts`, `finished-goods.ts`, `materials.ts`, `summary.ts`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `useRole` be split into smaller, more focused modules?**
  _Cohesion score 0.13737373737373737 - nodes in this community are weakly interconnected._