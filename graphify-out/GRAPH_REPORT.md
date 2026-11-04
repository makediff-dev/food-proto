# Graph Report - food-proto  (2026-11-04)

## Corpus Check
- 244 files · ~143,917 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2263 nodes · 8743 edges · 92 communities (85 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4ad6926`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- entityNameRowClassName
- ProductionEntryScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- derivatives.ts
- Предметная область
- use-materials.ts
- package.json
- biome.json
- SettingsScreen.tsx
- MaterialsPlanScreen.tsx
- compilerOptions
- DerivativeCreateScreen.tsx
- finished-goods.ts
- opex/paths.ts
- ProductionFactTable.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- index.ts
- materials/paths.ts
- FinishedGoodsFactTable.tsx
- production-plan.ts
- FinishedGoodsMonthTable.tsx
- Флоу товара
- MaterialReceiptFormTable.tsx
- ProductionJournalFactScreen.tsx
- sales-fact/text.ts
- materials.ts
- HrSummaryScreen.tsx
- production-fact.ts
- monthKeyFromDate
- derivative-cost.ts
- SummaryScreen.tsx
- ProductionJournalScreen.tsx
- document.ts
- IconChevronDown
- AppShell.tsx
- flow.md
- MaterialDocumentScreen.tsx
- finished-product-cost.ts
- recipes/paths.ts
- Отчет общий сырья
- Icons.tsx
- postcss.config.mjs
- hr.ts
- movement-plan.ts
- Отчет общий движения
- summary.ts
- sales-fact/paths.ts
- FinishedGoodsMonthScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SaleScreen.tsx
- FinishedProductsScreen.tsx
- inputs/README.md
- DerivativesScreen.tsx
- PlanningArchiveScreen.tsx
- SummaryTable.tsx
- Отчет общий движения производных
- sales.ts
- RoleProvider.tsx
- transport.ts
- DerivativeCompositionEditor
- HrFactScreen.tsx
- DocumentProvider.tsx
- MaterialsInventoryScreen.tsx
- next
- PrototypeDocument
- Себестоимость готовой продукции
- operating-expense.ts
- RecipeCostDetailTable.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- roles.ts
- Отчет подневный продаж
- AppShell
- access.ts
- MaterialsNormsScreen.tsx
- mock-opex.ts
- Архитектура прототипа
- AGENTS.md
- Операционные расходы
- Движение готовой продукции
- Движение производных
- Как собрать первый прототип
- ProductCategory

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 100 edges
2. `next` - 92 edges
3. `PageFrame()` - 89 edges
4. `react` - 74 edges
5. `keepWithNext()` - 65 edges
6. `entityNameRowClassName()` - 60 edges
7. `planMonthOpen()` - 59 edges
8. `useRole()` - 59 edges
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

## Communities (92 total, 7 thin omitted)

### Community 0 - "entityNameRowClassName"
Cohesion: 0.08
Nodes (61): MaterialMovementTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS (+53 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.11
Nodes (37): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), commitDocumentUpdate(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection() (+29 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.09
Nodes (52): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+44 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (34): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+26 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (28): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+20 more)

### Community 5 - "derivatives.ts"
Cohesion: 0.12
Nodes (31): addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, derivativeWorkshopById(), isDerivativeUnit(), lineKey(), updateDerivative() (+23 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Отчет общий (производство), Отчет подневный (производство), Период и ассортимент, План производства (+15 more)

### Community 7 - "use-materials.ts"
Cohesion: 0.18
Nodes (27): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+19 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SettingsScreen.tsx"
Cohesion: 0.24
Nodes (8): metadata, SettingsPage(), isRoleId(), SETTINGS_HREF, SETTINGS_TITLE, MockSection(), RoleSection(), SettingsScreen()

### Community 11 - "MaterialsPlanScreen.tsx"
Cohesion: 0.14
Nodes (16): Material, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection, MaterialMovementRow, MaterialNormRejection (+8 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (56): Derivative, DERIVATIVE_WORKSHOPS, activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), commit(), formatQuantity() (+48 more)

### Community 14 - "finished-goods.ts"
Cohesion: 0.13
Nodes (43): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), clampSummaryMonth(), closingNormMetrics(), closingStockPieces() (+35 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.07
Nodes (55): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage() (+47 more)

### Community 16 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.24
Nodes (13): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+5 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "index.ts"
Cohesion: 0.11
Nodes (33): react, DepartmentBlock(), FACT_FIELD, HrTaxRateBlock(), PLAN_FIELD, OtherGroupBlock(), headlineKind(), HeadlineRowId (+25 more)

### Community 20 - "materials/paths.ts"
Cohesion: 0.15
Nodes (18): MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata, MaterialsPlanScreen(), MaterialsSummaryScreen() (+10 more)

### Community 21 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.09
Nodes (40): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+32 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+16 more)

### Community 23 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.07
Nodes (42): Подсказки заголовков таблицы, DerivativeMovementRow, DerivativeMovementSection, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, COLUMN_GROUPS, COLUMN_KIND (+34 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (55): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+47 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.22
Nodes (13): defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), productionJournalFactPageTitle(), ProductionJournalFactScreen(), resolveDay() (+5 more)

### Community 27 - "sales-fact/text.ts"
Cohesion: 0.18
Nodes (21): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), parseDecimal(), roundKopecksToRubles(), parseTaxRate(), salesJournalHref() (+13 more)

### Community 28 - "materials.ts"
Cohesion: 0.10
Nodes (44): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+36 more)

### Community 29 - "HrSummaryScreen.tsx"
Cohesion: 0.22
Nodes (14): HrFieldRejection, OpexFieldRejection, TransportFieldRejection, DepartmentBlock(), HrSummaryScreen(), opexHrHref(), formatHours(), formatQuantity() (+6 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.14
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 31 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (49): activeCategories(), maxProductionEntryOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), saleTotals, lastHorizonMonth(), MaterialJournalScreen() (+41 more)

### Community 32 - "derivative-cost.ts"
Cohesion: 0.14
Nodes (31): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+23 more)

### Community 33 - "SummaryScreen.tsx"
Cohesion: 0.10
Nodes (38): Home(), metadata, metadata, PlanPage(), metadata, ProductionPage(), SalesPlanRejection, ensureRangeIncludesMonth() (+30 more)

### Community 34 - "ProductionJournalScreen.tsx"
Cohesion: 0.14
Nodes (22): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPlanPage(), ProductionEntry, productionEntryPieces() (+14 more)

### Community 35 - "document.ts"
Cohesion: 0.07
Nodes (28): catalogCategories(), catalogOpexOtherLines(), DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNorm, FinishedGoodsNormLine, FinishedGoodsOpeningLine, MaterialOpeningLine (+20 more)

### Community 36 - "IconChevronDown"
Cohesion: 0.10
Nodes (40): DerivativeMovementInventoryTable(), WorkshopBlock(), GroupBlock(), CategoryBlock(), CategoryBlock(), DepartmentBlock(), COLUMN_GROUPS, columnEdgeClass() (+32 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.13
Nodes (20): MOVEMENT_SECTION_TITLE, PRODUCTION_SECTION_TITLE, RECIPES_SECTION_TITLE, currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV, MOVEMENT_NAV, NAV_GROUPS (+12 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "MaterialDocumentScreen.tsx"
Cohesion: 0.16
Nodes (20): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), DocumentForm(), changeWarehouse(), draftsForWarehouse() (+12 more)

### Community 40 - "finished-product-cost.ts"
Cohesion: 0.23
Nodes (15): buildCostRow(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode, FinishedProductCostMonthView, FinishedProductCostRow, FinishedProductCostSection (+7 more)

### Community 41 - "recipes/paths.ts"
Cohesion: 0.13
Nodes (22): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), metadata, NewDerivativePage() (+14 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "Icons.tsx"
Cohesion: 0.09
Nodes (44): DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+36 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (42): HR_SHOP_DEPARTMENT_IDS, HrDayFact, HrDayOutsourcingLine, HrDayStaffLine, HrDepartmentId, HrMonthPlan, HrMonthPlanOutsourcingLine, HrMonthPlanStaffLine (+34 more)

### Community 46 - "movement-plan.ts"
Cohesion: 0.11
Nodes (37): closingInventoryDeviationPieces(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), monthSalesAndProduction(), openingDeviationPieces(), openingReferencedProductIds() (+29 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.09
Nodes (54): Единицы, costWithVat(), UnitCost, amountWithVat(), averageAmount(), percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts() (+46 more)

### Community 49 - "sales-fact/paths.ts"
Cohesion: 0.14
Nodes (17): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+9 more)

### Community 50 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.12
Nodes (24): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+16 more)

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

### Community 57 - "SaleScreen.tsx"
Cohesion: 0.22
Nodes (15): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), emptySaleLineDraft(), SaleLineDraft, SaleLineField, initialDrafts(), lineDraftFromSale() (+7 more)

### Community 58 - "FinishedProductsScreen.tsx"
Cohesion: 0.19
Nodes (13): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductsScreen(), finishedProductHref() (+5 more)

### Community 60 - "DerivativesScreen.tsx"
Cohesion: 0.19
Nodes (13): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes(), DerivativeEditScreen() (+5 more)

### Community 61 - "PlanningArchiveScreen.tsx"
Cohesion: 0.21
Nodes (13): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+5 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.09
Nodes (66): TotalCell(), MetricCell(), RowCell(), TotalsCell(), InventoryTable(), RowCell(), TotalsCell(), MovementPlanTable() (+58 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "sales.ts"
Cohesion: 0.26
Nodes (17): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), PLAN_HORIZON_MONTHS (+9 more)

### Community 65 - "RoleProvider.tsx"
Cohesion: 0.23
Nodes (11): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, DEFAULT_ROLE_ID, roleById() (+3 more)

### Community 66 - "transport.ts"
Cohesion: 0.08
Nodes (59): HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), isTransportVehicleId(), TransportHireKind, TransportVehicleId, activeHrPositions(), addHrPosition() (+51 more)

### Community 67 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 68 - "HrFactScreen.tsx"
Cohesion: 0.13
Nodes (26): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), HR_DEPARTMENT_IDS, isHrShopDepartmentId(), isOccurredOn(), HR_DEPARTMENT_LABELS (+18 more)

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.13
Nodes (21): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+13 more)

### Community 70 - "MaterialsInventoryScreen.tsx"
Cohesion: 0.20
Nodes (10): MaterialsInventoryPage(), metadata, MaterialGroupId, MaterialWarehouseId, MaterialGroupMovement, MaterialWarehouseMovement, MaterialsInventoryScreen(), MaterialsWarehouseBlocks() (+2 more)

### Community 71 - "next"
Cohesion: 0.11
Nodes (30): nextConfig, next, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata (+22 more)

### Community 72 - "PrototypeDocument"
Cohesion: 0.11
Nodes (30): Удаление, Product, PrototypeDocument, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+22 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.09
Nodes (38): isOpexGroupCode(), OpexGroupCode, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine() (+30 more)

### Community 75 - "RecipeCostDetailTable.tsx"
Cohesion: 0.27
Nodes (11): columnEdgeClass(), ColumnKey, COLUMNS, RecipeCostDetailExtraUnitRow, RecipeCostDetailLine, RecipeCostDetailTable(), RecipeCostDetailUnitCost, sumMoney() (+3 more)

### Community 79 - "roles.ts"
Cohesion: 0.24
Nodes (10): ALL_EDIT, ALL_NAV_SECTIONS, NO_EDIT, PERMISSION_MATRIX_ROWS, permissionAllowed(), PermissionFlagKey, PermissionMatrixRow, ROLES (+2 more)

### Community 81 - "AppShell"
Cohesion: 0.29
Nodes (8): Поток данных, pathnameSection(), roleCanAccessPath(), roleHomeHref(), RoleGate(), roleHasSection(), AppShell(), SettingsNavLink()

### Community 82 - "access.ts"
Cohesion: 0.20
Nodes (9): DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, SECTION_HOME, ROLES_HREF, ROLES_TITLE (+1 more)

### Community 83 - "MaterialsNormsScreen.tsx"
Cohesion: 0.31
Nodes (8): MaterialsNormsPage(), metadata, MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 84 - "mock-opex.ts"
Cohesion: 0.20
Nodes (5): mockHrPositions, mockTransportCarriers, HrPosition, TRANSPORT_VEHICLE_IDS, TransportCarrier

### Community 85 - "Архитектура прототипа"
Cohesion: 0.31
Nodes (5): Архитектура прототипа, Слои, Чего не делать, Запуск, Куда смотреть

### Community 86 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 87 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 88 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 89 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

### Community 90 - "Как собрать первый прототип"
Cohesion: 0.67
Nodes (3): Как собрать первый прототип, Порядок, Формула

### Community 91 - "ProductCategory"
Cohesion: 0.67
Nodes (3): ProductCategory, EntryFormGroup, SaleFormGroup

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 495 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `SettingsScreen.tsx`, `MaterialsPlanScreen.tsx`, `DerivativeCreateScreen.tsx`, `opex/paths.ts`, `RecipeJournalsTable.tsx`, `index.ts`, `materials/paths.ts`, `ProductionJournalFactScreen.tsx`, `HrSummaryScreen.tsx`, `monthKeyFromDate`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `IconChevronDown`, `AppShell.tsx`, `MaterialDocumentScreen.tsx`, `recipes/paths.ts`, `Icons.tsx`, `sales-fact/paths.ts`, `FinishedGoodsMonthScreen.tsx`, `SaleScreen.tsx`, `FinishedProductsScreen.tsx`, `DerivativesScreen.tsx`, `PlanningArchiveScreen.tsx`, `HrFactScreen.tsx`, `DocumentProvider.tsx`, `MaterialsInventoryScreen.tsx`, `AppShell`, `MaterialsNormsScreen.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `entityNameRowClassName` be split into smaller, more focused modules?**
  _Cohesion score 0.07511737089201878 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `MaterialsPlanScreen.tsx`, `finished-goods.ts`, `opex/paths.ts`, `index.ts`, `materials/paths.ts`, `ProductionJournalFactScreen.tsx`, `sales-fact/text.ts`, `HrSummaryScreen.tsx`, `production-fact.ts`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `IconChevronDown`, `MaterialDocumentScreen.tsx`, `recipes/paths.ts`, `Icons.tsx`, `hr.ts`, `summary.ts`, `sales-fact/paths.ts`, `FinishedGoodsMonthScreen.tsx`, `SaleScreen.tsx`, `sales.ts`, `HrFactScreen.tsx`, `MaterialsInventoryScreen.tsx`, `next`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10782241014799154 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `entityNameRowClassName`, `ProductionEntryScreen.tsx`, `package.json`, `MaterialsPlanScreen.tsx`, `DerivativeCreateScreen.tsx`, `opex/paths.ts`, `ProductionFactTable.tsx`, `RecipeJournalsTable.tsx`, `materials/paths.ts`, `FinishedGoodsFactTable.tsx`, `FinishedGoodsMonthTable.tsx`, `MaterialReceiptFormTable.tsx`, `ProductionJournalFactScreen.tsx`, `HrSummaryScreen.tsx`, `monthKeyFromDate`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `IconChevronDown`, `AppShell.tsx`, `MaterialDocumentScreen.tsx`, `recipes/paths.ts`, `Icons.tsx`, `FinishedGoodsMonthScreen.tsx`, `SaleScreen.tsx`, `PlanningArchiveScreen.tsx`, `SummaryTable.tsx`, `RoleProvider.tsx`, `HrFactScreen.tsx`, `DocumentProvider.tsx`, `MaterialsInventoryScreen.tsx`, `next`, `AppShell`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09134906231094979 - nodes in this community are weakly interconnected._