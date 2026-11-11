# Graph Report - food-proto  (2026-11-11)

## Corpus Check
- 281 files · ~165,498 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2606 nodes · 10219 edges · 78 communities (75 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `87429951`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- SaleScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- document.ts
- derivative-cost.ts
- Предметная область
- materials.ts
- package.json
- biome.json
- TransportFactScreen.tsx
- finished-goods.ts
- compilerOptions
- FinishedProductEditScreen.tsx
- keepWithNext
- monthKeyFromDate
- credit-resources.ts
- SummaryHeadlineTable.tsx
- mock-materials.ts
- SummaryScreen.tsx
- cashflow.ts
- entityNameRowClassName
- production-plan.ts
- IconChevronDown
- Флоу товара
- SalesFactScreen.tsx
- planMonthOpen
- HrFactScreen.tsx
- FinishedGoodsMonthScreen.tsx
- credit-resources/paths.ts
- production-fact.ts
- ProductionJournalFactScreen.tsx
- cashflow/paths.ts
- FinishedGoodsMonthTable.tsx
- DocumentProvider.tsx
- MaterialReceiptFormTable.tsx
- index.ts
- AppShell.tsx
- flow.md
- derivative-movement/paths.ts
- DerivativeCreateScreen.tsx
- derivatives.ts
- Отчет общий сырья
- roles.ts
- postcss.config.mjs
- hr.ts
- Icons.tsx
- Отчет общий движения
- summary.ts
- recipes/paths.ts
- ProductionJournalScreen.tsx
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- TransportSummaryScreen.tsx
- PlanningArchiveScreen.tsx
- inputs/README.md
- access.ts
- vat/paths.ts
- useDocumentStore
- Отчет общий движения производных
- Инвентаризация
- SummaryTable.tsx
- Себестоимость готовой продукции
- SettingsScreen.tsx
- ColumnLabel
- ProductionEntryScreen.tsx
- operating-expense.ts
- sales-fact.ts
- README.md
- mock-opex.ts
- MovementPlanTable.tsx
- FinishedGoodsFactScreen.tsx
- Операционные расходы
- MaterialsPlanScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 118 edges
2. `next` - 110 edges
3. `PageFrame()` - 107 edges
4. `react` - 84 edges
5. `useOpex()` - 83 edges
6. `entityNameRowClassName()` - 76 edges
7. `ColumnLabel()` - 74 edges
8. `useRole()` - 69 edges
9. `keepWithNext()` - 66 edges
10. `IconChevronDown()` - 63 edges

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

## Communities (78 total, 3 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.07
Nodes (75): HireSeed, HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine (+67 more)

### Community 1 - "SaleScreen.tsx"
Cohesion: 0.05
Nodes (82): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+74 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.11
Nodes (47): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+39 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.11
Nodes (36): buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+28 more)

### Community 4 - "document.ts"
Cohesion: 0.03
Nodes (72): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat(), mockCreditors, mockCreditResourceMonths (+64 more)

### Community 5 - "derivative-cost.ts"
Cohesion: 0.09
Nodes (46): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+38 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (31): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение денежных средств (+23 more)

### Community 7 - "materials.ts"
Cohesion: 0.07
Nodes (74): costExVat(), MaterialGroupId, MaterialReceiptLine, MaterialWarehouseId, NORMED_MATERIAL_GROUP_ID, addMaterial(), addMoney(), addMoneyNullable() (+66 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "TransportFactScreen.tsx"
Cohesion: 0.30
Nodes (10): metadata, OpexTransportFactPage(), transportHireDayValue(), transportOwnDayValue(), dayHref(), OPEX_TRANSPORT_FACT_TITLE, opexTransportFactHref(), resolveDay() (+2 more)

### Community 11 - "finished-goods.ts"
Cohesion: 0.08
Nodes (67): FinishedGoodsNormLine, bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+59 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.10
Nodes (46): FinishedProductRecipePage(), metadata, ProductRecipeLine, gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), commit(), formatQuantityDraft() (+38 more)

### Community 14 - "keepWithNext"
Cohesion: 0.12
Nodes (43): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, RowCell(), TotalsCell(), CategoryBlock(), ColumnHeadings() (+35 more)

### Community 15 - "monthKeyFromDate"
Cohesion: 0.08
Nodes (57): nextConfig, next, react, creditResourcesMonthView, derivativeMovementMonth(), monthKeyFromDate(), CashflowSummaryScreen(), toggle() (+49 more)

### Community 16 - "credit-resources.ts"
Cohesion: 0.17
Nodes (34): activeCreditors(), addCreditor(), addCreditorRejection(), CreditFieldRejection, CreditMonthField, CreditMonthViewOptions, creditorsList(), creditorVisibleInMonth() (+26 more)

### Community 17 - "SummaryHeadlineTable.tsx"
Cohesion: 0.35
Nodes (10): headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS, SummaryHeadlineTable() (+2 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "SummaryScreen.tsx"
Cohesion: 0.12
Nodes (33): Home(), metadata, metadata, PlanPage(), metadata, ProductionPage(), recommendedVolumePiecesForMonths(), ensureRangeIncludesMonth() (+25 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.09
Nodes (49): buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, cashflowOpexAmount(), creditExpenseLines(), creditIncomeLines(), earliestCashflowMonth() (+41 more)

### Community 21 - "entityNameRowClassName"
Cohesion: 0.09
Nodes (50): MaterialsNormsPage(), metadata, DerivativeMovementRow, DerivativeMovementSection, MaterialUnit, MaterialMovementRow, MaterialMovementTotals, DerivativeRow() (+42 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.18
Nodes (19): ProductionPlanLine, activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan(), isVolume() (+11 more)

### Community 23 - "IconChevronDown"
Cohesion: 0.09
Nodes (51): DerivativeCostRow, DerivativeCostSection, WorkshopBlock(), WorkshopBlock(), WorkshopBlock(), GroupBlock(), CategoryBlock(), DepartmentBlock() (+43 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SalesFactScreen.tsx"
Cohesion: 0.24
Nodes (14): defaultSalesFactDay(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), resolveMonth(), salesFactPageTitle() (+6 more)

### Community 26 - "planMonthOpen"
Cohesion: 0.12
Nodes (31): activeCategories(), missingProductionPlanProducts(), activeProducts(), FieldRejection, missingPlanProducts(), planMonthOpen(), shiftMonth(), lastHorizonMonth() (+23 more)

### Community 27 - "HrFactScreen.tsx"
Cohesion: 0.11
Nodes (27): metadata, OpexHrFactPage(), metadata, OpexHrPlanPage(), HR_DEPARTMENT_IDS, HrDepartmentId, HR_DEPARTMENT_LABELS, hrDayOutsourcingValue() (+19 more)

### Community 28 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.16
Nodes (23): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FullscreenToggle(), FinishedGoodsMonthScreen(), FullscreenToggle() (+15 more)

### Community 29 - "credit-resources/paths.ts"
Cohesion: 0.14
Nodes (18): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, CREDIT_RESOURCES_FACT_HREF, CREDIT_RESOURCES_FACT_TITLE (+10 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.16
Nodes (29): finishedGoodsSummaryAsOfDate(), amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale() (+21 more)

### Community 31 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (20): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref() (+12 more)

### Community 32 - "cashflow/paths.ts"
Cohesion: 0.19
Nodes (13): CashflowSummaryPage(), metadata, CashflowPropertyTaxPage(), metadata, CASHFLOW_PROPERTY_TAX_HREF, CASHFLOW_PROPERTY_TAX_TITLE, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF (+5 more)

### Community 33 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.07
Nodes (38): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+30 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.18
Nodes (17): Архитектура прототипа, Поток данных, Слои, Чего не делать, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+9 more)

### Community 35 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.05
Nodes (66): Material, ProductCategory, fromRubles(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup (+58 more)

### Community 36 - "index.ts"
Cohesion: 0.09
Nodes (54): adjacentDay(), ArrowButton(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel(), dayOfMonth() (+46 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.11
Nodes (25): MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, opexGroupFactHrefPath(), opexGroupHrefPath(), opexGroupPlanHrefPath(), PRODUCTION_SECTION_TITLE, AppShell(), buildNavGroups() (+17 more)

### Community 38 - "flow.md"
Cohesion: 0.22
Nodes (8): Отчет подневный движения, Чем день отличается от свода, Колонки строки товара, Отчет подневный производства, Группы, Отчет общий производства, Колонки строки товара, Отчет подневный продаж

### Community 39 - "derivative-movement/paths.ts"
Cohesion: 0.15
Nodes (16): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+8 more)

### Community 40 - "DerivativeCreateScreen.tsx"
Cohesion: 0.11
Nodes (35): derivativeWorkshopById(), warehouseIdForWorkshop(), Derivative, MATERIAL_GROUPS, ProductRecipeRejection, RECIPE_YIELD_TOLERANCE_THOUSANDTHS, formatQuantity(), buildCandidateGroups() (+27 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.14
Nodes (26): addDerivative(), DerivativeAddRejection, DerivativeCompositionLineView, derivativeNameRejection, isDerivativeUnit(), lineKey(), updateDerivative(), validateLines() (+18 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "roles.ts"
Cohesion: 0.09
Nodes (25): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+17 more)

### Community 45 - "hr.ts"
Cohesion: 0.08
Nodes (52): isShopPositionId(), HR_SHOP_DEPARTMENT_IDS, HrDayOutsourcingLine, HrDayStaffLine, HrMonthPlan, HrMonthPlanOutsourcingLine, HrMonthPlanStaffLine, HrPosition (+44 more)

### Community 46 - "Icons.tsx"
Cohesion: 0.11
Nodes (37): AddPositionDialog(), AddLineDialog(), OtherGroupBlock(), AddOtherLineDialog(), AddNamedDialog(), AddCategoryDialog(), submit(), AddProductDialog() (+29 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.11
Nodes (46): Единицы, monthInterestAmounts(), rangePlanProduction(), rangePlanSales(), productCostPerPiece(), percentHundredths(), vatPercentHundredths(), monthOperatingExpenseAmounts() (+38 more)

### Community 49 - "recipes/paths.ts"
Cohesion: 0.07
Nodes (42): react-dom, RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), metadata (+34 more)

### Community 50 - "ProductionJournalScreen.tsx"
Cohesion: 0.16
Nodes (21): metadata, ProductionJournalPage(), metadata, ProductionPlanPage(), productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionJournalQuery(), parseProductionPlanQuery() (+13 more)

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

### Community 57 - "TransportSummaryScreen.tsx"
Cohesion: 0.17
Nodes (15): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey, hireColumns() (+7 more)

### Community 58 - "PlanningArchiveScreen.tsx"
Cohesion: 0.23
Nodes (12): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+4 more)

### Community 60 - "access.ts"
Cohesion: 0.23
Nodes (11): RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref(), SECTION_HOME, ROLES_HREF (+3 more)

### Community 61 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 62 - "useDocumentStore"
Cohesion: 0.35
Nodes (10): commitDocumentUpdate(), useDocumentStore(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), FinishedGoodsNormField, addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), openPlan() (+2 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "Инвентаризация"
Cohesion: 0.67
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 65 - "SummaryTable.tsx"
Cohesion: 0.10
Nodes (36): SalesPlanRejection, SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock(), editableFieldNear() (+28 more)

### Community 71 - "SettingsScreen.tsx"
Cohesion: 0.14
Nodes (17): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+9 more)

### Community 72 - "ColumnLabel"
Cohesion: 0.07
Nodes (72): generateMetadata(), OpexGroupFactPage(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexHrPage() (+64 more)

### Community 73 - "ProductionEntryScreen.tsx"
Cohesion: 0.10
Nodes (41): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), defaultProductionEntryDay() (+33 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.06
Nodes (58): isOccurredOn(), OpexDayFact, OpexGroupCode, OpexMonthLine, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection(), AGENCY_FEE_PERCENT (+50 more)

### Community 75 - "sales-fact.ts"
Cohesion: 0.10
Nodes (33): Удаление, costWithVat(), UnitCost, Product, amountWithVat(), dayGridProducts(), periodGridCategories(), periodGridProducts() (+25 more)

### Community 79 - "README.md"
Cohesion: 0.16
Nodes (9): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Как собрать первый прототип, Подсказки заголовков таблицы, Порядок, Формула, Запуск (+1 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.07
Nodes (42): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), MOCK_MONTHS, MOCK_VEHICLE_IDS (+34 more)

### Community 88 - "MovementPlanTable.tsx"
Cohesion: 0.12
Nodes (33): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell(), ProductRow() (+25 more)

### Community 91 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.11
Nodes (25): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), DayDateControl(), onKeyDown() (+17 more)

### Community 93 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 103 - "MaterialsPlanScreen.tsx"
Cohesion: 0.06
Nodes (48): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptPage(), metadata (+40 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 539 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `monthKeyFromDate` to `SaleScreen.tsx`, `package.json`, `TransportFactScreen.tsx`, `FinishedProductEditScreen.tsx`, `SummaryScreen.tsx`, `entityNameRowClassName`, `SalesFactScreen.tsx`, `planMonthOpen`, `HrFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `credit-resources/paths.ts`, `ProductionJournalFactScreen.tsx`, `cashflow/paths.ts`, `AppShell.tsx`, `derivative-movement/paths.ts`, `DerivativeCreateScreen.tsx`, `roles.ts`, `Icons.tsx`, `recipes/paths.ts`, `ProductionJournalScreen.tsx`, `TransportSummaryScreen.tsx`, `PlanningArchiveScreen.tsx`, `access.ts`, `vat/paths.ts`, `SettingsScreen.tsx`, `ColumnLabel`, `ProductionEntryScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `MaterialsPlanScreen.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06801093643198906 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `SaleScreen.tsx`, `sales-plan.ts`, `TransportFactScreen.tsx`, `finished-goods.ts`, `SummaryScreen.tsx`, `SalesFactScreen.tsx`, `planMonthOpen`, `HrFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `production-fact.ts`, `ProductionJournalFactScreen.tsx`, `hr.ts`, `summary.ts`, `ProductionJournalScreen.tsx`, `TransportSummaryScreen.tsx`, `ColumnLabel`, `ProductionEntryScreen.tsx`, `sales-fact.ts`, `FinishedGoodsFactScreen.tsx`, `MaterialsPlanScreen.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `SaleScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.052407614781634936 - nodes in this community are weakly interconnected._
- **Why does `Предметная область` connect `Предметная область` to `Операционные расходы`, `README.md`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10633484162895927 - nodes in this community are weakly interconnected._