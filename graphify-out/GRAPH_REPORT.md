# Graph Report - food-proto  (2026-11-04)

## Corpus Check
- 243 files · ~143,672 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2263 nodes · 8722 edges · 88 communities (81 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c2dc1d5b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ColumnLabel
- ProductionEntryScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- MaterialsNormsScreen
- Предметная область
- InventoryScreen.tsx
- package.json
- biome.json
- RoleProvider.tsx
- FinishedProductEditScreen.tsx
- compilerOptions
- DerivativeForm
- finished-goods.ts
- opex/paths.ts
- keepWithNext
- RecipeJournalsTable.tsx
- mock-materials.ts
- use-materials.ts
- PageFrame
- index.ts
- production-plan.ts
- FinishedGoodsMonthTable.tsx
- Флоу товара
- MaterialReceiptFormTable.tsx
- ProductionJournalFactScreen.tsx
- SaleScreen.tsx
- materials.ts
- Icons.tsx
- production-fact.ts
- MaterialsSummaryTable.tsx
- derivatives.ts
- SummaryScreen.tsx
- ProductionJournalScreen.tsx
- document.ts
- DerivativeCostTable.tsx
- FinishedGoodsFactScreen.tsx
- flow.md
- MaterialDocumentScreen.tsx
- derivative-cost.ts
- AppShell.tsx
- Отчет общий сырья
- monthKeyFromDate
- postcss.config.mjs
- hr.ts
- shiftMonth
- Отчет общий движения
- summary.ts
- DerivativeCreateScreen.tsx
- FinishedGoodsMonthScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- movement-plan.ts
- useDocumentStore
- inputs/README.md
- finished-product-cost.ts
- useRole
- SummaryTable.tsx
- Отчет общий движения производных
- ratioRound
- parseOpexMonthQuery
- use-opex.ts
- DerivativeCompositionEditor
- hr/fact/page.tsx
- DocumentProvider.tsx
- next
- DerivativeMovementPlanScreen.tsx
- production-journal-fact.ts
- Себестоимость готовой продукции
- operating-expense.ts
- recipes/cost/page.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- SettingsScreen.tsx
- Отчет подневный продаж
- TransportFactScreen
- ProductionPlanScreen.tsx
- OtherPlanScreen
- OpexSummaryScreen
- TransportSummaryScreen
- HrFactScreen
- OtherFactScreen

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 100 edges
2. `next` - 92 edges
3. `PageFrame()` - 89 edges
4. `react` - 74 edges
5. `keepWithNext()` - 65 edges
6. `useRole()` - 61 edges
7. `planMonthOpen()` - 59 edges
8. `IconChevronDown()` - 59 edges
9. `IconChevronRight()` - 58 edges
10. `useOpex()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Поток данных` --references--> `PrototypeDocument`  [INFERRED]
  docs/architecture.md → src/domain/document.ts
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

## Communities (88 total, 7 thin omitted)

### Community 0 - "ColumnLabel"
Cohesion: 0.10
Nodes (28): Подсказки заголовков таблицы, DerivativeMovementPlanTable(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS (+20 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.08
Nodes (49): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductCategory, ProductionEntryLine, addProductionEntry(), addProductionEntryRejection() (+41 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.08
Nodes (56): Home(), metadata, metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+48 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.10
Nodes (39): DerivativeMovementInventoryPage(), metadata, buildRow(), costForQuantity(), derivativeMovementMonth(), DerivativeMovementMonthView, derivativeNormMetrics(), DerivativeNormRejection (+31 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (31): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+23 more)

### Community 5 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (41): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+33 more)

### Community 7 - "InventoryScreen.tsx"
Cohesion: 0.13
Nodes (23): metadata, MovementInventoryPage(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), InventoryScreen(), resolveMonth(), Workspace() (+15 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (22): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+14 more)

### Community 11 - "FinishedProductEditScreen.tsx"
Cohesion: 0.11
Nodes (33): FinishedProductRecipePage(), metadata, ProductRecipeLine, ProductRecipeRejection, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatMaterialWeightPair(), formatQuantity(), MATERIAL_DOCUMENT_ERROR (+25 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.12
Nodes (36): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), lineAmountWithVat(), quantityForAmount(), rowMetrics(), commit(), formatQuantityDraft(), parseQuantityInput() (+28 more)

### Community 14 - "finished-goods.ts"
Cohesion: 0.12
Nodes (47): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyPlanSide(), emptyRangeView() (+39 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.15
Nodes (16): monthHref(), OPEX_HR_FACT_HREF, OPEX_HR_HREF, OPEX_HR_PLAN_HREF, OPEX_OTHER_FACT_HREF, OPEX_OTHER_PLAN_HREF, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE (+8 more)

### Community 16 - "keepWithNext"
Cohesion: 0.13
Nodes (39): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+31 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.22
Nodes (14): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+6 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.19
Nodes (26): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+18 more)

### Community 20 - "PageFrame"
Cohesion: 0.10
Nodes (38): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, materialMovementMonth, DerivativeMovementSummaryScreen() (+30 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (60): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+52 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (27): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+19 more)

### Community 23 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (42): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+34 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (81): WorkshopBlock(), DerivativeRow(), WorkshopBlock(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup (+73 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (19): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), DayDateControl() (+11 more)

### Community 27 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (79): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+71 more)

### Community 28 - "materials.ts"
Cohesion: 0.07
Nodes (52): costExVat(), MaterialGroupId, MaterialReceiptLine, MaterialUnit, MaterialWeightPair, addMoney(), addMoneyNullable(), bookClosingQuantity() (+44 more)

### Community 29 - "Icons.tsx"
Cohesion: 0.17
Nodes (32): react, DerivativeMovementRow, DerivativeMovementSection, HR_DEPARTMENT_LABELS, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS (+24 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.14
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 31 - "MaterialsSummaryTable.tsx"
Cohesion: 0.14
Nodes (22): MaterialNormDeviation(), ColumnKey, COLUMNS, MaterialsPlanTable(), materialUnitHint(), PlanCell(), planColumnKind(), PlanTotal() (+14 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.12
Nodes (33): activeDerivatives(), addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById(), isDerivativeUnit() (+25 more)

### Community 33 - "SummaryScreen.tsx"
Cohesion: 0.17
Nodes (26): activeCategories(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref(), productionFactPageTitle() (+18 more)

### Community 34 - "ProductionJournalScreen.tsx"
Cohesion: 0.22
Nodes (14): metadata, ProductionJournalPage(), productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), PRODUCTION_JOURNAL_TITLE, productionEntryHref(), productionEntryNewHref() (+6 more)

### Community 35 - "document.ts"
Cohesion: 0.06
Nodes (33): mockHrPositions, mockTransportCarriers, DeletableRecord, DERIVATIVE_UNITS, DERIVATIVE_WORKSHOPS, DerivativeNorm, DerivativeNormLine, DerivativeOpening (+25 more)

### Community 36 - "DerivativeCostTable.tsx"
Cohesion: 0.13
Nodes (29): COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, CostCell(), GROUP_END_KEYS, COLUMN_GROUPS, COLUMN_KIND (+21 more)

### Community 37 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.17
Nodes (17): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay() (+9 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "MaterialDocumentScreen.tsx"
Cohesion: 0.18
Nodes (18): metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), DocumentForm(), changeWarehouse(), draftsForWarehouse() (+10 more)

### Community 40 - "derivative-cost.ts"
Cohesion: 0.15
Nodes (27): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+19 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.07
Nodes (45): Архитектура прототипа, Поток данных, Слои, Чего не делать, DerivativeMovementPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF (+37 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "monthKeyFromDate"
Cohesion: 0.19
Nodes (20): defaultSalesFactDay(), monthKeyFromDate(), planMonthOpen(), resolveMonth(), resolveMonth(), resolveMonth(), resolveRange(), resolveMonth() (+12 more)

### Community 45 - "hr.ts"
Cohesion: 0.07
Nodes (53): HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrDayFact, HrDayOutsourcingLine, HrDayStaffLine, HrDepartmentId, HrMonthPlan, HrMonthPlanOutsourcingLine (+45 more)

### Community 46 - "shiftMonth"
Cohesion: 0.24
Nodes (11): metadata, MovementPlanPage(), shiftMonth(), lastHorizonMonth(), MovementPlanScreen(), Workspace(), open(), movementPlanNormRangeInvalid() (+3 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.07
Nodes (66): Единицы, Удаление, costWithVat(), UnitCost, SalesPlan, productCostPerPiece(), amountWithVat(), averageAmount() (+58 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.27
Nodes (11): DerivativePage(), metadata, metadata, NewDerivativePage(), isDerivativeWorkshopId(), DerivativeWorkshopId, DerivativeCreateScreen(), DerivativeEditScreen() (+3 more)

### Community 50 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.28
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), Workspace(), open() (+4 more)

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
Cohesion: 0.11
Nodes (34): FinishedGoodsNormLine, Product, closingInventoryDeviationPieces(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingDeviationPieces() (+26 more)

### Community 58 - "useDocumentStore"
Cohesion: 0.17
Nodes (19): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), useDocumentStore(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes() (+11 more)

### Community 60 - "finished-product-cost.ts"
Cohesion: 0.18
Nodes (17): MaterialWarehouseId, buildCostRow(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode, finishedProductCostMonth(), FinishedProductCostMonthView (+9 more)

### Community 61 - "useRole"
Cohesion: 0.12
Nodes (31): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), AddPositionDialog() (+23 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (35): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+27 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "ratioRound"
Cohesion: 0.20
Nodes (14): outsourcingAmountExVat(), taxAmountExVat(), ratioRound(), shareHundredths(), profitabilityHundredths(), hireAmount(), hirePlanLine(), ownDayFuelAmountExVat() (+6 more)

### Community 65 - "parseOpexMonthQuery"
Cohesion: 0.19
Nodes (10): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexTransportPlanPage(), OPEX_HR_PLAN_TITLE, OPEX_HR_TITLE (+2 more)

### Community 66 - "use-opex.ts"
Cohesion: 0.11
Nodes (41): HrTaxRatesMonth, isOccurredOn(), isTransportHireKind(), isTransportVehicleId(), TransportHireKind, TransportVehicleId, activeHrPositions(), addHrPosition() (+33 more)

### Community 67 - "DerivativeCompositionEditor"
Cohesion: 0.29
Nodes (5): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups(), IconSearch()

### Community 68 - "hr/fact/page.tsx"
Cohesion: 0.28
Nodes (7): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), OPEX_HR_FACT_TITLE, OPEX_TRANSPORT_FACT_TITLE, parseOpexDayQuery()

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.17
Nodes (19): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+11 more)

### Community 70 - "next"
Cohesion: 0.13
Nodes (18): nextConfig, next, MaterialReceiptPage(), metadata, MaterialReceiptsPage(), metadata, RecipesFinishedCostDetailPage(), metadata (+10 more)

### Community 71 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.29
Nodes (8): DerivativeMovementPlanPage(), metadata, DerivativeNormField, DerivativeMovementPlanScreen(), derivativeNormRangeInvalid(), DERIVATIVE_MOVEMENT_PLAN_TITLE, derivativeMovementPlanHref(), parseDerivativeMovementPlanQuery()

### Community 72 - "production-journal-fact.ts"
Cohesion: 0.29
Nodes (10): productionFactGridProducts(), dayTotals(), ProductionJournalFactDayView, productionJournalFactGridProducts(), ProductionJournalFactGroup, productionJournalFactGroups(), productionJournalFactMonth(), ProductionJournalFactTotals (+2 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.09
Nodes (40): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+32 more)

### Community 75 - "recipes/cost/page.tsx"
Cohesion: 0.32
Nodes (6): RecipesCostDetailPage(), metadata, RecipesCostPage(), parseRecipesCostMonthQuery(), RECIPES_COST_HREF, RECIPES_COST_TITLE

### Community 79 - "SettingsScreen.tsx"
Cohesion: 0.15
Nodes (15): metadata, SettingsPage(), ROLES_HREF, ROLES_TITLE, PERMISSION_MATRIX_ROWS, permissionAllowed(), ROLES, RolesMatrix() (+7 more)

### Community 81 - "TransportFactScreen"
Cohesion: 0.38
Nodes (7): transportHireDayValue(), transportOwnDayValue(), dayHref(), opexTransportFactHref(), resolveDay(), TransportFactScreen(), open()

### Community 82 - "ProductionPlanScreen.tsx"
Cohesion: 0.16
Nodes (17): metadata, ProductionPage(), metadata, ProductionPlanPage(), missingProductionPlanProducts(), activeProducts(), parseProductionFactQuery(), parseProductionPlanQuery() (+9 more)

### Community 83 - "OtherPlanScreen"
Cohesion: 0.40
Nodes (5): metadata, OpexOtherPlanPage(), OtherPlanScreen(), OPEX_OTHER_PLAN_TITLE, opexOtherPlanHref()

### Community 84 - "OpexSummaryScreen"
Cohesion: 0.40
Nodes (5): metadata, OpexSummaryPage(), OpexSummaryScreen(), OPEX_SUMMARY_TITLE, opexSummaryHref()

### Community 85 - "TransportSummaryScreen"
Cohesion: 0.40
Nodes (5): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), TransportSummaryScreen()

### Community 86 - "HrFactScreen"
Cohesion: 0.47
Nodes (6): hrDayOutsourcingHours(), hrDayStaffValue(), HrFactScreen(), open(), resolveDay(), opexHrFactHref()

### Community 87 - "OtherFactScreen"
Cohesion: 0.50
Nodes (4): metadata, OpexOtherFactPage(), OtherFactScreen(), OPEX_OTHER_FACT_TITLE

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 496 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `MaterialsNormsScreen`, `InventoryScreen.tsx`, `package.json`, `RoleProvider.tsx`, `FinishedProductEditScreen.tsx`, `RecipeJournalsTable.tsx`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `Icons.tsx`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `MaterialDocumentScreen.tsx`, `AppShell.tsx`, `monthKeyFromDate`, `shiftMonth`, `DerivativeCreateScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `useDocumentStore`, `useRole`, `parseOpexMonthQuery`, `hr/fact/page.tsx`, `DerivativeMovementPlanScreen.tsx`, `recipes/cost/page.tsx`, `SettingsScreen.tsx`, `ProductionPlanScreen.tsx`, `OtherPlanScreen`, `OpexSummaryScreen`, `TransportSummaryScreen`, `OtherFactScreen`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ColumnLabel` be split into smaller, more focused modules?**
  _Cohesion score 0.0989247311827957 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `ColumnLabel`, `ProductionEntryScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `InventoryScreen.tsx`, `package.json`, `RoleProvider.tsx`, `FinishedProductEditScreen.tsx`, `keepWithNext`, `RecipeJournalsTable.tsx`, `PageFrame`, `index.ts`, `FinishedGoodsMonthTable.tsx`, `MaterialReceiptFormTable.tsx`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `MaterialsSummaryTable.tsx`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `DerivativeCostTable.tsx`, `FinishedGoodsFactScreen.tsx`, `MaterialDocumentScreen.tsx`, `AppShell.tsx`, `monthKeyFromDate`, `shiftMonth`, `DerivativeCreateScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `useRole`, `SummaryTable.tsx`, `DocumentProvider.tsx`, `next`, `DerivativeMovementPlanScreen.tsx`, `ProductionPlanScreen.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07792207792207792 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `InventoryScreen.tsx`, `finished-goods.ts`, `PageFrame`, `MaterialReceiptFormTable.tsx`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `materials.ts`, `Icons.tsx`, `production-fact.ts`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `MaterialDocumentScreen.tsx`, `hr.ts`, `shiftMonth`, `summary.ts`, `FinishedGoodsMonthScreen.tsx`, `useRole`, `next`, `DerivativeMovementPlanScreen.tsx`, `TransportFactScreen`, `ProductionPlanScreen.tsx`, `OtherPlanScreen`, `OpexSummaryScreen`, `TransportSummaryScreen`, `HrFactScreen`, `OtherFactScreen`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08173076923076923 - nodes in this community are weakly interconnected._