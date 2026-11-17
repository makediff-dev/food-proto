# Graph Report - food-proto  (2026-11-17)

## Corpus Check
- 297 files · ~179,203 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 2814 nodes · 11194 edges · 104 communities (97 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 70 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c650972`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- use-opex.ts
- RoleProvider.tsx
- SummaryTable.tsx
- shiftMonth
- SaleScreen.tsx
- DerivativeMovementSummaryTable.tsx
- Предметная область
- mock-materials.ts
- package.json
- biome.json
- movementRow
- monthKeyFromDate
- compilerOptions
- FinishedProductEditScreen.tsx
- movement-plan.ts
- MaterialReceiptFormTable.tsx
- cashflow/paths.ts
- credit-resources.ts
- derivative-movement.ts
- FinishedGoodsFactTable.tsx
- CashflowFactScreen.tsx
- TransportSummaryScreen.tsx
- production-plan.ts
- production-journal.ts
- Флоу товара
- Cells.tsx
- TransportPlanScreen.tsx
- materials.ts
- resolveMaterialMonth
- document.ts
- HrPlanScreen.tsx
- ColumnLabel
- derivative-movement/paths.ts
- migrate-document.ts
- hr.ts
- PlanningScreen.tsx
- RecipePrint.tsx
- sales-fact.ts
- flow.md
- useDocumentStore
- AppShell.tsx
- derivative-cost.ts
- Отчет общий сырья
- DerivativeCreateScreen.tsx
- postcss.config.mjs
- planMonthOpen
- isOccurredOn
- Отчет общий движения
- summary.ts
- MaterialsNormsScreen.tsx
- finished-goods.ts
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- recipe-yield.ts
- vat/paths.ts
- inputs/README.md
- ProductionJournalFactScreen.tsx
- recipes/paths.ts
- recipe-consumption.ts
- Отчет общий движения производных
- use-credit-resources.ts
- CreditResourcesFactScreen.tsx
- CreditResourcesSummaryScreen.tsx
- Себестоимость готовой продукции
- entityNameRowClassName
- DerivativeCompositionEditor
- production-fact.ts
- index.ts
- HrFactScreen.tsx
- ProductionJournalScreen.tsx
- operating-expense.ts
- finished-product-cost.ts
- opexHrefWithQuery
- derivatives.ts
- products.ts
- Отчет подневный движения
- Отчет подневный производства
- Отчет общий производства
- Отчет подневный продаж
- SummaryHeadlineTable.tsx
- mock-opex.ts
- next
- profit-tax.ts
- access.ts
- SettingsScreen.tsx
- RecipeJournalsTable.tsx
- FinishedProductCostTable.tsx
- FinishedGoodsMonthScreen.tsx
- keepWithNext
- OpexSummaryScreen.tsx
- MaterialDocumentScreen.tsx
- DocumentForm
- sales-plan.ts
- README.md
- use-finished-recipes.ts
- PrototypeDocument
- AGENTS.md
- Операционные расходы
- Движение готовой продукции
- Движение производных

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 124 edges
2. `next` - 120 edges
3. `PageFrame()` - 113 edges
4. `react` - 91 edges
5. `entityNameRowClassName()` - 87 edges
6. `planMonthOpen()` - 85 edges
7. `isOccurredOn()` - 83 edges
8. `useOpex()` - 81 edges
9. `ColumnLabel()` - 80 edges
10. `useRole()` - 75 edges

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

## Communities (104 total, 7 thin omitted)

### Community 0 - "use-opex.ts"
Cohesion: 0.06
Nodes (85): HireSeed, HrTaxRatesMonth, isDeletionMark(), isTransportHireKind(), TRANSPORT_HIRE_KINDS, TransportHireKind, TransportHireMonthPlan, TransportHireMonthPlanLine (+77 more)

### Community 1 - "RoleProvider.tsx"
Cohesion: 0.12
Nodes (22): metadata, onest, RootLayout(), unbounded, readRole(), ROLE_STORAGE_KEY, writeRole(), RoleProvider() (+14 more)

### Community 2 - "SummaryTable.tsx"
Cohesion: 0.09
Nodes (31): priceWithVatFromExVat(), SalesPlanRejection, SummaryGroup, SummaryRow, SummaryVariance, VAT_PARSE_ERROR, averagedUnitCost(), CategoryBlock() (+23 more)

### Community 3 - "shiftMonth"
Cohesion: 0.10
Nodes (35): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), activeCategories(), missingProductionPlanProducts(), activeProducts(), maxSaleOccurredOn() (+27 more)

### Community 4 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (66): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+58 more)

### Community 5 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.09
Nodes (28): COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeMovementSummaryTable(), DerivativeRow() (+20 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (24): Блоки, Ввод факта (производство), Готовая продукция (рецептурный журнал), Движение денежных средств, Движение кредитных ресурсов, Отчет общий (производство), Отчет подневный (производство), Период и ассортимент (+16 more)

### Community 7 - "mock-materials.ts"
Cohesion: 0.10
Nodes (25): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+17 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "movementRow"
Cohesion: 0.15
Nodes (22): costExVat(), planConsumptionQuantityForDerivative(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+14 more)

### Community 11 - "monthKeyFromDate"
Cohesion: 0.13
Nodes (29): react, metadata, RecipesCostPage(), derivativeCostMonth(), derivativeMovementMonth(), MaterialWarehouseId, monthKeyFromDate(), cashflowPlanHref() (+21 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.13
Nodes (37): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), MaterialDialog(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent() (+29 more)

### Community 14 - "movement-plan.ts"
Cohesion: 0.14
Nodes (28): FinishedGoodsNormLine, FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), storedInventoryPiecesForProduct() (+20 more)

### Community 15 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (52): MATERIAL_GROUPS, ProductCategory, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals (+44 more)

### Community 16 - "cashflow/paths.ts"
Cohesion: 0.17
Nodes (14): CashflowSummaryPage(), metadata, CashflowPlanPage(), metadata, CASHFLOW_FACT_HREF, CASHFLOW_PLAN_HREF, CASHFLOW_PLAN_TITLE, CASHFLOW_SECTION_TITLE (+6 more)

### Community 17 - "credit-resources.ts"
Cohesion: 0.19
Nodes (24): creditDayAmounts(), CreditMonthViewOptions, creditorVisibleInMonth(), creditResourceDaysList(), creditResourceMonthsList(), creditResourcesMonthView, dayAmounts(), dayHasActivity() (+16 more)

### Community 18 - "derivative-movement.ts"
Cohesion: 0.09
Nodes (47): boostTenPercent(), mockConsumptionDays(), buildRow(), costForQuantity(), derivativeConsumptionDayRecord(), DerivativeConsumptionRejection, DerivativeMovementMonthView, DerivativeNormField (+39 more)

### Community 19 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.09
Nodes (35): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS (+27 more)

### Community 20 - "CashflowFactScreen.tsx"
Cohesion: 0.06
Nodes (76): CashflowFactPage(), metadata, buildCashflowBody(), CashflowLineView, CashflowMoneySide, cashflowMonthView, creditExpenseLines(), creditIncomeLines() (+68 more)

### Community 21 - "TransportSummaryScreen.tsx"
Cohesion: 0.16
Nodes (15): metadata, OpexTransportPage(), OPEX_TRANSPORT_TITLE, opexTransportHref(), HIRE_GROUP_END, HIRE_SUB_BANNERS, HireColumnKey, hireColumns() (+7 more)

### Community 22 - "production-plan.ts"
Cohesion: 0.16
Nodes (24): commitDocumentUpdate(), activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals() (+16 more)

### Community 23 - "production-journal.ts"
Cohesion: 0.10
Nodes (40): ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), defaultProductionEntryDay(), deleteProductionEntry() (+32 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Приведение плана и факта, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "Cells.tsx"
Cohesion: 0.15
Nodes (20): CreditFieldRejection, formatRubles(), fromRubles(), fromRublesUpTo(), MAX_PRICE_KOPECKS, parseDecimal(), roundKopecksToRubles(), CREDIT_ERROR (+12 more)

### Community 26 - "TransportPlanScreen.tsx"
Cohesion: 0.15
Nodes (25): metadata, OpexTransportPlanPage(), CreditResourcesPlanScreen(), inputKind(), OtherGroupBlock(), OPEX_TRANSPORT_PLAN_TITLE, opexTransportPlanHref(), AddNamedDialog() (+17 more)

### Community 27 - "materials.ts"
Cohesion: 0.11
Nodes (53): MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyMaterialConsumptionLine(), emptyPlanLine(), hasStoredMaterialInventoryLine() (+45 more)

### Community 28 - "resolveMaterialMonth"
Cohesion: 0.16
Nodes (30): CashflowOpexGroupFactPage(), generateMetadata(), generateMetadata(), OpexGroupPage(), generateMetadata(), OpexGroupPlanPage(), metadata, OpexOtherPlanPage() (+22 more)

### Community 29 - "document.ts"
Cohesion: 0.03
Nodes (71): mockCreditors, mockCreditResourceDays, mockCreditResourceMonths, burger, caesar, CatalogProductId, catalogProductIds, closingInventoryOctober (+63 more)

### Community 30 - "HrPlanScreen.tsx"
Cohesion: 0.10
Nodes (30): metadata, OpexHrPage(), metadata, OpexHrPlanPage(), HrDepartmentId, HR_DEPARTMENT_LABELS, HrDepartmentView, HrOutsourcingRowView (+22 more)

### Community 31 - "ColumnLabel"
Cohesion: 0.10
Nodes (42): DerivativeConsumptionTable(), SectionBlock(), DerivativeMovementInventoryTable(), WorkshopBlock(), DerivativeMovementPlanTable(), WorkshopBlock(), CategoryBlock(), InventoryTable() (+34 more)

### Community 32 - "derivative-movement/paths.ts"
Cohesion: 0.13
Nodes (19): DerivativeConsumptionPage(), metadata, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata (+11 more)

### Community 33 - "migrate-document.ts"
Cohesion: 0.11
Nodes (24): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), LEGACY_OPENING_SCHEMA (+16 more)

### Community 34 - "hr.ts"
Cohesion: 0.07
Nodes (53): HR_DEPARTMENT_IDS, HR_SHOP_DEPARTMENT_IDS, HrMonthFact, HrMonthFactStaffLine, HrMonthPlan, HrMonthPlanStaffLine, HrPosition, isHrShopDepartmentId() (+45 more)

### Community 35 - "PlanningScreen.tsx"
Cohesion: 0.18
Nodes (18): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+10 more)

### Community 36 - "RecipePrint.tsx"
Cohesion: 0.15
Nodes (20): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), componentDraftKey(), DerivativeLineDraft, FinishedProductsScreen(), finishedProductHref() (+12 more)

### Community 37 - "sales-fact.ts"
Cohesion: 0.11
Nodes (37): Удаление, UnitCost, Product, productCostPerPiece(), averageAmount(), percentHundredths(), vatPercentHundredths(), dayGridProducts() (+29 more)

### Community 38 - "flow.md"
Cohesion: 0.35
Nodes (3): Инвентаризация, Колонки, Что пишется

### Community 39 - "useDocumentStore"
Cohesion: 0.09
Nodes (36): metadata, MovementFactPage(), DocumentSource, DocumentStoreContext, useDocumentStore(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle() (+28 more)

### Community 40 - "AppShell.tsx"
Cohesion: 0.09
Nodes (31): MATERIALS_CONSUMPTION_HREF, MATERIALS_SECTION_TITLE, MOVEMENT_SECTION_TITLE, OPEX_OTHER_FACT_NAV_LABEL, OPEX_OTHER_TITLE, OPEX_SECTION_TITLE, opexGroupHrefPath(), opexGroupPlanHrefPath() (+23 more)

### Community 41 - "derivative-cost.ts"
Cohesion: 0.18
Nodes (22): Свод, Свод, buildCostRow(), componentUnitPriceInternal(), costForQuantity(), costPerKgFromBatch(), costPerPieceFromBatch(), derivativeBatchCost() (+14 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "DerivativeCreateScreen.tsx"
Cohesion: 0.11
Nodes (25): DerivativePage(), metadata, DERIVATIVE_WORKSHOPS, MaterialConsumptionRejection, MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection (+17 more)

### Community 45 - "planMonthOpen"
Cohesion: 0.16
Nodes (19): MaterialsConsumptionPage(), metadata, defaultSalesFactDay(), planMonthOpen(), DerivativeConsumptionScreen(), open(), resolveDay(), resolveMaterialMonth() (+11 more)

### Community 46 - "isOccurredOn"
Cohesion: 0.10
Nodes (35): CashflowHrFactPage(), metadata, CashflowOtherFactPage(), metadata, CashflowTransportFactPage(), metadata, isOccurredOn(), applyDayFactToGroup() (+27 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "summary.ts"
Cohesion: 0.11
Nodes (41): Единицы, monthInterestAmounts(), salesPlanLineMetrics, actualRangeSummary(), applyFactScale(), applyPlanScale(), applySummaryLens(), calendarDays() (+33 more)

### Community 49 - "MaterialsNormsScreen.tsx"
Cohesion: 0.24
Nodes (10): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, liveNorms(), materialConsumptionIsNormed(), materialNormQuantity(), materialNormsList(), MaterialsNormsScreen() (+2 more)

### Community 50 - "finished-goods.ts"
Cohesion: 0.11
Nodes (51): bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces(), emptyPlanSide() (+43 more)

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

### Community 57 - "recipe-yield.ts"
Cohesion: 0.39
Nodes (8): applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths(), RecipeLineRef, recipeYieldRejection(), validateRecipeYield()

### Community 58 - "vat/paths.ts"
Cohesion: 0.29
Nodes (8): metadata, VatReportPage(), monthHref(), parseVatMonthQuery(), VAT_REPORT_SECTION_TITLE, VAT_REPORT_SUMMARY_HREF, VAT_REPORT_SUMMARY_TITLE, vatReportSummaryHref()

### Community 60 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (22): recommendedDayKey(), defaultProductionJournalFactDay(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), productionJournalFactHref(), DayDateControl(), onKeyDown() (+14 more)

### Community 61 - "recipes/paths.ts"
Cohesion: 0.16
Nodes (16): RecipesCostDetailPage(), RecipesFinishedCostDetailPage(), metadata, RecipesFinishedCostPage(), metadata, NewDerivativePage(), isDerivativeWorkshopId(), DerivativeCreateScreen() (+8 more)

### Community 62 - "recipe-consumption.ts"
Cohesion: 0.19
Nodes (23): realConsumptionQuantityForMaterialDay(), calculatedConsumptionQuantityForDerivativeDay(), calculatedConsumptionQuantityForMaterialDay(), derivativeBatchThousandths(), directConsumptionQuantityForComponent(), directConsumptionQuantityInternal(), effectiveDerivativeVolumeInternal(), effectiveFactLineQuantity() (+15 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.12
Nodes (13): Себестоимость производных, Состав строки, Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется (+5 more)

### Community 64 - "use-credit-resources.ts"
Cohesion: 0.22
Nodes (22): activeCreditors(), addCreditor(), addCreditorRejection(), CreditDayField, CreditMonthField, creditorsList(), deleteCreditor(), findCreditor() (+14 more)

### Community 65 - "CreditResourcesFactScreen.tsx"
Cohesion: 0.17
Nodes (17): CreditResourcesFactPage(), metadata, CreditResourcesFactScreen(), open(), inputKind(), resolveDay(), shiftCalendarDay(), CREDIT_RESOURCES_FACT_HREF (+9 more)

### Community 66 - "CreditResourcesSummaryScreen.tsx"
Cohesion: 0.14
Nodes (16): CreditResourcesSummaryPage(), metadata, CreditResourcesPlanPage(), metadata, COLUMN_GROUPS, COLUMN_KIND, columnEdge(), ColumnKey (+8 more)

### Community 68 - "entityNameRowClassName"
Cohesion: 0.07
Nodes (59): costWithVat(), MaterialGroupId, MaterialGroupMovement, MaterialMovementRow, MaterialMovementTotals, MaterialWarehouseMovement, DerivativeRow(), inputKind() (+51 more)

### Community 69 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 70 - "production-fact.ts"
Cohesion: 0.13
Nodes (32): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+24 more)

### Community 71 - "index.ts"
Cohesion: 0.09
Nodes (63): DerivativeMovementRow, DerivativeMovementSection, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, VarianceSense, ConsumptionLine, ConsumptionSection (+55 more)

### Community 72 - "HrFactScreen.tsx"
Cohesion: 0.21
Nodes (18): hrDayOutsourcingValue(), hrDayStaffValue(), CashflowSummaryScreen(), toggle(), defaultOpenIds(), LineRows(), DepartmentBlock(), FactDepartment (+10 more)

### Community 73 - "ProductionJournalScreen.tsx"
Cohesion: 0.12
Nodes (24): metadata, ProductionFactPage(), metadata, metadata, ProductionJournalPage(), metadata, ProductionPlanPage(), productionEntryPieces() (+16 more)

### Community 74 - "operating-expense.ts"
Cohesion: 0.07
Nodes (48): OpexDayFact, OpexDayLine, OpexGroupCode, OpexMonthLine, OpexMonthLines, activeOtherLines(), addOpexOtherLine(), addOpexOtherLineRejection() (+40 more)

### Community 75 - "finished-product-cost.ts"
Cohesion: 0.21
Nodes (16): buildCostRow(), componentUnitPrice(), costForQuantity(), finishedProductCostDetail, FinishedProductCostLineContribution, FinishedProductCostMode, finishedProductCostMonth(), FinishedProductCostMonthView (+8 more)

### Community 76 - "opexHrefWithQuery"
Cohesion: 0.20
Nodes (10): OpexGroupFactRedirectPage(), OpexHrFactRedirectPage(), OpexOtherFactRedirectPage(), OpexTransportFactRedirectPage(), OPEX_HR_FACT_HREF, OPEX_OTHER_FACT_HREF, OPEX_TRANSPORT_FACT_HREF, opexGroupFactHrefPath() (+2 more)

### Community 77 - "derivatives.ts"
Cohesion: 0.12
Nodes (33): metadata, RecipeDerivativesPage(), activeDerivatives(), addDerivative(), deleteDerivative(), DerivativeAddRejection, derivativeCompositionLines(), DerivativeCompositionLineView (+25 more)

### Community 78 - "products.ts"
Cohesion: 0.13
Nodes (36): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+28 more)

### Community 83 - "SummaryHeadlineTable.tsx"
Cohesion: 0.21
Nodes (15): formatTaxRateLabel(), headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SALES_OPS_HEADLINE_ROWS (+7 more)

### Community 84 - "mock-opex.ts"
Cohesion: 0.06
Nodes (45): distribute(), eachDate(), factFuelExVat(), HIRE_PRICE_KOP, HIRE_SEEDS, hireAmount(), isShopPositionId(), MOCK_MONTHS (+37 more)

### Community 85 - "next"
Cohesion: 0.10
Nodes (34): nextConfig, next, Home(), metadata, metadata, PlanPage(), metadata, ProductionPage() (+26 more)

### Community 86 - "profit-tax.ts"
Cohesion: 0.24
Nodes (14): Верхний блок сводки, PROFIT_TAX_PERCENT, ProfitTaxRateChange, byMonth(), DEFAULT_PROFIT_TAX_HUNDREDTHS, isRateHundredths(), PROFIT_TAX_RATE_SCALE, profitTaxRateChanges() (+6 more)

### Community 87 - "access.ts"
Cohesion: 0.19
Nodes (13): DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_SUMMARY_HREF, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, HOME_SECTION_ORDER, pathnameSection(), roleCanAccessPath(), roleHomeHref() (+5 more)

### Community 88 - "SettingsScreen.tsx"
Cohesion: 0.11
Nodes (24): metadata, SettingsPage(), DOCUMENT_COLLECTION_KEYS, DocumentCollectionKey, downloadDocumentFile(), formatDocumentFileName(), isPlainObject(), parseDocumentFile() (+16 more)

### Community 89 - "RecipeJournalsTable.tsx"
Cohesion: 0.20
Nodes (15): react-dom, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+7 more)

### Community 90 - "FinishedProductCostTable.tsx"
Cohesion: 0.16
Nodes (19): CostCell(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, CostCell(), GROUP_END_KEYS, columnEdgeClass() (+11 more)

### Community 91 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 92 - "keepWithNext"
Cohesion: 0.11
Nodes (55): MetricCell(), RowCell(), TotalsCell(), RowCell(), TotalsCell(), RowCell(), TotalsCell(), NormDeviationCell() (+47 more)

### Community 93 - "OpexSummaryScreen.tsx"
Cohesion: 0.20
Nodes (12): metadata, OpexSummaryPage(), COLUMN_GROUPS, columnEdgeClass(), ColumnKey, COLUMNS, GROUP_END_KEYS, GroupBlock() (+4 more)

### Community 94 - "MaterialDocumentScreen.tsx"
Cohesion: 0.09
Nodes (35): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptPage(), metadata (+27 more)

### Community 95 - "DocumentForm"
Cohesion: 0.25
Nodes (11): activeMaterials(), DocumentForm(), changeWarehouse(), draftsForWarehouse(), save(), setLine(), emptyMaterialReceiptLineDraft(), lineAmountWithVat() (+3 more)

### Community 96 - "sales-plan.ts"
Cohesion: 0.33
Nodes (10): activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), isPrice(), isVolume(), lineNumbersRejection(), monthIsTaken() (+2 more)

### Community 97 - "README.md"
Cohesion: 0.31
Nodes (5): Как собрать первый прототип, Порядок, Формула, Запуск, Куда смотреть

### Community 98 - "use-finished-recipes.ts"
Cohesion: 0.29
Nodes (6): FinishedProductRecipePage(), metadata, ProductRecipeLine, ProductRecipeRejection, FinishedProductEditScreen(), useFinishedRecipes()

### Community 99 - "PrototypeDocument"
Cohesion: 0.33
Nodes (7): Архитектура прототипа, Поток данных, Слои, Чего не делать, DocumentState, DocumentStoreValue, PrototypeDocument

### Community 100 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 101 - "Операционные расходы"
Cohesion: 0.50
Nodes (4): HR (`HR`), Операционные расходы, Прочие статьи (`Operation Expense`), Транспорт (`Transport`)

### Community 102 - "Движение готовой продукции"
Cohesion: 0.67
Nodes (3): Ввод плана (движение), Движение готовой продукции, Инвентаризация (движение)

### Community 103 - "Движение производных"
Cohesion: 0.67
Nodes (3): Ввод плана (движение производных), Движение производных, Инвентаризация (движение производных)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 558 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `RoleProvider.tsx`, `shiftMonth`, `SaleScreen.tsx`, `package.json`, `monthKeyFromDate`, `FinishedProductEditScreen.tsx`, `cashflow/paths.ts`, `CashflowFactScreen.tsx`, `TransportSummaryScreen.tsx`, `production-journal.ts`, `TransportPlanScreen.tsx`, `resolveMaterialMonth`, `HrPlanScreen.tsx`, `derivative-movement/paths.ts`, `PlanningScreen.tsx`, `RecipePrint.tsx`, `useDocumentStore`, `AppShell.tsx`, `DerivativeCreateScreen.tsx`, `planMonthOpen`, `isOccurredOn`, `MaterialsNormsScreen.tsx`, `vat/paths.ts`, `ProductionJournalFactScreen.tsx`, `recipes/paths.ts`, `CreditResourcesFactScreen.tsx`, `CreditResourcesSummaryScreen.tsx`, `index.ts`, `HrFactScreen.tsx`, `ProductionJournalScreen.tsx`, `opexHrefWithQuery`, `derivatives.ts`, `access.ts`, `SettingsScreen.tsx`, `RecipeJournalsTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `OpexSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `use-finished-recipes.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-opex.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05987703822507351 - nodes in this community are weakly interconnected._
- **Why does `react` connect `monthKeyFromDate` to `RoleProvider.tsx`, `SummaryTable.tsx`, `shiftMonth`, `SaleScreen.tsx`, `DerivativeMovementSummaryTable.tsx`, `package.json`, `FinishedProductEditScreen.tsx`, `MaterialReceiptFormTable.tsx`, `FinishedGoodsFactTable.tsx`, `CashflowFactScreen.tsx`, `TransportSummaryScreen.tsx`, `production-journal.ts`, `Cells.tsx`, `TransportPlanScreen.tsx`, `resolveMaterialMonth`, `HrPlanScreen.tsx`, `ColumnLabel`, `PlanningScreen.tsx`, `useDocumentStore`, `AppShell.tsx`, `DerivativeCreateScreen.tsx`, `planMonthOpen`, `isOccurredOn`, `ProductionJournalFactScreen.tsx`, `CreditResourcesFactScreen.tsx`, `CreditResourcesSummaryScreen.tsx`, `entityNameRowClassName`, `index.ts`, `HrFactScreen.tsx`, `ProductionJournalScreen.tsx`, `next`, `access.ts`, `SettingsScreen.tsx`, `RecipeJournalsTable.tsx`, `FinishedProductCostTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `keepWithNext`, `OpexSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `RoleProvider.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._
- **Why does `monthKeyFromDate()` connect `monthKeyFromDate` to `shiftMonth`, `SaleScreen.tsx`, `CashflowFactScreen.tsx`, `TransportSummaryScreen.tsx`, `production-journal.ts`, `TransportPlanScreen.tsx`, `resolveMaterialMonth`, `HrPlanScreen.tsx`, `ColumnLabel`, `hr.ts`, `PlanningScreen.tsx`, `sales-fact.ts`, `useDocumentStore`, `planMonthOpen`, `isOccurredOn`, `summary.ts`, `finished-goods.ts`, `ProductionJournalFactScreen.tsx`, `CreditResourcesFactScreen.tsx`, `CreditResourcesSummaryScreen.tsx`, `production-fact.ts`, `index.ts`, `HrFactScreen.tsx`, `ProductionJournalScreen.tsx`, `next`, `FinishedGoodsMonthScreen.tsx`, `OpexSummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `sales-plan.ts`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `SummaryTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0928030303030303 - nodes in this community are weakly interconnected._