# Graph Report - food-proto  (2026-11-03)

## Corpus Check
- 241 files · ~141,720 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: .mdc 5, (none) 1, .b64 1)

## Summary
- 2238 nodes · 8475 edges · 85 communities (77 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7124a1f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- MaterialsSummaryTable.tsx
- Предметная область
- sales-fact.ts
- package.json
- biome.json
- RoleProvider.tsx
- DerivativeFormTable.tsx
- compilerOptions
- DerivativeCreateScreen.tsx
- ProductionFactTable.tsx
- keepWithNext
- SummaryTable.tsx
- RecipeJournalsTable.tsx
- document.ts
- materials.ts
- SummaryHeadlineTable.tsx
- index.ts
- production-plan.ts
- production-journal-fact.ts
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsMonthTable.tsx
- finished-goods.ts
- use-opex.ts
- PlanningScreen.tsx
- planMonthOpen
- opex/paths.ts
- derivatives.ts
- production-fact.ts
- recipes/new/page.tsx
- mock-opex.ts
- MovementPlanScreen.tsx
- SaleScreen.tsx
- flow.md
- RecipePrint.tsx
- ProductionPlanScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- verify-opex-chain.mts
- postcss.config.mjs
- hr.ts
- FinishedGoodsMonthScreen.tsx
- Отчет общий движения
- SalesJournalScreen.tsx
- MaterialsPlanScreen.tsx
- ProductionJournalFactTable.tsx
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
- RecipeComponentSearch
- Отчет общий движения производных
- FinishedGoodsFactScreen.tsx
- seed-opex-doc.mts
- transport.ts
- next
- SalesFactScreen.tsx
- DocumentProvider.tsx
- MaterialsNormsScreen.tsx
- PlanRedirect.tsx
- monthKeyFromDate
- Себестоимость готовой продукции
- operating-expense.ts
- PageFrame
- derivative-cost.ts
- FinishedProductsScreen.tsx
- Отчет подневный производства
- ratioRound
- sales-plan.ts
- MaterialDocumentScreen.tsx
- ProductionJournalFactScreen.tsx
- recipe-yield.ts
- migrate-document.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 100 edges
2. `next` - 91 edges
3. `PageFrame()` - 89 edges
4. `react` - 73 edges
5. `keepWithNext()` - 63 edges
6. `planMonthOpen()` - 59 edges
7. `useRole()` - 58 edges
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
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Удаление` --references--> `finishedGoodsGridProducts()`  [INFERRED]
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

## Communities (85 total, 8 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (45): Единицы, PROFIT_TAX_PERCENT, SalesPlan, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), factVolumeScale(), planVolumeScale() (+37 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (69): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+61 more)

### Community 2 - "products.ts"
Cohesion: 0.12
Nodes (38): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+30 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.14
Nodes (26): buildRow(), costForQuantity(), DerivativeMovementMonthView, derivativeNormMetrics(), derivativeNormsList(), derivativeOpeningsList(), factConsumptionQuantityForDerivative(), factProductionVolumePiecesForProduct() (+18 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (29): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+21 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.12
Nodes (29): MaterialMovementTotals, RowCell(), RowCell(), MaterialNormDeviation(), MaterialsInventoryTable(), ColumnKey, COLUMNS, MaterialsPlanTable() (+21 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (41): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+33 more)

### Community 7 - "sales-fact.ts"
Cohesion: 0.12
Nodes (26): Архитектура прототипа, Поток данных, Слои, Удаление, Чего не делать, Product, PrototypeDocument, productCostPerPiece() (+18 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.09
Nodes (30): metadata, onest, RootLayout(), unbounded, metadata, RolesPage(), readRole(), ROLE_STORAGE_KEY (+22 more)

### Community 11 - "DerivativeFormTable.tsx"
Cohesion: 0.08
Nodes (49): DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable(), DerivativeRow(), WorkshopBlock() (+41 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.09
Nodes (54): DerivativePage(), metadata, outputPieceThousandthsOf(), DERIVATIVE_WORKSHOPS, activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), changeWarehouse() (+46 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.12
Nodes (41): TotalCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces() (+33 more)

### Community 15 - "keepWithNext"
Cohesion: 0.09
Nodes (35): Подсказки заголовков таблицы, DerivativeMovementRow, DerivativeMovementSection, DerivativeMovementInventoryTable(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey (+27 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (32): SalesPlanRejection, averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED (+24 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.19
Nodes (17): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+9 more)

### Community 18 - "document.ts"
Cohesion: 0.07
Nodes (38): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+30 more)

### Community 19 - "materials.ts"
Cohesion: 0.12
Nodes (37): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+29 more)

### Community 20 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (69): react, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS (+61 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.15
Nodes (25): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+17 more)

### Community 23 - "production-journal-fact.ts"
Cohesion: 0.12
Nodes (23): costWithVat(), UnitCost, priceAverage(), sumRows(), amountWithVat(), averageAmount(), periodReferencedProductIds(), productionFactGridProducts() (+15 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (62): ProductCategory, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), buildGroups() (+54 more)

### Community 26 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.13
Nodes (31): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell(), ProductRow() (+23 more)

### Community 27 - "finished-goods.ts"
Cohesion: 0.08
Nodes (67): FinishedGoodsNormLine, FinishedGoodsOpeningLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics() (+59 more)

### Community 28 - "use-opex.ts"
Cohesion: 0.13
Nodes (31): HrTaxRatesMonth, isHrShopDepartmentId(), isOccurredOn(), finishedGoodsSummaryAsOfDate(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition() (+23 more)

### Community 29 - "PlanningScreen.tsx"
Cohesion: 0.12
Nodes (29): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), AddPositionDialog() (+21 more)

### Community 30 - "planMonthOpen"
Cohesion: 0.22
Nodes (22): activeCategories(), planMonthOpen(), ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), SummaryLens, productionFactHref(), productionFactPageTitle() (+14 more)

### Community 31 - "opex/paths.ts"
Cohesion: 0.10
Nodes (26): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexSummaryPage(), metadata, OpexTransportPage() (+18 more)

### Community 32 - "derivatives.ts"
Cohesion: 0.12
Nodes (32): metadata, RecipeDerivativesPage(), setDerivativeNormRejection(), setDerivativeOpeningRejection(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection (+24 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.16
Nodes (27): amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts() (+19 more)

### Community 34 - "recipes/new/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, NewDerivativePage(), DerivativeCreateScreen(), NEW_DERIVATIVE_TITLE

### Community 35 - "mock-opex.ts"
Cohesion: 0.20
Nodes (5): mockHrPositions, mockTransportCarriers, HrPosition, TRANSPORT_VEHICLE_IDS, TransportCarrier

### Community 36 - "MovementPlanScreen.tsx"
Cohesion: 0.12
Nodes (22): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), InventoryScreen(), resolveMonth(), Workspace(), open() (+14 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.10
Nodes (45): metadata, SalePage(), metadata, NewSalePage(), commitDocumentUpdate(), SaleLine, addSale(), addSaleRejection() (+37 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "RecipePrint.tsx"
Cohesion: 0.21
Nodes (19): derivativeWorkshopById(), warehouseIdForWorkshop(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), componentDraftKey(), derivativePrintModel(), draftsFromSavedLines(), formatPrintKilograms() (+11 more)

### Community 40 - "ProductionPlanScreen.tsx"
Cohesion: 0.26
Nodes (10): missingProductionPlanProducts(), activeProducts(), productionPlanHref(), FullscreenToggle(), ProductionPlanScreen(), resolveMonth(), Workspace(), open() (+2 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.08
Nodes (41): DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, RECIPES_COST_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_COST_HREF (+33 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "verify-opex-chain.mts"
Cohesion: 0.12
Nodes (15): admin, amounts, bakery, bakeryPos, carrier, director, doc, energy (+7 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (38): HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrAdminFactMonth, HrAdminFactStaffLine, HrDayFact, HrDayOutsourcingLine, HrDayStaffLine, HrDepartmentId (+30 more)

### Community 46 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.17
Nodes (22): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FullscreenToggle(), FinishedGoodsMonthScreen(), FullscreenToggle() (+14 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "SalesJournalScreen.tsx"
Cohesion: 0.18
Nodes (19): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, workingSalesInMonth(), parseSalesFactQuery(), parseSalesJournalQuery() (+11 more)

### Community 49 - "MaterialsPlanScreen.tsx"
Cohesion: 0.10
Nodes (23): MaterialsInventoryPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection (+15 more)

### Community 50 - "ProductionJournalFactTable.tsx"
Cohesion: 0.23
Nodes (14): ArrowButton(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, DayLabel(), dayOfMonth(), Pieces() (+6 more)

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
Cohesion: 0.17
Nodes (28): addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId() (+20 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Карточка, Себестоимость производных, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.17
Nodes (16): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay(), resolveMonth() (+8 more)

### Community 65 - "seed-opex-doc.mts"
Cohesion: 0.17
Nodes (10): bakery, carrier, director, doc, out, DOCUMENT_STORAGE_KEY, isRateHundredths(), setHrTaxRate() (+2 more)

### Community 66 - "transport.ts"
Cohesion: 0.11
Nodes (31): isMonthKey(), isTransportHireKind(), isTransportVehicleId(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan (+23 more)

### Community 67 - "next"
Cohesion: 0.10
Nodes (34): nextConfig, next, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata (+26 more)

### Community 68 - "SalesFactScreen.tsx"
Cohesion: 0.18
Nodes (18): finishedGoodsFactPageTitle(), productionJournalFactPageTitle(), salesFactHref(), SalesFactView, DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay() (+10 more)

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.27
Nodes (11): clearDocument(), DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource, DocumentState (+3 more)

### Community 70 - "MaterialsNormsScreen.tsx"
Cohesion: 0.31
Nodes (8): MaterialsNormsPage(), metadata, MATERIAL_WAREHOUSES, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 71 - "PlanRedirect.tsx"
Cohesion: 0.32
Nodes (8): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref(), PlanRedirect()

### Community 72 - "monthKeyFromDate"
Cohesion: 0.10
Nodes (49): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), HR_DEPARTMENT_LABELS, hrDayOutsourcingHours(), hrDayStaffValue(), hrTaxRatesOrDefault() (+41 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.13
Nodes (22): isOpexEditableLineId(), OPEX_EDITABLE_LINE_IDS, OpexEditableLineId, OpexMonthLine, OpexMonthLines, AGENCY_FEE_PERCENT, agencyPlanExVat(), GroupDef (+14 more)

### Community 75 - "PageFrame"
Cohesion: 0.14
Nodes (24): metadata, RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage() (+16 more)

### Community 76 - "derivative-cost.ts"
Cohesion: 0.10
Nodes (38): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+30 more)

### Community 77 - "FinishedProductsScreen.tsx"
Cohesion: 0.20
Nodes (12): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductEditScreen(), FinishedProductsScreen() (+4 more)

### Community 79 - "ratioRound"
Cohesion: 0.24
Nodes (12): factShopHeadcountThousandths(), factShopSalaryExVat(), outsourcingAmountExVat(), taxAmountExVat(), ratioRound(), hireAmount(), hirePlanLine(), ownDayFuelAmountExVat() (+4 more)

### Community 80 - "sales-plan.ts"
Cohesion: 0.15
Nodes (28): rangePlanProduction(), rangePlanSales(), productionPlanLineMetrics, activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection(), addSalesPlan(), createRejection() (+20 more)

### Community 81 - "MaterialDocumentScreen.tsx"
Cohesion: 0.10
Nodes (34): MaterialsPlanPage(), metadata, MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MaterialReceiptsPage(), metadata (+26 more)

### Community 82 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.18
Nodes (17): recommendedDayKey(), defaultProductionJournalFactDay(), shiftMonth(), lastHorizonMonth(), productionJournalFactHref(), ProductionJournalFactView, DayDateControl(), onKeyDown() (+9 more)

### Community 83 - "recipe-yield.ts"
Cohesion: 0.27
Nodes (10): MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef (+2 more)

### Community 84 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 508 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `RoleProvider.tsx`, `DerivativeCreateScreen.tsx`, `RecipeJournalsTable.tsx`, `index.ts`, `PlanningScreen.tsx`, `planMonthOpen`, `opex/paths.ts`, `derivatives.ts`, `recipes/new/page.tsx`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `ProductionPlanScreen.tsx`, `AppShell.tsx`, `FinishedGoodsMonthScreen.tsx`, `SalesJournalScreen.tsx`, `MaterialsPlanScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesFactScreen.tsx`, `MaterialsNormsScreen.tsx`, `PlanRedirect.tsx`, `monthKeyFromDate`, `PageFrame`, `FinishedProductsScreen.tsx`, `MaterialDocumentScreen.tsx`, `ProductionJournalFactScreen.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10823311748381129 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `ProductionEntryScreen.tsx`, `MaterialsSummaryTable.tsx`, `package.json`, `RoleProvider.tsx`, `DerivativeFormTable.tsx`, `DerivativeCreateScreen.tsx`, `ProductionFactTable.tsx`, `keepWithNext`, `SummaryTable.tsx`, `RecipeJournalsTable.tsx`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsMonthTable.tsx`, `PlanningScreen.tsx`, `planMonthOpen`, `opex/paths.ts`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `ProductionPlanScreen.tsx`, `AppShell.tsx`, `FinishedGoodsMonthScreen.tsx`, `SalesJournalScreen.tsx`, `MaterialsPlanScreen.tsx`, `ProductionJournalFactTable.tsx`, `FinishedGoodsFactScreen.tsx`, `next`, `SalesFactScreen.tsx`, `DocumentProvider.tsx`, `PlanRedirect.tsx`, `monthKeyFromDate`, `PageFrame`, `MaterialDocumentScreen.tsx`, `ProductionJournalFactScreen.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05540499849442939 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `summary.ts`, `ProductionEntryScreen.tsx`, `sales-fact.ts`, `finished-goods.ts`, `PlanningScreen.tsx`, `planMonthOpen`, `opex/paths.ts`, `production-fact.ts`, `MovementPlanScreen.tsx`, `SaleScreen.tsx`, `ProductionPlanScreen.tsx`, `hr.ts`, `FinishedGoodsMonthScreen.tsx`, `SalesJournalScreen.tsx`, `MaterialsPlanScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `next`, `SalesFactScreen.tsx`, `PlanRedirect.tsx`, `PageFrame`, `sales-plan.ts`, `MaterialDocumentScreen.tsx`, `ProductionJournalFactScreen.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12292358803986711 - nodes in this community are weakly interconnected._