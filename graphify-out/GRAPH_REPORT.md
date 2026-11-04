# Graph Report - food-proto  (2026-11-04)

## Corpus Check
- 243 files · ~143,954 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2265 nodes · 8725 edges · 82 communities (75 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2542648`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Icons.tsx
- ProductionEntryScreen.tsx
- products.ts
- derivative-movement.ts
- mock-document.ts
- materials.ts
- Предметная область
- use-opex.ts
- package.json
- biome.json
- RoleProvider.tsx
- FinishedProductEditScreen.tsx
- compilerOptions
- DerivativeForm
- finished-goods.ts
- opex/paths.ts
- SummaryTable.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- use-materials.ts
- materials/paths.ts
- index.ts
- production-plan.ts
- FinishedGoodsMonthTable.tsx
- Флоу товара
- MaterialReceiptFormTable.tsx
- FinishedGoodsFactScreen.tsx
- SalesJournalScreen.tsx
- movementRow
- react
- production-fact.ts
- MaterialDocumentScreen.tsx
- DerivativesScreen.tsx
- SummaryScreen.tsx
- ProductionJournalScreen.tsx
- document.ts
- IconChevronDown
- SaleScreen.tsx
- flow.md
- materialReceiptsList
- derivative-cost.ts
- AppShell.tsx
- Отчет общий сырья
- planMonthOpen
- postcss.config.mjs
- hr.ts
- DerivativeCreateScreen.tsx
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- FinishedGoodsMonthScreen.tsx
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
- SummaryHeadlineTable.tsx
- Отчет общий движения производных
- derivatives.ts
- ColumnLabel
- transport.ts
- IconFullscreen
- hr/fact/page.tsx
- useDocumentStore
- finished/cost/[id]/page.tsx
- DerivativeMovementPlanScreen.tsx
- Себестоимость готовой продукции
- operating-expense.ts
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- SettingsScreen.tsx
- Отчет подневный продаж
- TransportFactScreen.tsx
- sales-plan.ts
- monthKeyFromDate

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

## Communities (82 total, 7 thin omitted)

### Community 0 - "Icons.tsx"
Cohesion: 0.11
Nodes (31): RowCell(), MaterialNormDeviation(), ColumnKey, COLUMNS, MaterialsPlanTable(), materialUnitHint(), PlanCell(), planColumnKind() (+23 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.16
Nodes (20): metadata, ProductionEntryPage(), NewProductionEntryPage(), periodGridProducts(), defaultProductionEntryDay(), emptyProductionEntryLineDraft(), ProductionEntryLineDraft, ProductionEntryLineField (+12 more)

### Community 2 - "products.ts"
Cohesion: 0.13
Nodes (35): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+27 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (33): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+25 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (32): burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms (+24 more)

### Community 5 - "materials.ts"
Cohesion: 0.10
Nodes (29): MATERIAL_GROUPS, MATERIAL_UNITS, MATERIAL_WAREHOUSES, MaterialGroupId, MaterialReceiptLine, MaterialUnit, MaterialWarehouseId, MaterialWeightPair (+21 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (41): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+33 more)

### Community 7 - "use-opex.ts"
Cohesion: 0.13
Nodes (35): HrTaxRatesMonth, isDeletionMark(), isHrShopDepartmentId(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), hrMonthPlan() (+27 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (21): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+13 more)

### Community 11 - "FinishedProductEditScreen.tsx"
Cohesion: 0.11
Nodes (25): FinishedProductRecipePage(), metadata, ProductRecipeLine, activeMaterials(), ProductRecipeRejection, addComponent(), setQuantity(), buildCandidateGroups() (+17 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.13
Nodes (29): outputPieceThousandthsOf(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), lineAmountWithVat(), quantityForAmount(), rowMetrics(), MaterialDialog(), commit() (+21 more)

### Community 14 - "finished-goods.ts"
Cohesion: 0.10
Nodes (56): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+48 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.06
Nodes (45): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage() (+37 more)

### Community 16 - "SummaryTable.tsx"
Cohesion: 0.09
Nodes (57): TotalCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces() (+49 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.23
Nodes (13): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, RecipeListSection (+5 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.19
Nodes (26): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+18 more)

### Community 20 - "materials/paths.ts"
Cohesion: 0.15
Nodes (16): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+8 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (59): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+51 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (23): Product, ProductionPlanLine, activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+15 more)

### Community 23 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.08
Nodes (51): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, MetricCell(), CategoryBlock() (+43 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.05
Nodes (64): ProductCategory, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+56 more)

### Community 26 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.10
Nodes (34): metadata, MovementFactPage(), salesFactGridProducts(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth() (+26 more)

### Community 27 - "SalesJournalScreen.tsx"
Cohesion: 0.17
Nodes (20): metadata, SalesJournalPage(), metadata, SalesFactPage(), saleTotals, workingSales(), workingSalesInMonth(), parseSalesFactQuery() (+12 more)

### Community 28 - "movementRow"
Cohesion: 0.16
Nodes (21): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals() (+13 more)

### Community 29 - "react"
Cohesion: 0.15
Nodes (39): react, HR_DEPARTMENT_LABELS, DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+31 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.14
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 31 - "MaterialDocumentScreen.tsx"
Cohesion: 0.16
Nodes (20): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse() (+12 more)

### Community 32 - "DerivativesScreen.tsx"
Cohesion: 0.14
Nodes (21): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), activeDerivatives(), deleteDerivative(), derivativeCompositionLines(), derivativeNameRejection (+13 more)

### Community 33 - "SummaryScreen.tsx"
Cohesion: 0.11
Nodes (36): Home(), metadata, metadata, PlanPage(), recommendedVolumePiecesForMonths(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange() (+28 more)

### Community 34 - "ProductionJournalScreen.tsx"
Cohesion: 0.11
Nodes (28): metadata, ProductionFactPage(), metadata, metadata, ProductionJournalPage(), metadata, ProductionPage(), ProductionEntry (+20 more)

### Community 35 - "document.ts"
Cohesion: 0.06
Nodes (31): mockHrPositions, mockTransportCarriers, DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNormLine, FinishedGoodsOpeningLine, HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS (+23 more)

### Community 36 - "IconChevronDown"
Cohesion: 0.12
Nodes (34): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostCell(), CostRow(), DerivativeCostTable() (+26 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.12
Nodes (34): metadata, SalePage(), metadata, NewSalePage(), defaultSaleDay(), maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat() (+26 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "materialReceiptsList"
Cohesion: 0.16
Nodes (14): emptyPlanLine(), hasStoredMaterialInventoryLine(), liveNorms(), materialConsumptionIsNormed(), materialMonthPlansList(), materialNormsList(), materialOpeningsList(), materialReceiptsInMonth() (+6 more)

### Community 40 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (44): Свод, Свод, DerivativePage(), metadata, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch() (+36 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.08
Nodes (38): Поток данных, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE, DERIVATIVE_MOVEMENT_SUMMARY_HREF, MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, RECIPES_DERIVATIVES_HREF (+30 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "planMonthOpen"
Cohesion: 0.09
Nodes (41): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), metadata, ProductionPlanPage(), activeCategories(), emptyTotals() (+33 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (40): HrAdminFactStaffLine, HrDayFact, HrDepartmentId, HrMonthPlanStaffLine, HrShopDepartmentId, adminFactLine(), adminFactSide(), averageSalary() (+32 more)

### Community 46 - "DerivativeCreateScreen.tsx"
Cohesion: 0.18
Nodes (25): DerivativeAddRejection, derivativeWorkshopById(), warehouseIdForWorkshop(), DERIVATIVE_WORKSHOPS, applyHeatTreatmentYield(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), formatQuantity() (+17 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.09
Nodes (54): Единицы, Удаление, PrototypeDocument, SalesPlan, productCostPerPiece(), averageAmount(), percentHundredths(), vatPercentHundredths() (+46 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.18
Nodes (16): RecipesCostDetailPage(), metadata, RecipesCostPage(), metadata, NewDerivativePage(), derivativeCostMonth(), isDerivativeWorkshopId(), DerivativeCostScreen() (+8 more)

### Community 50 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

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
Nodes (31): recommendedDayKey(), periodReferencedProductIds(), productionFactGridProducts(), dayTotals(), defaultProductionJournalFactDay(), ProductionJournalFactDayView, productionJournalFactGridProducts(), ProductionJournalFactGroup (+23 more)

### Community 58 - "next"
Cohesion: 0.27
Nodes (8): nextConfig, next, metadata, PlanningArchivePage(), PLANNING_ARCHIVE_TITLE, planningHref(), PlanningArchiveScreen(), FIELD_ERROR

### Community 60 - "MaterialsNormsScreen.tsx"
Cohesion: 0.36
Nodes (7): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE

### Community 61 - "PlanningScreen.tsx"
Cohesion: 0.18
Nodes (16): metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_SECTION_TITLE, planningArchiveHref(), AddCategoryDialog() (+8 more)

### Community 62 - "SummaryHeadlineTable.tsx"
Cohesion: 0.33
Nodes (11): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+3 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "derivatives.ts"
Cohesion: 0.14
Nodes (25): addDerivative(), DerivativeCompositionLineView, isDerivativeUnit(), lineKey(), updateDerivative(), validateLines(), writeRejection(), Derivative (+17 more)

### Community 65 - "ColumnLabel"
Cohesion: 0.10
Nodes (28): Подсказки заголовков таблицы, DerivativeMovementRow, DerivativeMovementSection, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+20 more)

### Community 66 - "transport.ts"
Cohesion: 0.08
Nodes (42): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, isMonthKey(), isTransportHireKind(), isTransportVehicleId(), TRANSPORT_HIRE_KINDS (+34 more)

### Community 67 - "IconFullscreen"
Cohesion: 0.43
Nodes (8): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), IconFullscreen(), IconFullscreenExit()

### Community 68 - "hr/fact/page.tsx"
Cohesion: 0.28
Nodes (7): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), OPEX_HR_FACT_TITLE, OPEX_TRANSPORT_FACT_TITLE, parseOpexDayQuery()

### Community 69 - "useDocumentStore"
Cohesion: 0.06
Nodes (65): Архитектура прототипа, Слои, Чего не делать, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument() (+57 more)

### Community 70 - "finished/cost/[id]/page.tsx"
Cohesion: 0.67
Nodes (3): RecipesFinishedCostDetailPage(), parseRecipesFinishedCostMonthQuery(), RECIPES_FINISHED_COST_HREF

### Community 72 - "DerivativeMovementPlanScreen.tsx"
Cohesion: 0.15
Nodes (19): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), DerivativeMovementInventoryScreen() (+11 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.10
Nodes (35): isOpexGroupCode(), OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+27 more)

### Community 79 - "SettingsScreen.tsx"
Cohesion: 0.16
Nodes (14): metadata, SettingsPage(), ROLES_HREF, ROLES_TITLE, isRoleId(), permissionAllowed(), ROLES, RolesMatrix() (+6 more)

### Community 81 - "TransportFactScreen.tsx"
Cohesion: 0.14
Nodes (23): isOccurredOn(), hrDayOutsourcingHours(), hrDayStaffValue(), HrFieldRejection, OpexFieldRejection, defaultSalesFactDay(), TransportFieldRejection, transportHireDayValue() (+15 more)

### Community 82 - "sales-plan.ts"
Cohesion: 0.13
Nodes (30): costWithVat(), UnitCost, amountExVat(), amountWithVat(), ratioRound(), ProductionJournalFactRow, productionPlanLineMetrics, SalesFactRow (+22 more)

### Community 83 - "monthKeyFromDate"
Cohesion: 0.13
Nodes (35): metadata, RecipesFinishedCostPage(), monthKeyFromDate(), DerivativeMovementSummaryScreen(), derivativeMovementSummaryHref(), MaterialJournalScreen(), MaterialMonthBar(), resolveMaterialMonth() (+27 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 493 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `materials.ts`, `package.json`, `RoleProvider.tsx`, `FinishedProductEditScreen.tsx`, `opex/paths.ts`, `RecipeJournalsTable.tsx`, `materials/paths.ts`, `FinishedGoodsFactScreen.tsx`, `SalesJournalScreen.tsx`, `react`, `MaterialDocumentScreen.tsx`, `DerivativesScreen.tsx`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `SaleScreen.tsx`, `derivative-cost.ts`, `AppShell.tsx`, `planMonthOpen`, `DerivativeCreateScreen.tsx`, `recipes/paths.ts`, `FinishedGoodsMonthScreen.tsx`, `ProductionJournalFactScreen.tsx`, `MaterialsNormsScreen.tsx`, `PlanningScreen.tsx`, `hr/fact/page.tsx`, `finished/cost/[id]/page.tsx`, `DerivativeMovementPlanScreen.tsx`, `SettingsScreen.tsx`, `TransportFactScreen.tsx`, `monthKeyFromDate`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Icons.tsx`, `ProductionEntryScreen.tsx`, `materials.ts`, `package.json`, `RoleProvider.tsx`, `FinishedProductEditScreen.tsx`, `SummaryTable.tsx`, `RecipeJournalsTable.tsx`, `index.ts`, `FinishedGoodsMonthTable.tsx`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsFactScreen.tsx`, `SalesJournalScreen.tsx`, `MaterialDocumentScreen.tsx`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `IconChevronDown`, `SaleScreen.tsx`, `AppShell.tsx`, `planMonthOpen`, `DerivativeCreateScreen.tsx`, `recipes/paths.ts`, `FinishedGoodsMonthScreen.tsx`, `ProductionJournalFactScreen.tsx`, `next`, `PlanningScreen.tsx`, `ColumnLabel`, `useDocumentStore`, `DerivativeMovementPlanScreen.tsx`, `TransportFactScreen.tsx`, `monthKeyFromDate`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1349527665317139 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `materials.ts`, `finished-goods.ts`, `opex/paths.ts`, `FinishedGoodsFactScreen.tsx`, `SalesJournalScreen.tsx`, `react`, `production-fact.ts`, `MaterialDocumentScreen.tsx`, `SummaryScreen.tsx`, `ProductionJournalScreen.tsx`, `SaleScreen.tsx`, `planMonthOpen`, `hr.ts`, `summary.ts`, `recipes/paths.ts`, `FinishedGoodsMonthScreen.tsx`, `ProductionJournalFactScreen.tsx`, `PlanningScreen.tsx`, `useDocumentStore`, `DerivativeMovementPlanScreen.tsx`, `TransportFactScreen.tsx`, `sales-plan.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._