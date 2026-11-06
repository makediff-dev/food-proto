# Graph Report - food-proto  (2026-11-06)

## Corpus Check
- 271 files · ~158,474 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2503 nodes · 9834 edges · 84 communities (77 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `123ad2cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- FinishedProductEditScreen.tsx
- ProductionEntryScreen.tsx
- sales-plan.ts
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
- DerivativeForm
- monthKeyFromDate
- opex/paths.ts
- MaterialsPlanScreen.tsx
- RecipeJournalsTable.tsx
- mock-materials.ts
- SaleScreen.tsx
- MaterialJournalScreen.tsx
- index.ts
- production-plan.ts
- MaterialsSummaryTable.tsx
- Флоу товара
- keepWithNext
- ProductionJournalFactScreen.tsx
- RoleProvider.tsx
- finished-product-cost.ts
- Icons.tsx
- production-fact.ts
- MovementPlanScreen.tsx
- CashflowFactScreen.tsx
- TransportFactScreen
- document.ts
- sales-fact.ts
- IconChevronDown
- AppShell.tsx
- flow.md
- PageFrame
- SummaryScreen.tsx
- DerivativeCreateScreen.tsx
- Отчет общий сырья
- MaterialDocumentScreen.tsx
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- movement-plan.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- SalesJournalScreen.tsx
- SettingsScreen.tsx
- inputs/README.md
- resolveMaterialMonth
- OtherPlanScreen.tsx
- SummaryTable.tsx
- Отчет общий движения производных
- MovementPlanTable.tsx
- useRole
- use-opex.ts
- Себестоимость готовой продукции
- use-materials.ts
- DocumentProvider.tsx
- next
- TransportSummaryScreen.tsx
- MaterialReceiptFormTable.tsx
- recipe-yield.ts
- operating-expense.ts
- OtherFactScreen.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- DerivativeCompositionEditor
- Отчет подневный продаж
- MaterialsNormsScreen.tsx
- mock-opex.ts
- ColumnLabel

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 116 edges
2. `next` - 108 edges
3. `PageFrame()` - 105 edges
4. `react` - 82 edges
5. `useOpex()` - 75 edges
6. `entityNameRowClassName()` - 74 edges
7. `ColumnLabel()` - 72 edges
8. `useRole()` - 69 edges
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

## Communities (84 total, 7 thin omitted)

### Community 0 - "FinishedProductEditScreen.tsx"
Cohesion: 0.16
Nodes (27): MATERIAL_WAREHOUSES, MaterialWeightPair, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatMaterialWeightPair(), formatQuantity(), MATERIAL_DOCUMENT_ERROR, componentDraftKey(), DerivativeLineDraft (+19 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (63): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+55 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.10
Nodes (49): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+41 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (34): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+26 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (36): mockCreditors, mockCreditResourceMonths, mockInitialCashBalance, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+28 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.11
Nodes (36): metadata, RecipeDerivativesPage(), buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+28 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+35 more)

### Community 7 - "materials.ts"
Cohesion: 0.08
Nodes (51): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+43 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "credit-resources.ts"
Cohesion: 0.05
Nodes (85): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, buildCashflowBody(), CashflowLineView (+77 more)

### Community 11 - "ratioRound"
Cohesion: 0.13
Nodes (27): averageSalary(), dayFactsInMonth(), emptySide(), factShopHeadcountThousandths(), factShopSalaryExVat(), hrMonthView, hrPositionsForDepartment(), outsourcingAmountExVat() (+19 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.11
Nodes (37): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), lineAmountWithVat(), quantityForAmount(), rowMetrics(), MaterialDialog(), commit(), formatQuantityDraft() (+29 more)

### Community 14 - "monthKeyFromDate"
Cohesion: 0.13
Nodes (30): useDocumentStore(), hrFactDayKey(), productionEntryPieces(), workingProductionEntriesInMonth(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth() (+22 more)

### Community 15 - "opex/paths.ts"
Cohesion: 0.13
Nodes (23): metadata, OpexSummaryPage(), OpexSummaryScreen(), monthHref(), OPEX_GROUP_BASE_HREF, OPEX_HR_FACT_HREF, OPEX_HR_HREF, OPEX_HR_PLAN_HREF (+15 more)

### Community 16 - "MaterialsPlanScreen.tsx"
Cohesion: 0.12
Nodes (17): MaterialsInventoryPage(), metadata, MaterialsPlanPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialGroupMovement (+9 more)

### Community 17 - "RecipeJournalsTable.tsx"
Cohesion: 0.11
Nodes (25): react-dom, FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), FinishedProductEditScreen() (+17 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 19 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (63): metadata, SalePage(), metadata, NewSalePage(), commitDocumentUpdate(), ProductCategory, SaleLine, addSale() (+55 more)

### Community 20 - "MaterialJournalScreen.tsx"
Cohesion: 0.16
Nodes (20): MaterialsPage(), metadata, MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen(), MaterialsSummaryScreen(), buildSections() (+12 more)

### Community 21 - "index.ts"
Cohesion: 0.08
Nodes (62): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+54 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+16 more)

### Community 23 - "MaterialsSummaryTable.tsx"
Cohesion: 0.14
Nodes (22): MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), ColumnKey, COLUMNS, MaterialsPlanTable(), materialUnitHint(), PlanCell() (+14 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.10
Nodes (51): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS (+43 more)

### Community 26 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.09
Nodes (40): defaultProductionJournalFactDay(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay(), viewLinkClass() (+32 more)

### Community 27 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (22): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+14 more)

### Community 28 - "finished-product-cost.ts"
Cohesion: 0.17
Nodes (22): Свод, Свод, buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode (+14 more)

### Community 29 - "Icons.tsx"
Cohesion: 0.12
Nodes (52): react, HR_DEPARTMENT_LABELS, LineRows(), DerivativeRow(), WorkshopBlock(), COLUMN_KIND, ColumnKey, COLUMNS (+44 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.17
Nodes (25): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+17 more)

### Community 31 - "MovementPlanScreen.tsx"
Cohesion: 0.07
Nodes (47): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+39 more)

### Community 32 - "CashflowFactScreen.tsx"
Cohesion: 0.14
Nodes (19): CashflowFactPage(), metadata, CashflowSummaryPage(), metadata, CashflowFactScreen(), inputKind(), CashflowSummaryScreen(), toggle() (+11 more)

### Community 33 - "TransportFactScreen"
Cohesion: 0.17
Nodes (14): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), dayHref(), OPEX_HR_FACT_TITLE (+6 more)

### Community 34 - "document.ts"
Cohesion: 0.07
Nodes (30): catalogOpexOtherLines(), Creditor, DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNormLine, FinishedGoodsOpeningLine, HR_SHOP_DEPARTMENT_IDS, HrDayStaffLine (+22 more)

### Community 35 - "sales-fact.ts"
Cohesion: 0.09
Nodes (40): Удаление, costWithVat(), UnitCost, Product, amountWithVat(), averageAmount(), percentHundredths(), vatPercentHundredths() (+32 more)

### Community 36 - "IconChevronDown"
Cohesion: 0.11
Nodes (34): ProductRow(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, CostRow(), DerivativeCostTable() (+26 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.10
Nodes (29): OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, pathnameSection(), roleCanAccessPath(), roleHomeHref(), RoleGate(), roleHasSection(), AppShell() (+21 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "PageFrame"
Cohesion: 0.12
Nodes (26): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), sumMoney() (+18 more)

### Community 40 - "SummaryScreen.tsx"
Cohesion: 0.11
Nodes (34): Home(), metadata, metadata, PlanPage(), recommendedVolumePiecesForMonths(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange() (+26 more)

### Community 41 - "DerivativeCreateScreen.tsx"
Cohesion: 0.12
Nodes (30): DerivativePage(), metadata, metadata, NewDerivativePage(), activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull() (+22 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "MaterialDocumentScreen.tsx"
Cohesion: 0.15
Nodes (23): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), activeMaterials(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm() (+15 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (44): HR_DEPARTMENT_IDS, HrDayFact, HrDayOutsourcingLine, HrDepartmentId, isHrShopDepartmentId(), activeHrPositions(), addHrPosition(), addHrPositionRejection() (+36 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.12
Nodes (48): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+40 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.10
Nodes (44): Единицы, monthInterestAmounts(), PROFIT_TAX_PERCENT, monthOperatingExpenseAmounts(), periodGridCategories(), factVolumeScale(), planVolumeScale(), daysInMonth() (+36 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.11
Nodes (24): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), finishedProductCostMonth(), DERIVATIVE_MOVEMENT_INVENTORY_HREF (+16 more)

### Community 50 - "movement-plan.ts"
Cohesion: 0.13
Nodes (31): closingInventoryDeviationPieces(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingDeviationPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+23 more)

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
Cohesion: 0.14
Nodes (23): metadata, SalesJournalPage(), metadata, SalesFactPage(), Sale, saleTotals, workingSales(), workingSalesInMonth() (+15 more)

### Community 58 - "SettingsScreen.tsx"
Cohesion: 0.15
Nodes (14): metadata, SettingsPage(), ROLES_HREF, ROLES_TITLE, PERMISSION_MATRIX_ROWS, permissionAllowed(), ROLES, RolesMatrix() (+6 more)

### Community 60 - "resolveMaterialMonth"
Cohesion: 0.25
Nodes (18): generateMetadata(), OpexGroupFactPage(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), isOpexGroupCode(), operatingExpenseOtherGroupMonthView() (+10 more)

### Community 61 - "OtherPlanScreen.tsx"
Cohesion: 0.19
Nodes (17): metadata, OpexOtherPlanPage(), AddPositionDialog(), AddLineDialog(), AddOtherLineDialog(), OtherPlanScreen(), OPEX_OTHER_PLAN_TITLE, opexGroupHref() (+9 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.15
Nodes (23): averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED, PLAN_REPEATED (+15 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "MovementPlanTable.tsx"
Cohesion: 0.10
Nodes (39): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), editableFieldNear(), InventoryTable(), ProductRow(), RowCell() (+31 more)

### Community 65 - "useRole"
Cohesion: 0.20
Nodes (17): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+9 more)

### Community 66 - "use-opex.ts"
Cohesion: 0.10
Nodes (48): HrTaxRatesMonth, isDeletionMark(), isOccurredOn(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportCarrier, TransportHireMonthPlan, TransportHireMonthPlanLine (+40 more)

### Community 68 - "use-materials.ts"
Cohesion: 0.21
Nodes (21): addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), isMaterialGroupId(), isMaterialUnit(), isMaterialWeightPair(), isVatPercent() (+13 more)

### Community 69 - "DocumentProvider.tsx"
Cohesion: 0.13
Nodes (23): Архитектура прототипа, Поток данных, Слои, Чего не делать, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+15 more)

### Community 70 - "next"
Cohesion: 0.15
Nodes (14): nextConfig, next, metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexTransportPlanPage() (+6 more)

### Community 71 - "TransportSummaryScreen.tsx"
Cohesion: 0.16
Nodes (16): metadata, OpexTransportPage(), ReportSubBannerGroup, OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey (+8 more)

### Community 72 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (55): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+47 more)

### Community 73 - "recipe-yield.ts"
Cohesion: 0.24
Nodes (13): ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths() (+5 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.08
Nodes (45): OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), buildOtherGroupView() (+37 more)

### Community 75 - "OtherFactScreen.tsx"
Cohesion: 0.36
Nodes (7): metadata, OpexOtherFactPage(), operatingExpenseOtherMonthView(), OtherFactScreen(), OPEX_OTHER_FACT_TITLE, opexOtherFactHref(), OPEX_LINE_ERROR

### Community 79 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 81 - "MaterialsNormsScreen.tsx"
Cohesion: 0.39
Nodes (6): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE, MATERIAL_NORM_ERROR

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (44): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, isShopPositionId() (+36 more)

### Community 88 - "ColumnLabel"
Cohesion: 0.08
Nodes (39): Подсказки заголовков таблицы, DerivativeMovementRow, DerivativeMovementSection, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+31 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 527 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `FinishedProductEditScreen.tsx`, `ProductionEntryScreen.tsx`, `derivative-cost.ts`, `package.json`, `credit-resources.ts`, `monthKeyFromDate`, `opex/paths.ts`, `MaterialsPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `SaleScreen.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `RoleProvider.tsx`, `Icons.tsx`, `MovementPlanScreen.tsx`, `CashflowFactScreen.tsx`, `TransportFactScreen`, `AppShell.tsx`, `PageFrame`, `SummaryScreen.tsx`, `DerivativeCreateScreen.tsx`, `MaterialDocumentScreen.tsx`, `recipes/paths.ts`, `SalesJournalScreen.tsx`, `SettingsScreen.tsx`, `resolveMaterialMonth`, `OtherPlanScreen.tsx`, `useRole`, `TransportSummaryScreen.tsx`, `OtherFactScreen.tsx`, `MaterialsNormsScreen.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.057297297297297295 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `credit-resources.ts`, `opex/paths.ts`, `MaterialsPlanScreen.tsx`, `SaleScreen.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `Icons.tsx`, `production-fact.ts`, `MovementPlanScreen.tsx`, `CashflowFactScreen.tsx`, `TransportFactScreen`, `sales-fact.ts`, `PageFrame`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `recipes/paths.ts`, `SalesJournalScreen.tsx`, `resolveMaterialMonth`, `OtherPlanScreen.tsx`, `useRole`, `next`, `TransportSummaryScreen.tsx`, `OtherFactScreen.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10272536687631027 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `FinishedProductEditScreen.tsx`, `ProductionEntryScreen.tsx`, `package.json`, `credit-resources.ts`, `monthKeyFromDate`, `MaterialsPlanScreen.tsx`, `RecipeJournalsTable.tsx`, `SaleScreen.tsx`, `MaterialJournalScreen.tsx`, `index.ts`, `MaterialsSummaryTable.tsx`, `keepWithNext`, `ProductionJournalFactScreen.tsx`, `RoleProvider.tsx`, `MovementPlanScreen.tsx`, `CashflowFactScreen.tsx`, `IconChevronDown`, `AppShell.tsx`, `PageFrame`, `SummaryScreen.tsx`, `DerivativeCreateScreen.tsx`, `MaterialDocumentScreen.tsx`, `recipes/paths.ts`, `SalesJournalScreen.tsx`, `resolveMaterialMonth`, `OtherPlanScreen.tsx`, `SummaryTable.tsx`, `MovementPlanTable.tsx`, `useRole`, `DocumentProvider.tsx`, `TransportSummaryScreen.tsx`, `MaterialReceiptFormTable.tsx`, `OtherFactScreen.tsx`, `ColumnLabel`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `derivative-movement.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11411411411411411 - nodes in this community are weakly interconnected._