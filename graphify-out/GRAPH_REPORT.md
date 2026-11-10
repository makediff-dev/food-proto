# Graph Report - food-proto  (2026-11-10)

## Corpus Check
- 269 files · ~159,255 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2508 nodes · 9819 edges · 92 communities (84 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9a912ba8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- SaleScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- hr/fact/page.tsx
- sales-fact.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- PlanningScreen.tsx
- plannedProductionVolumePieces
- credit-resources.ts
- next
- mock-materials.ts
- SalesFactScreen.tsx
- RoleProvider.tsx
- production/paths.ts
- production-plan.ts
- DerivativeCostTable.tsx
- Флоу товара
- keepWithNext
- FinishedGoodsFactScreen.tsx
- production-journal.ts
- RecipeJournalsTable.tsx
- CreditResourcesSummaryScreen.tsx
- production-fact.ts
- FinishedGoodsMonthScreen.tsx
- cashflow/paths.ts
- PageFrame
- document.ts
- MaterialReceiptFormTable.tsx
- index.ts
- AppShell.tsx
- flow.md
- MaterialsPlanScreen.tsx
- SummaryScreen.tsx
- derivatives.ts
- Отчет общий сырья
- SettingsScreen.tsx
- postcss.config.mjs
- hr.ts
- finished-goods.ts
- Отчет общий движения
- summary.ts
- useRole
- ProductionJournalFactScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- monthKeyFromDate
- DocumentProvider.tsx
- inputs/README.md
- opex/paths.ts
- recipe-yield.ts
- SummaryTable.tsx
- Отчет общий движения производных
- MaterialsInventoryScreen.tsx
- PlanningArchiveScreen.tsx
- transport.ts
- Себестоимость готовой продукции
- use-materials.ts
- ProductionEntryScreen
- MaterialsNormsScreen
- TransportSummaryScreen.tsx
- MaterialDocumentScreen.tsx
- ProductionEntryScreen.tsx
- operating-expense.ts
- ProductionJournalScreen.tsx
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- DerivativeCompositionEditor
- Отчет подневный продаж
- MaterialJournalScreen.tsx
- access.ts
- Как собрать первый прототип
- mock-opex.ts
- SummaryHeadlineTable.tsx
- README.md
- entityNameRowClassName
- AGENTS.md
- Операционные расходы
- Движение готовой продукции
- Движение производных

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 114 edges
2. `next` - 106 edges
3. `PageFrame()` - 103 edges
4. `react` - 81 edges
5. `useOpex()` - 77 edges
6. `entityNameRowClassName()` - 72 edges
7. `ColumnLabel()` - 70 edges
8. `useRole()` - 67 edges
9. `keepWithNext()` - 65 edges
10. `planMonthOpen()` - 62 edges

## Surprising Connections (you probably didn't know these)
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Верхний блок сводки` --references--> `monthInterestAmounts()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts
- `Поток данных` --references--> `PrototypeDocument`  [INFERRED]
  docs/architecture.md → src/domain/document.ts

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

## Communities (92 total, 8 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.11
Nodes (37): HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), activeHrPositions(), addHrPosition(), addHrPositionRejection(), deleteHrPosition(), HrFieldRejection (+29 more)

### Community 1 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (64): metadata, SalePage(), metadata, NewSalePage(), SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection() (+56 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.10
Nodes (47): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+39 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.07
Nodes (53): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, buildRow(), costForQuantity() (+45 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (37): mockCreditors, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober, closingInventorySeptember (+29 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (42): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+34 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (25): Блоки, Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение денежных средств, Движение кредитных ресурсов, Отчет общий (производство), Отчет подневный (производство) (+17 more)

### Community 7 - "materials.ts"
Cohesion: 0.09
Nodes (44): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deletedMaterials() (+36 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "hr/fact/page.tsx"
Cohesion: 0.28
Nodes (7): metadata, OpexHrFactPage(), metadata, OpexTransportFactPage(), OPEX_HR_FACT_TITLE, OPEX_TRANSPORT_FACT_TITLE, parseOpexDayQuery()

### Community 11 - "sales-fact.ts"
Cohesion: 0.10
Nodes (31): costWithVat(), UnitCost, priceAverage(), sumRows(), productCostPerPiece(), amountWithVat(), averageAmount(), productionFactGridProducts() (+23 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.09
Nodes (61): isDerivativeWorkshopId(), DERIVATIVE_WORKSHOPS, MATERIAL_WAREHOUSES, gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantity(), formatQuantityDraft() (+53 more)

### Community 14 - "PlanningScreen.tsx"
Cohesion: 0.10
Nodes (42): activeCategories(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, missingProductionPlanProducts(), workingProductionPlan(), activeProducts(), missingPlanProducts() (+34 more)

### Community 15 - "plannedProductionVolumePieces"
Cohesion: 0.21
Nodes (15): plannedProductionVolumePieces(), rangePlanProduction(), rangePlanSales(), targetClosingPiecesFromNorm(), productionPlanLineMetrics, productionPlanTotals, planPriceWithVatForProduct(), planSalesVolumePiecesForProduct() (+7 more)

### Community 16 - "credit-resources.ts"
Cohesion: 0.10
Nodes (52): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth(), line() (+44 more)

### Community 17 - "next"
Cohesion: 0.19
Nodes (18): nextConfig, next, generateMetadata(), OpexGroupFactPage(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage() (+10 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.10
Nodes (25): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+17 more)

### Community 19 - "SalesFactScreen.tsx"
Cohesion: 0.10
Nodes (33): metadata, SalesJournalPage(), metadata, SalesFactPage(), Sale, saleTotals, workingSales(), workingSalesInMonth() (+25 more)

### Community 20 - "RoleProvider.tsx"
Cohesion: 0.16
Nodes (18): readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider(), RoleStoreContext, RoleStoreValue, ALL_EDIT, ALL_NAV_SECTIONS (+10 more)

### Community 21 - "production/paths.ts"
Cohesion: 0.17
Nodes (14): metadata, ProductionFactPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), parseProductionFactQuery(), parseProductionJournalFactQuery() (+6 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.09
Nodes (36): Удаление, commitDocumentUpdate(), Product, ProductCategory, ProductionPlan, ProductionPlanLine, dayGridProducts(), periodGridCategories() (+28 more)

### Community 23 - "DerivativeCostTable.tsx"
Cohesion: 0.10
Nodes (36): editableFieldNear(), ProductRow(), ProductRow(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+28 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "keepWithNext"
Cohesion: 0.07
Nodes (77): FinishedGoodsRow, FinishedGoodsTotals, TotalCell(), FinishedGoodsFactTable(), MetricCell(), visibleDayRows(), CategoryBlock(), COLUMN_GROUPS (+69 more)

### Community 26 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.16
Nodes (19): metadata, MovementFactPage(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), FullscreenToggle() (+11 more)

### Community 27 - "production-journal.ts"
Cohesion: 0.32
Nodes (14): ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection(), productionEntryByIdOrNull() (+6 more)

### Community 28 - "RecipeJournalsTable.tsx"
Cohesion: 0.23
Nodes (13): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+5 more)

### Community 29 - "CreditResourcesSummaryScreen.tsx"
Cohesion: 0.11
Nodes (28): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, creditResourcesMonthView, CreditResourcesFactScreen() (+20 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.15
Nodes (28): amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts() (+20 more)

### Community 31 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.17
Nodes (19): metadata, MovementPage(), metadata, MovementPlanPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen() (+11 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.29
Nodes (8): CashflowSummaryPage(), metadata, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF, CASHFLOW_SUMMARY_TITLE, cashflowSummaryHref(), monthHref(), parseCashflowMonthQuery()

### Community 33 - "PageFrame"
Cohesion: 0.10
Nodes (69): react, HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, operatingExpenseOtherMonthView(), salesPlanForMonth(), transportHireDayValue(), transportOwnDayValue() (+61 more)

### Community 34 - "document.ts"
Cohesion: 0.08
Nodes (27): Creditor, DeletableRecord, DERIVATIVE_UNITS, DerivativeNorm, DerivativeNormLine, DerivativeOpening, DerivativeOpeningLine, FinishedGoodsOpeningLine (+19 more)

### Community 35 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (50): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+42 more)

### Community 36 - "index.ts"
Cohesion: 0.07
Nodes (67): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND (+59 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.10
Nodes (30): CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_NAV_PREFIX, CREDIT_RESOURCES_PLAN_HREF, opexGroupFactHrefPath(), opexGroupHrefPath(), opexGroupPlanHref(), opexGroupPlanHrefPath(), RECIPES_SECTION_TITLE (+22 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (22): MaterialsPlanPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWeightPair, MaterialDocumentRejection (+14 more)

### Community 40 - "SummaryScreen.tsx"
Cohesion: 0.11
Nodes (35): Home(), metadata, metadata, PlanPage(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange() (+27 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.11
Nodes (36): DerivativePage(), metadata, metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection (+28 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "SettingsScreen.tsx"
Cohesion: 0.20
Nodes (11): metadata, SettingsPage(), permissionAllowed(), ROLES, RolesMatrix(), SETTINGS_HREF, SETTINGS_TITLE, MockSection() (+3 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (55): isShopPositionId(), HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrMonthFact, HrMonthFactStaffLine, isHrShopDepartmentId(), isMonthKey(), averageSalary() (+47 more)

### Community 46 - "finished-goods.ts"
Cohesion: 0.08
Nodes (62): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+54 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.11
Nodes (46): Единицы, monthInterestAmounts(), SalesPlan, percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts(), factVolumeScale(), planVolumeScale() (+38 more)

### Community 49 - "useRole"
Cohesion: 0.09
Nodes (35): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), FinishedProductRecipePage(), metadata (+27 more)

### Community 50 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.20
Nodes (15): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), productionJournalFactPageTitle() (+7 more)

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

### Community 57 - "monthKeyFromDate"
Cohesion: 0.22
Nodes (15): metadata, MovementInventoryPage(), monthKeyFromDate(), planMonthOpen(), InventoryScreen(), resolveMonth(), resolveMonth(), MOVEMENT_INVENTORY_TITLE (+7 more)

### Community 58 - "DocumentProvider.tsx"
Cohesion: 0.13
Nodes (22): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+14 more)

### Community 60 - "opex/paths.ts"
Cohesion: 0.07
Nodes (33): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), metadata, OpexOtherFactPage(), metadata, OpexOtherPlanPage() (+25 more)

### Community 61 - "recipe-yield.ts"
Cohesion: 0.22
Nodes (14): ProductRecipeLine, ProductRecipeRejection, updateProductRecipe(), isQuantityThousandths(), applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS (+6 more)

### Community 62 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (42): toggle(), LineRows(), WorkshopBlock(), GroupBlock(), CategoryBlock(), CategoryBlock(), DepartmentBlock(), OtherGroupBlock() (+34 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "MaterialsInventoryScreen.tsx"
Cohesion: 0.27
Nodes (7): MaterialsInventoryPage(), metadata, MaterialWarehouseId, MaterialWarehouseMovement, MaterialsInventoryScreen(), MATERIALS_INVENTORY_TITLE, MATERIAL_OPENING_ERROR

### Community 65 - "PlanningArchiveScreen.tsx"
Cohesion: 0.21
Nodes (13): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+5 more)

### Community 66 - "transport.ts"
Cohesion: 0.08
Nodes (41): HireSeed, isOccurredOn(), TRANSPORT_HIRE_KINDS, TransportCarrier, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan (+33 more)

### Community 68 - "use-materials.ts"
Cohesion: 0.17
Nodes (28): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+20 more)

### Community 69 - "ProductionEntryScreen"
Cohesion: 0.24
Nodes (8): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), defaultProductionEntryDay(), NEW_PRODUCTION_ENTRY_TITLE, PRODUCTION_JOURNAL_TITLE, ProductionEntryScreen()

### Community 70 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 71 - "TransportSummaryScreen.tsx"
Cohesion: 0.09
Nodes (26): FINISHED_GOODS_CLOSING_SUB_BANNERS, FINISHED_GOODS_PRODUCTION_SUB_BANNERS, FINISHED_GOODS_SALES_SUB_BANNERS, FINISHED_GOODS_SUMMARY_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS (+18 more)

### Community 72 - "MaterialDocumentScreen.tsx"
Cohesion: 0.20
Nodes (17): metadata, NewMaterialReceiptPage(), activeMaterials(), materialReceiptById(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save() (+9 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.18
Nodes (18): maxProductionEntryOccurredOn(), ProductionEntryRejection, productionLineAmountExVat(), emptyProductionEntryLineDraft(), piecesForAmount(), ProductionEntryLineDraft, ProductionEntryLineField, rowMetrics() (+10 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.07
Nodes (50): OpexDayFact, OpexGroupCode, OpexMonthLine, OpexMonthLines, AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine(), buildOtherGroupView() (+42 more)

### Community 75 - "ProductionJournalScreen.tsx"
Cohesion: 0.23
Nodes (14): metadata, ProductionJournalPage(), ProductionEntry, productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), productionEntryHref(), productionEntryNewHref() (+6 more)

### Community 79 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 81 - "MaterialJournalScreen.tsx"
Cohesion: 0.14
Nodes (22): MaterialsPage(), metadata, MaterialReceiptPage(), metadata, MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen() (+14 more)

### Community 82 - "access.ts"
Cohesion: 0.13
Nodes (18): Архитектура прототипа, Поток данных, Слои, Чего не делать, CREDIT_RESOURCES_SUMMARY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF (+10 more)

### Community 83 - "Как собрать первый прототип"
Cohesion: 0.50
Nodes (4): Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула

### Community 84 - "mock-opex.ts"
Cohesion: 0.07
Nodes (41): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), MOCK_MONTHS, MOCK_VEHICLE_IDS (+33 more)

### Community 86 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 88 - "entityNameRowClassName"
Cohesion: 0.08
Nodes (52): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeMovementPlanTable() (+44 more)

### Community 90 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 91 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 92 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 93 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 531 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `SaleScreen.tsx`, `derivative-movement.ts`, `package.json`, `hr/fact/page.tsx`, `DerivativeCreateScreen.tsx`, `PlanningScreen.tsx`, `SalesFactScreen.tsx`, `production/paths.ts`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `CreditResourcesSummaryScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `cashflow/paths.ts`, `PageFrame`, `AppShell.tsx`, `MaterialsPlanScreen.tsx`, `SummaryScreen.tsx`, `derivatives.ts`, `SettingsScreen.tsx`, `useRole`, `ProductionJournalFactScreen.tsx`, `monthKeyFromDate`, `DocumentProvider.tsx`, `opex/paths.ts`, `MaterialsInventoryScreen.tsx`, `PlanningArchiveScreen.tsx`, `ProductionEntryScreen`, `MaterialsNormsScreen`, `TransportSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `MaterialJournalScreen.tsx`, `access.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11379800853485064 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `SaleScreen.tsx`, `derivative-movement.ts`, `package.json`, `DerivativeCreateScreen.tsx`, `PlanningScreen.tsx`, `SalesFactScreen.tsx`, `RoleProvider.tsx`, `DerivativeCostTable.tsx`, `keepWithNext`, `FinishedGoodsFactScreen.tsx`, `RecipeJournalsTable.tsx`, `CreditResourcesSummaryScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `MaterialReceiptFormTable.tsx`, `index.ts`, `AppShell.tsx`, `MaterialsPlanScreen.tsx`, `SummaryScreen.tsx`, `useRole`, `ProductionJournalFactScreen.tsx`, `DocumentProvider.tsx`, `SummaryTable.tsx`, `MaterialsInventoryScreen.tsx`, `PlanningArchiveScreen.tsx`, `TransportSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `MaterialJournalScreen.tsx`, `access.ts`, `entityNameRowClassName`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `SaleScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0700152207001522 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `SaleScreen.tsx`, `sales-plan.ts`, `derivative-movement.ts`, `sales-fact.ts`, `PlanningScreen.tsx`, `next`, `SalesFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `production-journal.ts`, `CreditResourcesSummaryScreen.tsx`, `production-fact.ts`, `FinishedGoodsMonthScreen.tsx`, `PageFrame`, `MaterialsPlanScreen.tsx`, `SummaryScreen.tsx`, `hr.ts`, `finished-goods.ts`, `summary.ts`, `useRole`, `ProductionJournalFactScreen.tsx`, `MaterialsInventoryScreen.tsx`, `PlanningArchiveScreen.tsx`, `transport.ts`, `ProductionEntryScreen`, `TransportSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `ProductionEntryScreen.tsx`, `ProductionJournalScreen.tsx`, `MaterialJournalScreen.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1048265460030166 - nodes in this community are weakly interconnected._