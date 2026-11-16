# Graph Report - food-proto  (2026-11-16)

## Corpus Check
- 289 files · ~168,516 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2682 nodes · 10528 edges · 89 communities (81 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5a9953dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- SummaryTable.tsx
- ProductionJournalFactScreen.tsx
- sales-fact.ts
- mock-document.ts
- FinishedGoodsMonthTable.tsx
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- materials.ts
- finished-goods.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- keepWithNext
- MaterialReceiptFormTable.tsx
- TransportSummaryScreen.tsx
- credit-resources.ts
- derivative-movement.ts
- materials/text.ts
- cashflow.ts
- production-journal-fact.ts
- production-plan.ts
- parseOpexMonthQuery
- Флоу товара
- next
- movement/paths.ts
- movement-plan.ts
- derivative-cost.ts
- recipe-yield.ts
- production-fact.ts
- document.ts
- recipes/paths.ts
- DocumentProvider.tsx
- hr.ts
- opex/paths.ts
- index.ts
- AppShell.tsx
- flow.md
- isOpexGroupCode
- cashflow/paths.ts
- derivatives.ts
- Отчет общий сырья
- roles.ts
- postcss.config.mjs
- vat/paths.ts
- planMonthOpen
- Отчет общий движения
- summary.ts
- access.ts
- useRole
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- credit-resources/paths.ts
- RecipeComponentSearch
- inputs/README.md
- MaterialsSummaryTable.tsx
- opexHrefWithQuery
- entityNameRowClassName
- Отчет общий движения производных
- sales-plan.ts
- finished-product-cost.ts
- materialReceiptsList
- Себестоимость готовой продукции
- Workspace
- Отчет подневный движения
- monthKeyFromDate
- IconChevronDown
- SettingsScreen.tsx
- production-journal.ts
- operating-expense.ts
- HrPlanScreen
- RecipeJournalsTable.tsx
- use-materials.ts
- products.ts
- Отчет подневный производства
- DerivativeEditScreen
- SaleScreen.tsx
- SalesJournalScreen.tsx
- parseOpexDayQuery
- mock-opex.ts
- openingFor
- Отчет общий производства
- Отчет подневный продаж
- recipes/new/page.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 120 edges
2. `next` - 116 edges
3. `PageFrame()` - 109 edges
4. `react` - 85 edges
5. `useOpex()` - 81 edges
6. `entityNameRowClassName()` - 80 edges
7. `planMonthOpen()` - 77 edges
8. `ColumnLabel()` - 76 edges
9. `useRole()` - 71 edges
10. `isOccurredOn()` - 69 edges

## Surprising Connections (you probably didn't know these)
- `Себестоимость готовой продукции` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/domain.md → src/domain/derivative-cost.ts
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Верхний блок сводки` --references--> `monthInterestAmounts()`  [INFERRED]
  docs/domain.md → src/domain/credit-resources.ts
- `Свод` --references--> `derivativeConsumptionPrice()`  [INFERRED]
  docs/tables/derivative-cost.md → src/domain/derivative-cost.ts

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

## Communities (89 total, 8 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.06
Nodes (82): HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireMonthPlan, TransportHireMonthPlanLine, TransportOwnMonthPlan, activeHrPositions() (+74 more)

### Community 1 - "SummaryTable.tsx"
Cohesion: 0.14
Nodes (25): VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), FINANCE_SIDE_KEYS, PLAN_ASSIGNED (+17 more)

### Community 2 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.09
Nodes (31): metadata, ProductionFactPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), recommendedDayKey(), defaultProductionJournalFactDay() (+23 more)

### Community 3 - "sales-fact.ts"
Cohesion: 0.16
Nodes (22): Архитектура прототипа, Слои, Удаление, Чего не делать, Product, finishedGoodsGridProducts(), finishedGoodsRangeProducts(), productCostPerPiece() (+14 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.04
Nodes (46): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+38 more)

### Community 5 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.08
Nodes (50): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock() (+42 more)

### Community 6 - "Предметная область"
Cohesion: 0.04
Nodes (43): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, HR (`HR`), Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство) (+35 more)

### Community 7 - "mock-materials.ts"
Cohesion: 0.10
Nodes (26): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+18 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "materials.ts"
Cohesion: 0.10
Nodes (39): Свод, Свод, costExVat(), MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity() (+31 more)

### Community 11 - "finished-goods.ts"
Cohesion: 0.12
Nodes (44): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+36 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.09
Nodes (65): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), setLine() (+57 more)

### Community 14 - "keepWithNext"
Cohesion: 0.12
Nodes (42): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+34 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.05
Nodes (68): ProductCategory, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+60 more)

### Community 16 - "TransportSummaryScreen.tsx"
Cohesion: 0.17
Nodes (14): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey, hireColumns(), hireGroupEndClass() (+6 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.13
Nodes (44): activeCreditors(), addCreditor(), addCreditorRejection(), creditDayAmounts(), CreditDayField, CreditFieldRejection, CreditMonthField, CreditMonthViewOptions (+36 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.12
Nodes (33): derivativeConsumptionPrice(), buildRow(), costForQuantity(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList() (+25 more)

### Community 19 - "materials/text.ts"
Cohesion: 0.12
Nodes (19): MaterialsNormsPage(), metadata, MaterialUnit, MaterialWeightPair, NORMED_MATERIAL_GROUP_ID, MaterialDocumentRejection, MaterialMovementRow, materialNormQuantity() (+11 more)

### Community 20 - "cashflow.ts"
Cohesion: 0.06
Nodes (72): CashflowSummaryPage(), CashflowPlanPage(), metadata, buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines() (+64 more)

### Community 21 - "production-journal-fact.ts"
Cohesion: 0.14
Nodes (21): averageAmount(), productionFactGridProducts(), dayTotals(), productionEntryDayPieces(), ProductionJournalFactDayView, productionJournalFactGridProducts(), ProductionJournalFactGroup, productionJournalFactGroups() (+13 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.15
Nodes (25): commitDocumentUpdate(), ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+17 more)

### Community 23 - "parseOpexMonthQuery"
Cohesion: 0.14
Nodes (14): OpexGroupPlanPage(), metadata, OpexHrPage(), metadata, OpexOtherPlanPage(), metadata, OpexSummaryPage(), metadata (+6 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "next"
Cohesion: 0.06
Nodes (63): nextConfig, next, react, DerivativeMovementInventoryPage(), metadata, MaterialsInventoryPage(), metadata, MaterialsPage() (+55 more)

### Community 26 - "movement/paths.ts"
Cohesion: 0.13
Nodes (18): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+10 more)

### Community 27 - "movement-plan.ts"
Cohesion: 0.13
Nodes (30): FinishedGoodsNormLine, FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingReferencedProductIds(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+22 more)

### Community 28 - "derivative-cost.ts"
Cohesion: 0.14
Nodes (23): buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost(), derivativeBatchCostInternal(), derivativeCostDetail (+15 more)

### Community 29 - "recipe-yield.ts"
Cohesion: 0.22
Nodes (12): DerivativeAddRejection, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef (+4 more)

### Community 30 - "production-fact.ts"
Cohesion: 0.13
Nodes (36): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+28 more)

### Community 31 - "document.ts"
Cohesion: 0.06
Nodes (43): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeHrOutsourcingDayRate(), normalizeHrOutsourcingPlanVat(), normalizeMaterialUnits(), normalizeOpexOtherVat(), normalizeTransportCarrierVat(), normalizeTransportFuelVat() (+35 more)

### Community 32 - "recipes/paths.ts"
Cohesion: 0.14
Nodes (17): RecipesCostDetailPage(), metadata, RecipesCostPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), parseDerivativeWorkshopQuery(), parseRecipesCostMonthQuery() (+9 more)

### Community 33 - "DocumentProvider.tsx"
Cohesion: 0.14
Nodes (19): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+11 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (51): isShopPositionId(), HR_DEPARTMENT_IDS, HrDayFact, HrDayStaffLine, HrMonthFact, HrMonthFactStaffLine, HrMonthPlanStaffLine, HrPosition (+43 more)

### Community 35 - "opex/paths.ts"
Cohesion: 0.15
Nodes (18): monthHref(), OPEX_GROUP_BASE_HREF, OPEX_GROUP_FACT_BASE_HREF, OPEX_HR_HREF, OPEX_HR_PLAN_HREF, OPEX_OTHER_FACT_NAV_LABEL, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE (+10 more)

### Community 36 - "index.ts"
Cohesion: 0.07
Nodes (79): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, adjacentDay(), VarianceSense, COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+71 more)

### Community 37 - "AppShell.tsx"
Cohesion: 0.11
Nodes (28): Поток данных, PRODUCTION_SECTION_TITLE, pathnameSection(), roleCanAccessPath(), roleHomeHref(), RoleGate(), roleHasSection(), AppShell() (+20 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "isOpexGroupCode"
Cohesion: 0.47
Nodes (7): generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), isOpexGroupCode(), opexGroupName(), OpexGroupSummaryScreen()

### Community 40 - "cashflow/paths.ts"
Cohesion: 0.16
Nodes (15): CashflowFactPage(), metadata, metadata, CASHFLOW_FACT_HREF, CASHFLOW_FACT_TITLE, CASHFLOW_PLAN_HREF, CASHFLOW_SECTION_TITLE, CASHFLOW_SUMMARY_HREF (+7 more)

### Community 41 - "derivatives.ts"
Cohesion: 0.13
Nodes (31): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), derivativeCompositionLines(), DerivativeCompositionLineView, derivativeNameRejection (+23 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "roles.ts"
Cohesion: 0.13
Nodes (18): readRole(), ROLE_STORAGE_KEY, ALL_EDIT, ALL_NAV_SECTIONS, DEFAULT_ROLE_ID, isRoleId(), NavSectionId, NO_EDIT (+10 more)

### Community 45 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 46 - "planMonthOpen"
Cohesion: 0.14
Nodes (40): isOccurredOn(), hrDayOutsourcingValue(), hrDayStaffValue(), maxProductionEntryOccurredOn(), defaultSalesFactDay(), monthDates(), planMonthOpen(), transportHireDayValue() (+32 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.09
Nodes (51): Единицы, costWithVat(), UnitCost, monthInterestAmounts(), unitPriceFromBatch(), amountWithVat(), percentHundredths(), ratioRound() (+43 more)

### Community 49 - "access.ts"
Cohesion: 0.13
Nodes (17): DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_PLAN_TITLE (+9 more)

### Community 50 - "useRole"
Cohesion: 0.09
Nodes (46): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), salesPlanForMonth() (+38 more)

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

### Community 57 - "credit-resources/paths.ts"
Cohesion: 0.12
Nodes (21): CreditResourcesFactPage(), metadata, CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, columnEdge(), CreditResourcesSummaryScreen() (+13 more)

### Community 60 - "MaterialsSummaryTable.tsx"
Cohesion: 0.07
Nodes (49): derivativeNormRangeInvalid(), DerivativeRow(), RowCell(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS (+41 more)

### Community 61 - "opexHrefWithQuery"
Cohesion: 0.22
Nodes (9): OpexGroupFactRedirectPage(), OpexHrFactRedirectPage(), OpexOtherFactRedirectPage(), OpexTransportFactRedirectPage(), OPEX_HR_FACT_HREF, OPEX_OTHER_FACT_HREF, OPEX_TRANSPORT_FACT_HREF, opexGroupFactHrefPath() (+1 more)

### Community 62 - "entityNameRowClassName"
Cohesion: 0.08
Nodes (58): HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), MaterialsInventoryTable() (+50 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "sales-plan.ts"
Cohesion: 0.35
Nodes (11): activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan(), isPrice(), isVolume(), lineNumbersRejection() (+3 more)

### Community 65 - "finished-product-cost.ts"
Cohesion: 0.11
Nodes (26): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail (+18 more)

### Community 66 - "materialReceiptsList"
Cohesion: 0.22
Nodes (10): deleteMaterialReceipt(), emptyPlanLine(), materialMonthPlansList(), materialNormsList(), materialReceiptById(), materialReceiptsInMonth(), materialReceiptsList(), planFor() (+2 more)

### Community 68 - "Workspace"
Cohesion: 0.42
Nodes (8): clampSummaryMonth(), finishedGoodsSummaryAsOfDate(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), Workspace(), open(), finishedGoodsSummaryHref()

### Community 70 - "monthKeyFromDate"
Cohesion: 0.06
Nodes (81): Home(), metadata, activeCategories(), monthKeyFromDate(), SalesPlanRejection, shiftMonth(), lastHorizonMonth(), DayDateControl() (+73 more)

### Community 71 - "IconChevronDown"
Cohesion: 0.10
Nodes (42): DerivativeMovementInventoryTable(), DerivativeRow(), WorkshopBlock(), DerivativeMovementPlanTable(), WorkshopBlock(), ProductRow(), COLUMN_GROUPS, COLUMN_KIND (+34 more)

### Community 72 - "SettingsScreen.tsx"
Cohesion: 0.12
Nodes (20): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+12 more)

### Community 73 - "production-journal.ts"
Cohesion: 0.08
Nodes (50): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), ProductionEntry, ProductionEntryLine (+42 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.07
Nodes (48): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, AGENCY_FEE_PERCENT, agencyPlanExVat(), amountsForOtherLine() (+40 more)

### Community 75 - "HrPlanScreen"
Cohesion: 0.40
Nodes (5): metadata, OpexHrPlanPage(), HrPlanScreen(), OPEX_HR_PLAN_TITLE, opexHrPlanHref()

### Community 76 - "RecipeJournalsTable.tsx"
Cohesion: 0.22
Nodes (14): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+6 more)

### Community 77 - "use-materials.ts"
Cohesion: 0.20
Nodes (26): addMaterial(), deleteMaterial(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent(), materialById() (+18 more)

### Community 78 - "products.ts"
Cohesion: 0.11
Nodes (41): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+33 more)

### Community 80 - "DerivativeEditScreen"
Cohesion: 0.67
Nodes (3): DerivativePage(), metadata, DerivativeEditScreen()

### Community 81 - "SaleScreen.tsx"
Cohesion: 0.05
Nodes (80): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+72 more)

### Community 82 - "SalesJournalScreen.tsx"
Cohesion: 0.38
Nodes (9): saleTotals, workingSalesInMonth(), saleHref(), saleNewHref(), groupSalesByDay(), saleComposition(), SalesJournalScreen(), Workspace() (+1 more)

### Community 83 - "parseOpexDayQuery"
Cohesion: 0.18
Nodes (11): CashflowOpexGroupFactPage(), CashflowHrFactPage(), metadata, CashflowOtherFactPage(), metadata, CashflowTransportFactPage(), metadata, OPEX_HR_FACT_TITLE (+3 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (46): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), HireSeed, MOCK_MONTHS (+38 more)

### Community 85 - "openingFor"
Cohesion: 1.00
Nodes (3): materialOpeningsList(), openingFor(), setMaterialOpening()

### Community 89 - "recipes/new/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, NewDerivativePage(), DerivativeCreateScreen(), NEW_DERIVATIVE_TITLE

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 541 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionJournalFactScreen.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `TransportSummaryScreen.tsx`, `materials/text.ts`, `cashflow.ts`, `parseOpexMonthQuery`, `movement/paths.ts`, `recipes/paths.ts`, `DocumentProvider.tsx`, `index.ts`, `AppShell.tsx`, `isOpexGroupCode`, `cashflow/paths.ts`, `derivatives.ts`, `vat/paths.ts`, `planMonthOpen`, `access.ts`, `useRole`, `credit-resources/paths.ts`, `opexHrefWithQuery`, `entityNameRowClassName`, `finished-product-cost.ts`, `monthKeyFromDate`, `SettingsScreen.tsx`, `production-journal.ts`, `HrPlanScreen`, `RecipeJournalsTable.tsx`, `DerivativeEditScreen`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`, `parseOpexDayQuery`, `recipes/new/page.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06224899598393574 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `ProductionJournalFactScreen.tsx`, `sales-fact.ts`, `finished-goods.ts`, `TransportSummaryScreen.tsx`, `cashflow.ts`, `next`, `production-fact.ts`, `hr.ts`, `index.ts`, `isOpexGroupCode`, `planMonthOpen`, `summary.ts`, `useRole`, `credit-resources/paths.ts`, `entityNameRowClassName`, `sales-plan.ts`, `Workspace`, `production-journal.ts`, `HrPlanScreen`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `SummaryTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14153846153846153 - nodes in this community are weakly interconnected._
- **Why does `PrototypeDocument` connect `products.ts` to `use-opex.ts`, `sales-fact.ts`, `mock-document.ts`, `materials.ts`, `finished-goods.ts`, `DerivativeCreateScreen.tsx`, `credit-resources.ts`, `derivative-movement.ts`, `cashflow.ts`, `production-journal-fact.ts`, `production-plan.ts`, `movement-plan.ts`, `derivative-cost.ts`, `recipe-yield.ts`, `production-fact.ts`, `document.ts`, `DocumentProvider.tsx`, `hr.ts`, `AppShell.tsx`, `derivatives.ts`, `summary.ts`, `sales-plan.ts`, `finished-product-cost.ts`, `SettingsScreen.tsx`, `production-journal.ts`, `operating-expense.ts`, `SaleScreen.tsx`, `SalesJournalScreen.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `ProductionJournalFactScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09059233449477352 - nodes in this community are weakly interconnected._