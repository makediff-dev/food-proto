# Graph Report - food-proto  (2026-11-04)

## Corpus Check
- 244 files · ~143,462 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2265 nodes · 8709 edges · 87 communities (80 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `864f22ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- production-journal-fact.ts
- ProductionPlanScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- ColumnLabel
- Предметная область
- use-opex.ts
- package.json
- biome.json
- RoleProvider.tsx
- DerivativeCompositionEditor
- compilerOptions
- DerivativeForm
- DerivativeFormTable.tsx
- HrFactScreen.tsx
- SummaryTable.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- materials.ts
- MaterialJournalScreen.tsx
- index.ts
- production-plan.ts
- keepWithNext
- Флоу товара
- MaterialReceiptFormTable.tsx
- ProductionJournalFactScreen.tsx
- finished-goods.ts
- movementRow
- TransportPlanScreen.tsx
- SummaryScreen.tsx
- opex/paths.ts
- DerivativeCreateScreen.tsx
- production-fact.ts
- DerivativesScreen.tsx
- document.ts
- IconChevronDown
- SaleScreen.tsx
- flow.md
- FinishedProductEditScreen.tsx
- derivative-cost.ts
- AppShell.tsx
- Отчет общий сырья
- monthKeyFromDate
- postcss.config.mjs
- hr.ts
- recipe-yield.ts
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- FinishedGoodsFactScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- movement-plan.ts
- ProductionEntryScreen.tsx
- inputs/README.md
- next
- SummaryHeadlineTable.tsx
- PageFrame
- Отчет общий движения производных
- MaterialsPlanScreen.tsx
- FinishedGoodsMonthTable.tsx
- transport.ts
- Архитектура прототипа
- layout.tsx
- DocumentProvider.tsx
- planning/paths.ts
- migrate-document.ts
- Icons.tsx
- Себестоимость готовой продукции
- operating-expense.ts
- MaterialsNormsScreen
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- access.ts
- Отчет подневный продаж
- MaterialDocumentScreen.tsx
- AGENTS.md
- Операционные расходы
- Движение готовой продукции
- Движение производных
- Как собрать первый прототип

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 104 edges
2. `next` - 96 edges
3. `PageFrame()` - 93 edges
4. `react` - 76 edges
5. `keepWithNext()` - 63 edges
6. `useRole()` - 61 edges
7. `planMonthOpen()` - 59 edges
8. `useOpex()` - 59 edges
9. `ColumnLabel()` - 56 edges
10. `ratioRound()` - 55 edges

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

## Communities (87 total, 7 thin omitted)

### Community 0 - "production-journal-fact.ts"
Cohesion: 0.09
Nodes (32): Удаление, costWithVat(), UnitCost, Product, ProductCategory, amountWithVat(), averageAmount(), dayGridProducts() (+24 more)

### Community 1 - "ProductionPlanScreen.tsx"
Cohesion: 0.09
Nodes (35): metadata, ProductionFactPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+27 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.08
Nodes (59): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+51 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.06
Nodes (59): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, buildRow(), costForQuantity() (+51 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (32): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+24 more)

### Community 5 - "ColumnLabel"
Cohesion: 0.10
Nodes (27): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS (+19 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Отчет общий (производство), Отчет подневный (производство), Период и ассортимент, План производства (+15 more)

### Community 7 - "use-opex.ts"
Cohesion: 0.14
Nodes (28): HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrFieldRejection (+20 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.11
Nodes (27): metadata, SettingsPage(), readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue (+19 more)

### Community 11 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.11
Nodes (39): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), lineAmountWithVat(), quantityForAmount(), rowMetrics(), MaterialDialog(), commit(), formatQuantityDraft() (+31 more)

### Community 14 - "DerivativeFormTable.tsx"
Cohesion: 0.12
Nodes (23): CandidateGroup, CandidateRow, CandidateRowView(), DerivativeComponentKind, DerivativeFormTable(), GridInput(), GroupBlock(), SelectedGroup (+15 more)

### Community 15 - "HrFactScreen.tsx"
Cohesion: 0.13
Nodes (23): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), HR_SHOP_DEPARTMENT_IDS, isOccurredOn(), HR_DEPARTMENT_LABELS, hrDayOutsourcingHours() (+15 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.13
Nodes (23): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+15 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.25
Nodes (12): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+4 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.11
Nodes (48): MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine(), isMaterialGroupId() (+40 more)

### Community 20 - "MaterialJournalScreen.tsx"
Cohesion: 0.12
Nodes (24): MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen() (+16 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (61): adjacentDay(), COLUMNS, ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+53 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "keepWithNext"
Cohesion: 0.10
Nodes (53): TotalCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces() (+45 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (44): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+36 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.10
Nodes (35): recommendedDayKey(), defaultProductionJournalFactDay(), defaultSalesFactDay(), monthDates(), salesFactGridProducts(), salesFactMonth(), productionJournalFactHref(), ProductionJournalFactView (+27 more)

### Community 27 - "finished-goods.ts"
Cohesion: 0.11
Nodes (43): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+35 more)

### Community 28 - "movementRow"
Cohesion: 0.18
Nodes (19): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+11 more)

### Community 29 - "TransportPlanScreen.tsx"
Cohesion: 0.21
Nodes (15): metadata, OpexTransportPlanPage(), AddPositionDialog(), AddOtherLineDialog(), OPEX_TRANSPORT_PLAN_TITLE, opexTransportPlanHref(), AddCarrierDialog(), TransportPlanScreen() (+7 more)

### Community 30 - "SummaryScreen.tsx"
Cohesion: 0.11
Nodes (41): recommendedVolumePiecesForMonths(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, FullscreenToggle(), FullscreenToggle() (+33 more)

### Community 31 - "opex/paths.ts"
Cohesion: 0.06
Nodes (42): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage() (+34 more)

### Community 32 - "DerivativeCreateScreen.tsx"
Cohesion: 0.13
Nodes (31): DerivativePage(), metadata, metadata, NewDerivativePage(), activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull() (+23 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.13
Nodes (35): rangePlanProduction(), rangePlanSales(), amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factVolumeScale() (+27 more)

### Community 34 - "DerivativesScreen.tsx"
Cohesion: 0.16
Nodes (19): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes(), derivativeSections() (+11 more)

### Community 35 - "document.ts"
Cohesion: 0.06
Nodes (31): mockHrPositions, mockTransportCarriers, DeletableRecord, FinishedGoodsOpeningLine, HR_DEPARTMENT_IDS, HrAdminFactMonth, HrAdminFactStaffLine, HrDayFact (+23 more)

### Community 36 - "IconChevronDown"
Cohesion: 0.06
Nodes (62): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementRow, MaterialMovementTotals, DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey (+54 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (79): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+71 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "FinishedProductEditScreen.tsx"
Cohesion: 0.15
Nodes (28): MATERIAL_WAREHOUSES, ProductRecipeLine, ProductRecipeRejection, applyHeatTreatmentYield(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), formatQuantity(), componentDraftKey() (+20 more)

### Community 40 - "derivative-cost.ts"
Cohesion: 0.11
Nodes (38): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+30 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.12
Nodes (27): Поток данных, roleCanAccessPath(), roleHomeHref(), RoleGate(), useRole(), roleHasSection(), AppShell(), currentNavLabel() (+19 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "monthKeyFromDate"
Cohesion: 0.13
Nodes (34): activeCategories(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, activeProducts(), missingPlanProducts(), monthKeyFromDate(), planMonthOpen() (+26 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (51): HrDepartmentId, HrShopDepartmentId, isHrShopDepartmentId(), isMonthKey(), adminFactLine(), adminFactSide(), averageSalary(), dayFactsInMonth() (+43 more)

### Community 46 - "recipe-yield.ts"
Cohesion: 0.20
Nodes (12): outputPieceThousandthsOf(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, consumptionQuantityForComponent(), derivativeBatchThousandths(), RecipeComponentTarget, requirementFromDerivative(), isRecipeOutputKilogramThousandths() (+4 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.09
Nodes (50): Единицы, productCostPerPiece(), percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), periodGridProducts(), dayTotals(), rowMetrics() (+42 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.13
Nodes (25): metadata, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage() (+17 more)

### Community 50 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.11
Nodes (25): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), DayDateControl(), onKeyDown() (+17 more)

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
Cohesion: 0.18
Nodes (22): FinishedGoodsNormLine, finishedGoodsOpeningsList(), hasStoredInventoryLine(), storedInventoryPiecesForProduct(), workingFinishedGoodsOpening(), buildRow(), emptyNormLine(), emptyTotals() (+14 more)

### Community 58 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (44): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, occurredOnOpen(), factSpendByProduct(), addProductionEntry() (+36 more)

### Community 60 - "next"
Cohesion: 0.25
Nodes (9): nextConfig, next, Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE (+1 more)

### Community 61 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 62 - "PageFrame"
Cohesion: 0.19
Nodes (17): metadata, MovementPage(), useDocumentStore(), derivativeCostMonth(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen() (+9 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (21): MaterialsInventoryPage(), metadata, Material, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialWeightPair, MaterialDocumentRejection (+13 more)

### Community 65 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.11
Nodes (37): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_GROUPS (+29 more)

### Community 66 - "transport.ts"
Cohesion: 0.11
Nodes (34): isTransportVehicleId(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan, TransportVehicleId, hireAmount() (+26 more)

### Community 67 - "Архитектура прототипа"
Cohesion: 0.31
Nodes (5): Архитектура прототипа, Слои, Чего не делать, Запуск, Куда смотреть

### Community 68 - "layout.tsx"
Cohesion: 0.33
Nodes (4): metadata, onest, RootLayout(), unbounded

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (13): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+5 more)

### Community 70 - "planning/paths.ts"
Cohesion: 0.53
Nodes (4): metadata, PlanningPage(), parsePlanningQuery(), PLANNING_SECTION_TITLE

### Community 71 - "migrate-document.ts"
Cohesion: 0.33
Nodes (6): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, MaterialUnit, SCHEMA_VERSION

### Community 72 - "Icons.tsx"
Cohesion: 0.19
Nodes (26): react, salesPlanTotals, COLUMN_KIND, ColumnKey, COLUMNS, OtherGroupBlock(), GroupBlock(), OpexSummaryScreen() (+18 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.10
Nodes (34): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+26 more)

### Community 75 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 79 - "access.ts"
Cohesion: 0.18
Nodes (9): RECIPES_DERIVATIVES_HREF, HOME_SECTION_ORDER, pathnameSection(), SECTION_HOME, ROLES_HREF, ROLES_TITLE, NavSectionId, RoleDefinition (+1 more)

### Community 81 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (23): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), FinishedProductRecipePage(), metadata, activeMaterials(), DocumentForm() (+15 more)

### Community 82 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 83 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 84 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 85 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

### Community 86 - "Как собрать первый прототип"
Cohesion: 0.67
Nodes (3): Как собрать первый прототип, Порядок, Формула

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 496 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionPlanScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `ColumnLabel`, `package.json`, `RoleProvider.tsx`, `DerivativeFormTable.tsx`, `HrFactScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `TransportPlanScreen.tsx`, `SummaryScreen.tsx`, `opex/paths.ts`, `DerivativeCreateScreen.tsx`, `DerivativesScreen.tsx`, `SaleScreen.tsx`, `FinishedProductEditScreen.tsx`, `AppShell.tsx`, `monthKeyFromDate`, `recipes/paths.ts`, `FinishedGoodsFactScreen.tsx`, `ProductionEntryScreen.tsx`, `PageFrame`, `MaterialsPlanScreen.tsx`, `layout.tsx`, `planning/paths.ts`, `Icons.tsx`, `MaterialsNormsScreen`, `access.ts`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `production-journal-fact.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09047619047619047 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `ProductionPlanScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `ColumnLabel`, `package.json`, `RoleProvider.tsx`, `DerivativeFormTable.tsx`, `HrFactScreen.tsx`, `SummaryTable.tsx`, `RecipeJournalsTable.tsx`, `MaterialJournalScreen.tsx`, `index.ts`, `keepWithNext`, `MaterialReceiptFormTable.tsx`, `ProductionJournalFactScreen.tsx`, `TransportPlanScreen.tsx`, `SummaryScreen.tsx`, `DerivativeCreateScreen.tsx`, `IconChevronDown`, `SaleScreen.tsx`, `FinishedProductEditScreen.tsx`, `AppShell.tsx`, `monthKeyFromDate`, `recipes/paths.ts`, `FinishedGoodsFactScreen.tsx`, `ProductionEntryScreen.tsx`, `next`, `PageFrame`, `MaterialsPlanScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `DocumentProvider.tsx`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `ProductionPlanScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08773784355179703 - nodes in this community are weakly interconnected._
- **Why does `PageFrame()` connect `PageFrame` to `ProductionPlanScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `RoleProvider.tsx`, `DerivativeForm`, `HrFactScreen.tsx`, `RecipeJournalsTable.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `TransportPlanScreen.tsx`, `SummaryScreen.tsx`, `opex/paths.ts`, `DerivativeCreateScreen.tsx`, `DerivativesScreen.tsx`, `SaleScreen.tsx`, `FinishedProductEditScreen.tsx`, `monthKeyFromDate`, `recipes/paths.ts`, `FinishedGoodsFactScreen.tsx`, `ProductionEntryScreen.tsx`, `next`, `MaterialsPlanScreen.tsx`, `Icons.tsx`, `MaterialsNormsScreen`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08065268065268065 - nodes in this community are weakly interconnected._