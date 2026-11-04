# Graph Report - food-proto  (2026-11-04)

## Corpus Check
- 243 files · ~143,807 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2263 nodes · 8716 edges · 84 communities (77 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b743bfa1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- sales-fact.ts
- ProductionEntryFormTable.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- MaterialsPlanScreen.tsx
- Предметная область
- use-opex.ts
- package.json
- biome.json
- RoleProvider.tsx
- RecipeComponentSearch
- compilerOptions
- DerivativeCreateScreen.tsx
- finished-goods.ts
- opex/paths.ts
- SummaryTable.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- use-materials.ts
- MaterialMonthBar
- index.ts
- production-plan.ts
- keepWithNext
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsFactScreen.tsx
- movement-plan.ts
- materials.ts
- Icons.tsx
- production-fact.ts
- parseOpexMonthQuery
- derivatives.ts
- SummaryScreen.tsx
- useRole
- document.ts
- IconChevronDown
- SaleScreen.tsx
- flow.md
- ProductionFactTable.tsx
- derivative-cost.ts
- AppShell.tsx
- Отчет общий сырья
- monthKeyFromDate
- postcss.config.mjs
- hr.ts
- RecipePrint.tsx
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- PageFrame
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- ProductionJournalFactScreen.tsx
- next
- inputs/README.md
- MaterialsNormsScreen.tsx
- PlanningScreen.tsx
- use-movement-plan.ts
- Отчет общий движения производных
- useDocumentStore
- FinishedGoodsMonthTable.tsx
- transport.ts
- DerivativeMovementPlanScreen.tsx
- HrFactScreen
- DocumentProvider.tsx
- HrPlanScreen
- TransportSummaryScreen
- DerivativeMovementInventoryScreen.tsx
- Себестоимость готовой продукции
- operating-expense.ts
- other/plan/page.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- SettingsScreen.tsx
- Отчет подневный продаж
- TransportFactScreen
- money.ts
- MaterialJournalScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 100 edges
2. `next` - 92 edges
3. `PageFrame()` - 89 edges
4. `react` - 74 edges
5. `keepWithNext()` - 63 edges
6. `useRole()` - 61 edges
7. `planMonthOpen()` - 59 edges
8. `useOpex()` - 59 edges
9. `IconChevronDown()` - 59 edges
10. `IconChevronRight()` - 58 edges

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

## Communities (84 total, 7 thin omitted)

### Community 0 - "sales-fact.ts"
Cohesion: 0.13
Nodes (29): Удаление, UnitCost, Product, averageAmount(), dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds() (+21 more)

### Community 1 - "ProductionEntryFormTable.tsx"
Cohesion: 0.06
Nodes (72): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductCategory, ProductionEntryLine, addProductionEntry(), addProductionEntryRejection() (+64 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.09
Nodes (55): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+47 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.12
Nodes (33): buildRow(), costForQuantity(), DerivativeMovementMonthView, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection, derivativeOpeningsList() (+25 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (33): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+25 more)

### Community 5 - "MaterialsPlanScreen.tsx"
Cohesion: 0.09
Nodes (27): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_GROUPS, MATERIAL_UNITS, MaterialUnit, MaterialWarehouseId (+19 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (41): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+33 more)

### Community 7 - "use-opex.ts"
Cohesion: 0.12
Nodes (34): HrTaxRatesMonth, isHrShopDepartmentId(), isTransportHireKind(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrFieldRejection (+26 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.16
Nodes (17): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT, ALL_NAV_SECTIONS (+9 more)

### Community 11 - "RecipeComponentSearch"
Cohesion: 0.29
Nodes (4): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups(), IconSearch()

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (54): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), setLine() (+46 more)

### Community 14 - "finished-goods.ts"
Cohesion: 0.16
Nodes (29): buildGroups(), closingNormMetrics(), emptyPlanSide(), emptyRangeView(), emptyTotals(), factualClosingPiecesThrough(), FinishedGoodsDayView, finishedGoodsMonthDays() (+21 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.14
Nodes (17): monthHref(), OPEX_HR_FACT_HREF, OPEX_HR_HREF, OPEX_HR_PLAN_HREF, OPEX_OTHER_FACT_HREF, OPEX_OTHER_PLAN_HREF, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE (+9 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (32): priceWithVatFromExVat(), SalesPlanRejection, SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock() (+24 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.22
Nodes (14): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+6 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.18
Nodes (27): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+19 more)

### Community 20 - "MaterialMonthBar"
Cohesion: 0.14
Nodes (22): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, materialMovementMonth, MaterialMonthBar() (+14 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (56): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+48 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "keepWithNext"
Cohesion: 0.09
Nodes (61): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, TotalCell(), MetricCell(), RowCell(), TotalsCell(), CategoryBlock() (+53 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (39): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+31 more)

### Community 26 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.08
Nodes (43): metadata, MovementFactPage(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle() (+35 more)

### Community 27 - "movement-plan.ts"
Cohesion: 0.15
Nodes (28): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), closingInventoryDeviationPieces(), closingStockPieces(), finishedGoodsGridProducts(), hasStoredInventoryLine() (+20 more)

### Community 28 - "materials.ts"
Cohesion: 0.10
Nodes (41): MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+33 more)

### Community 29 - "Icons.tsx"
Cohesion: 0.17
Nodes (40): react, HR_DEPARTMENT_LABELS, salesPlanTotals, resolveMaterialMonth(), DepartmentBlock(), ShopDepartment, AddPositionDialog(), DepartmentBlock() (+32 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.17
Nodes (25): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+17 more)

### Community 31 - "parseOpexMonthQuery"
Cohesion: 0.15
Nodes (13): metadata, OpexHrPage(), metadata, OpexOtherFactPage(), metadata, OpexSummaryPage(), metadata, OpexTransportPlanPage() (+5 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.10
Nodes (36): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection (+28 more)

### Community 33 - "SummaryScreen.tsx"
Cohesion: 0.21
Nodes (22): activeCategories(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), planningHref(), productionFactHref(), productionFactPageTitle(), ProductionFactScreen() (+14 more)

### Community 34 - "useRole"
Cohesion: 0.22
Nodes (15): metadata, ProductionJournalPage(), productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), PRODUCTION_JOURNAL_TITLE, productionEntryHref(), productionEntryNewHref() (+7 more)

### Community 35 - "document.ts"
Cohesion: 0.06
Nodes (28): mockHrPositions, mockTransportCarriers, DeletableRecord, FinishedGoodsOpeningLine, HR_SHOP_DEPARTMENT_IDS, HrAdminFactMonth, HrDayOutsourcingLine, HrDayStaffLine (+20 more)

### Community 36 - "IconChevronDown"
Cohesion: 0.06
Nodes (84): DerivativeMovementRow, DerivativeMovementSection, DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable() (+76 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (65): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+57 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 40 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (42): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+34 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.07
Nodes (41): Архитектура прототипа, Поток данных, Слои, Чего не делать, DERIVATIVE_MOVEMENT_PLAN_HREF, MATERIALS_SECTION_TITLE, PRODUCTION_SECTION_TITLE, RECIPES_DERIVATIVES_HREF (+33 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (40): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), missingProductionPlanProducts(), activeProducts(), maxSaleOccurredOn(), monthKeyFromDate() (+32 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (43): HR_DEPARTMENT_IDS, HrAdminFactStaffLine, HrDayFact, HrDepartmentId, HrShopDepartmentId, adminFactLine(), adminFactSide(), averageSalary() (+35 more)

### Community 46 - "RecipePrint.tsx"
Cohesion: 0.20
Nodes (19): derivativeWorkshopById(), warehouseIdForWorkshop(), ProductRecipeRejection, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), componentDraftKey(), derivativePrintModel(), draftsFromSavedLines() (+11 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.12
Nodes (43): Единицы, productCostPerPiece(), percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), factVolumeScale(), planVolumeScale(), daysInMonth() (+35 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.09
Nodes (34): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), FinishedProductRecipePage(), metadata (+26 more)

### Community 50 - "PageFrame"
Cohesion: 0.23
Nodes (14): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+6 more)

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

### Community 57 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.10
Nodes (28): metadata, ProductionFactPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), recommendedDayKey(), defaultProductionJournalFactDay() (+20 more)

### Community 58 - "next"
Cohesion: 0.23
Nodes (11): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+3 more)

### Community 60 - "MaterialsNormsScreen.tsx"
Cohesion: 0.27
Nodes (9): MaterialsNormsPage(), metadata, MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE (+1 more)

### Community 61 - "PlanningScreen.tsx"
Cohesion: 0.12
Nodes (25): metadata, PlanningPage(), missingPlanProducts(), SummaryLens, parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), AddCategoryDialog() (+17 more)

### Community 62 - "use-movement-plan.ts"
Cohesion: 0.26
Nodes (11): FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, FinishedGoodsNormRejection, isNormPieces() (+3 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "useDocumentStore"
Cohesion: 0.25
Nodes (13): useDocumentStore(), ProductRecipeLine, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths() (+5 more)

### Community 65 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.09
Nodes (28): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+20 more)

### Community 66 - "transport.ts"
Cohesion: 0.10
Nodes (36): isOccurredOn(), isTransportVehicleId(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan, TransportVehicleId (+28 more)

### Community 67 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.29
Nodes (8): DerivativeMovementPlanPage(), metadata, DerivativeNormField, DerivativeMovementPlanScreen(), derivativeNormRangeInvalid(), DERIVATIVE_MOVEMENT_PLAN_TITLE, derivativeMovementPlanHref(), parseDerivativeMovementPlanQuery()

### Community 68 - "HrFactScreen"
Cohesion: 0.27
Nodes (9): metadata, OpexHrFactPage(), hrDayOutsourcingHours(), hrDayStaffValue(), HrFactScreen(), open(), resolveDay(), OPEX_HR_FACT_TITLE (+1 more)

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.13
Nodes (23): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+15 more)

### Community 70 - "HrPlanScreen"
Cohesion: 0.40
Nodes (5): metadata, OpexHrPlanPage(), HrPlanScreen(), OPEX_HR_PLAN_TITLE, opexHrPlanHref()

### Community 71 - "TransportSummaryScreen"
Cohesion: 0.40
Nodes (5): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), TransportSummaryScreen()

### Community 72 - "DerivativeMovementInventoryScreen.tsx"
Cohesion: 0.16
Nodes (19): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, derivativeMovementMonth(), sumMoney(), DerivativeMovementInventoryScreen(), DerivativeMovementInventoryTable() (+11 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.09
Nodes (39): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine() (+31 more)

### Community 75 - "other/plan/page.tsx"
Cohesion: 0.50
Nodes (3): metadata, OpexOtherPlanPage(), OPEX_OTHER_PLAN_TITLE

### Community 79 - "SettingsScreen.tsx"
Cohesion: 0.17
Nodes (13): metadata, SettingsPage(), isRoleId(), PERMISSION_MATRIX_ROWS, permissionAllowed(), ROLES, RolesMatrix(), SETTINGS_HREF (+5 more)

### Community 81 - "TransportFactScreen"
Cohesion: 0.23
Nodes (11): metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), dayHref(), OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref(), parseOpexDayQuery() (+3 more)

### Community 82 - "money.ts"
Cohesion: 0.20
Nodes (17): costExVat(), costWithVat(), plannedProductionVolumePieces(), priceAverage(), rangePlanProduction(), rangePlanSales(), targetClosingPiecesFromNorm(), amountExVat() (+9 more)

### Community 83 - "MaterialJournalScreen.tsx"
Cohesion: 0.30
Nodes (10): MaterialReceiptsPage(), metadata, materialById(), materialReceiptsInMonth(), MaterialJournalScreen(), materialReceiptHref(), materialReceiptNewHref(), MATERIALS_RECEIPTS_TITLE (+2 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 493 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryFormTable.tsx`, `sales-plan.ts`, `MaterialsPlanScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialMonthBar`, `FinishedGoodsFactScreen.tsx`, `Icons.tsx`, `parseOpexMonthQuery`, `derivatives.ts`, `SummaryScreen.tsx`, `useRole`, `SaleScreen.tsx`, `AppShell.tsx`, `monthKeyFromDate`, `recipes/paths.ts`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `MaterialsNormsScreen.tsx`, `PlanningScreen.tsx`, `DerivativeMovementPlanScreen.tsx`, `HrFactScreen`, `DocumentProvider.tsx`, `HrPlanScreen`, `TransportSummaryScreen`, `DerivativeMovementInventoryScreen.tsx`, `other/plan/page.tsx`, `SettingsScreen.tsx`, `TransportFactScreen`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sales-fact.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12903225806451613 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `ProductionEntryFormTable.tsx`, `sales-plan.ts`, `MaterialsPlanScreen.tsx`, `package.json`, `RoleProvider.tsx`, `DerivativeCreateScreen.tsx`, `SummaryTable.tsx`, `RecipeJournalsTable.tsx`, `MaterialMonthBar`, `index.ts`, `keepWithNext`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsFactScreen.tsx`, `SummaryScreen.tsx`, `useRole`, `IconChevronDown`, `SaleScreen.tsx`, `ProductionFactTable.tsx`, `AppShell.tsx`, `monthKeyFromDate`, `recipes/paths.ts`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `next`, `PlanningScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `DerivativeMovementPlanScreen.tsx`, `DocumentProvider.tsx`, `DerivativeMovementInventoryScreen.tsx`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `ProductionEntryFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05570611261668172 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `sales-fact.ts`, `ProductionEntryFormTable.tsx`, `sales-plan.ts`, `MaterialsPlanScreen.tsx`, `finished-goods.ts`, `MaterialMonthBar`, `FinishedGoodsFactScreen.tsx`, `Icons.tsx`, `production-fact.ts`, `SummaryScreen.tsx`, `useRole`, `SaleScreen.tsx`, `hr.ts`, `summary.ts`, `recipes/paths.ts`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `next`, `PlanningScreen.tsx`, `DerivativeMovementPlanScreen.tsx`, `HrFactScreen`, `HrPlanScreen`, `TransportSummaryScreen`, `DerivativeMovementInventoryScreen.tsx`, `TransportFactScreen`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08778424114225278 - nodes in this community are weakly interconnected._