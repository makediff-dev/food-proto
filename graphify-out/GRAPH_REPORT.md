# Graph Report - food-proto  (2026-11-04)

## Corpus Check
- 239 files · ~140,858 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2222 nodes · 8448 edges · 90 communities (83 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7386c9c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- MaterialsSummaryTable.tsx
- Предметная область
- Архитектура прототипа
- package.json
- biome.json
- RoleProvider.tsx
- RecipeComponentSearch
- compilerOptions
- DerivativeCreateScreen.tsx
- keepWithNext
- FinishedGoodsFactScreen.tsx
- SummaryTable.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- materials.ts
- next
- index.ts
- production-plan.ts
- sales-fact.ts
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsMonthTable.tsx
- finished-goods.ts
- use-opex.ts
- PlanningScreen.tsx
- SummaryScreen.tsx
- opex/paths.ts
- derivatives.ts
- production-fact.ts
- FinishedProductsScreen.tsx
- document.ts
- InventoryScreen.tsx
- SaleScreen.tsx
- flow.md
- RecipePrint.tsx
- derivative-cost.ts
- AppShell.tsx
- Отчет общий сырья
- movement-plan.ts
- postcss.config.mjs
- hr.ts
- FinishedGoodsMonthScreen.tsx
- Отчет общий движения
- SalesJournalScreen.tsx
- PlanRedirect.tsx
- monthKeyFromDate
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- use-materials.ts
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- recipe-yield.ts
- Отчет общий движения производных
- Icons.tsx
- ProductIndex
- transport.ts
- resolveMaterialMonth
- SalesFactScreen.tsx
- DocumentProvider.tsx
- MaterialsNormsScreen
- migrate-document.ts
- react
- Себестоимость готовой продукции
- operating-expense.ts
- PageFrame
- finished-product-cost.ts
- AGENTS.md
- Отчет подневный производства
- SettingsScreen.tsx
- recipes/new/page.tsx
- MaterialDocumentScreen.tsx
- ProductionJournalFactScreen.tsx
- FinishedProductCostTable.tsx
- Операционные расходы
- sumRows
- Движение готовой продукции
- Движение производных
- Как собрать первый прототип
- orderLines

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 100 edges
2. `next` - 92 edges
3. `PageFrame()` - 89 edges
4. `react` - 73 edges
5. `keepWithNext()` - 63 edges
6. `planMonthOpen()` - 59 edges
7. `useRole()` - 59 edges
8. `ratioRound()` - 55 edges
9. `VatMoneyCell()` - 55 edges
10. `ColumnLabel()` - 52 edges

## Surprising Connections (you probably didn't know these)
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Свод` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/tables/derivative-cost.md → src/domain/derivative-cost.ts
- `Свод` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/tables/finished-product-cost.md → src/domain/derivative-cost.ts

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

## Communities (90 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.10
Nodes (46): Единицы, SalesPlan, productCostPerPiece(), monthOperatingExpenseAmounts(), factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase (+38 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (70): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+62 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.09
Nodes (56): metadata, PlanningArchivePage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), deletedCategories(), renameCategory() (+48 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.10
Nodes (35): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+27 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (26): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+18 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.06
Nodes (67): Подсказки заголовков таблицы, DerivativeMovementRow, DerivativeMovementSection, WorkshopBlock(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable() (+59 more)

### Community 6 - "Предметная область"
Cohesion: 0.09
Nodes (23): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Отчет общий (производство), Отчет подневный (производство), Период и ассортимент, План производства (+15 more)

### Community 7 - "Архитектура прототипа"
Cohesion: 0.31
Nodes (5): Архитектура прототипа, Слои, Чего не делать, Запуск, Куда смотреть

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (22): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+14 more)

### Community 11 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.10
Nodes (50): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), changeWarehouse(), draftsForWarehouse(), lineAmountWithVat(), quantityForAmount(), rowMetrics() (+42 more)

### Community 14 - "keepWithNext"
Cohesion: 0.14
Nodes (33): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, DerivativeMovementInventoryTable(), CategoryBlock(), ColumnHeadings(), ColumnKey (+25 more)

### Community 15 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.18
Nodes (16): metadata, MovementFactPage(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth() (+8 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.14
Nodes (24): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+16 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.24
Nodes (13): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+5 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.08
Nodes (32): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+24 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (40): costExVat(), MaterialGroupId, MaterialReceiptLine, bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials(), deviationCostMoney() (+32 more)

### Community 20 - "next"
Cohesion: 0.10
Nodes (32): nextConfig, next, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+24 more)

### Community 21 - "index.ts"
Cohesion: 0.09
Nodes (57): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+49 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (27): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+19 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.09
Nodes (44): Удаление, costWithVat(), UnitCost, Product, PrototypeDocument, amountWithVat(), averageAmount(), percentHundredths() (+36 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.05
Nodes (80): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+72 more)

### Community 26 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.11
Nodes (33): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), COLUMN_GROUPS (+25 more)

### Community 27 - "finished-goods.ts"
Cohesion: 0.14
Nodes (38): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+30 more)

### Community 28 - "use-opex.ts"
Cohesion: 0.14
Nodes (29): HrTaxRatesMonth, isHrShopDepartmentId(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrFieldRejection, hrMonthPlan() (+21 more)

### Community 29 - "PlanningScreen.tsx"
Cohesion: 0.15
Nodes (22): metadata, PlanningPage(), activeProducts(), missingPlanProducts(), AddPositionDialog(), AddCarrierDialog(), parsePlanningQuery(), PLANNING_SECTION_TITLE (+14 more)

### Community 30 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (30): activeCategories(), recommendedVolumePiecesForMonths(), productionFactForLens(), rangeProductionFact(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange() (+22 more)

### Community 31 - "opex/paths.ts"
Cohesion: 0.06
Nodes (51): metadata, OpexHrFactPage(), metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexSummaryPage() (+43 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.10
Nodes (37): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection (+29 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.16
Nodes (30): plannedProductionVolumePieces(), rangePlanProduction(), rangePlanSales(), targetClosingPiecesFromNorm(), amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens() (+22 more)

### Community 34 - "FinishedProductsScreen.tsx"
Cohesion: 0.15
Nodes (15): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), ProductRecipeLine, productCompositionLines(), ProductRecipeRejection, productRecipeSections() (+7 more)

### Community 35 - "document.ts"
Cohesion: 0.06
Nodes (30): mockHrPositions, mockTransportCarriers, DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNormLine, FinishedGoodsOpeningLine, HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS (+22 more)

### Community 36 - "InventoryScreen.tsx"
Cohesion: 0.18
Nodes (13): metadata, MovementInventoryPage(), InventoryScreen(), resolveMonth(), Workspace(), open(), FinishedGoodsFactView, MOVEMENT_INVENTORY_TITLE (+5 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (60): metadata, SalePage(), metadata, NewSalePage(), ProductCategory, SaleLine, productAllowedInPeriodSale(), addSale() (+52 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "RecipePrint.tsx"
Cohesion: 0.13
Nodes (27): derivativeWorkshopById(), warehouseIdForWorkshop(), MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity() (+19 more)

### Community 40 - "derivative-cost.ts"
Cohesion: 0.20
Nodes (19): buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeConsumptionPrice() (+11 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.09
Nodes (37): Поток данных, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, MOVEMENT_SECTION_TITLE, RECIPES_COST_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_COST_HREF (+29 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "movement-plan.ts"
Cohesion: 0.14
Nodes (29): FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), storedInventoryPiecesForProduct(), workingFinishedGoodsOpening() (+21 more)

### Community 45 - "hr.ts"
Cohesion: 0.09
Nodes (39): HrDayStaffLine, HrDepartmentId, HrMonthPlanStaffLine, HrShopDepartmentId, adminFactLine(), adminFactSide(), averageSalary(), dayFactsInMonth() (+31 more)

### Community 46 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "SalesJournalScreen.tsx"
Cohesion: 0.20
Nodes (15): metadata, SalesJournalPage(), saleTotals, workingSalesInMonth(), parseSalesJournalQuery(), saleHref(), saleNewHref(), groupSalesByDay() (+7 more)

### Community 49 - "PlanRedirect.tsx"
Cohesion: 0.29
Nodes (9): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref(), PlanRedirect() (+1 more)

### Community 50 - "monthKeyFromDate"
Cohesion: 0.16
Nodes (22): metadata, MovementPlanPage(), missingProductionPlanProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), resolveMonth() (+14 more)

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

### Community 58 - "use-materials.ts"
Cohesion: 0.18
Nodes (26): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+18 more)

### Community 62 - "recipe-yield.ts"
Cohesion: 0.28
Nodes (11): isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths() (+3 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "Icons.tsx"
Cohesion: 0.19
Nodes (19): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+11 more)

### Community 65 - "ProductIndex"
Cohesion: 0.11
Nodes (27): MaterialRow(), editableFieldNear(), ProductRow(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+19 more)

### Community 66 - "transport.ts"
Cohesion: 0.09
Nodes (39): isOccurredOn(), isTransportHireKind(), isTransportVehicleId(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan (+31 more)

### Community 67 - "resolveMaterialMonth"
Cohesion: 0.15
Nodes (24): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), DerivativeMovementInventoryScreen() (+16 more)

### Community 68 - "SalesFactScreen.tsx"
Cohesion: 0.17
Nodes (18): metadata, SalesFactPage(), parseSalesFactQuery(), SALES_FACT_TITLE, SALES_SECTION_TITLE, salesFactHref(), SalesFactView, DayDateControl() (+10 more)

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.25
Nodes (12): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+4 more)

### Community 70 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 71 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

### Community 72 - "react"
Cohesion: 0.14
Nodes (38): react, HR_DEPARTMENT_LABELS, DerivativeRow(), COLUMNS, MaterialsInventoryTable(), NormCell(), QuantityCell(), HrPlanScreen() (+30 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.13
Nodes (22): isOpexEditableLineId(), OPEX_EDITABLE_LINE_IDS, OpexEditableLineId, OpexMonthLine, OpexMonthLines, AGENCY_FEE_PERCENT, agencyPlanExVat(), GroupDef (+14 more)

### Community 75 - "PageFrame"
Cohesion: 0.16
Nodes (23): metadata, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage() (+15 more)

### Community 76 - "finished-product-cost.ts"
Cohesion: 0.18
Nodes (20): Свод, Свод, buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode (+12 more)

### Community 77 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 79 - "SettingsScreen.tsx"
Cohesion: 0.15
Nodes (14): metadata, SettingsPage(), ROLES_HREF, ROLES_TITLE, PERMISSION_MATRIX_ROWS, permissionAllowed(), ROLES, RolesMatrix() (+6 more)

### Community 80 - "recipes/new/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, NewDerivativePage(), DerivativeCreateScreen(), NEW_DERIVATIVE_TITLE

### Community 81 - "MaterialDocumentScreen.tsx"
Cohesion: 0.20
Nodes (16): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), DocumentForm(), save(), setLine() (+8 more)

### Community 82 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.22
Nodes (14): defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), productionJournalFactPageTitle(), ProductionJournalFactScreen(), resolveDay() (+6 more)

### Community 83 - "FinishedProductCostTable.tsx"
Cohesion: 0.29
Nodes (10): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostRow(), FinishedProductCostTable(), GROUP_END_KEYS (+2 more)

### Community 84 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 85 - "sumRows"
Cohesion: 0.67
Nodes (4): addMoney(), addMoneyNullable(), emptyTotals(), sumRows()

### Community 86 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 87 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

### Community 88 - "Как собрать первый прототип"
Cohesion: 0.67
Nodes (3): Как собрать первый прототип, Порядок, Формула

### Community 89 - "orderLines"
Cohesion: 0.67
Nodes (3): orderLines(), productionFromOrders(), salesFromOrders()

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 488 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `package.json`, `RoleProvider.tsx`, `DerivativeCreateScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `opex/paths.ts`, `derivatives.ts`, `FinishedProductsScreen.tsx`, `InventoryScreen.tsx`, `SaleScreen.tsx`, `AppShell.tsx`, `FinishedGoodsMonthScreen.tsx`, `SalesJournalScreen.tsx`, `PlanRedirect.tsx`, `monthKeyFromDate`, `ProductIndex`, `resolveMaterialMonth`, `SalesFactScreen.tsx`, `MaterialsNormsScreen`, `react`, `PageFrame`, `SettingsScreen.tsx`, `recipes/new/page.tsx`, `MaterialDocumentScreen.tsx`, `ProductionJournalFactScreen.tsx`, `FinishedProductCostTable.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10195035460992907 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `MaterialsSummaryTable.tsx`, `package.json`, `RoleProvider.tsx`, `DerivativeCreateScreen.tsx`, `keepWithNext`, `FinishedGoodsFactScreen.tsx`, `SummaryTable.tsx`, `RecipeJournalsTable.tsx`, `next`, `index.ts`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsMonthTable.tsx`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `InventoryScreen.tsx`, `SaleScreen.tsx`, `AppShell.tsx`, `FinishedGoodsMonthScreen.tsx`, `SalesJournalScreen.tsx`, `PlanRedirect.tsx`, `monthKeyFromDate`, `Icons.tsx`, `ProductIndex`, `resolveMaterialMonth`, `SalesFactScreen.tsx`, `DocumentProvider.tsx`, `PageFrame`, `MaterialDocumentScreen.tsx`, `ProductionJournalFactScreen.tsx`, `FinishedProductCostTable.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05495151337055539 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `summary.ts`, `ProductionEntryScreen.tsx`, `sales-plan.ts`, `FinishedGoodsFactScreen.tsx`, `next`, `sales-fact.ts`, `finished-goods.ts`, `PlanningScreen.tsx`, `SummaryScreen.tsx`, `opex/paths.ts`, `production-fact.ts`, `InventoryScreen.tsx`, `SaleScreen.tsx`, `hr.ts`, `FinishedGoodsMonthScreen.tsx`, `SalesJournalScreen.tsx`, `PlanRedirect.tsx`, `resolveMaterialMonth`, `SalesFactScreen.tsx`, `react`, `PageFrame`, `MaterialDocumentScreen.tsx`, `ProductionJournalFactScreen.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08653353814644137 - nodes in this community are weakly interconnected._