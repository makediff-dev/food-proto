# Graph Report - food-proto  (2026-10-27)

## Corpus Check
- 192 files · ~113,635 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1801 nodes · 6749 edges · 79 communities (72 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c5b2dee9`
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
- finished-goods.ts
- package.json
- biome.json
- use-materials.ts
- derivatives.ts
- compilerOptions
- DerivativeForm
- ProductionFactTable.tsx
- SummaryScreen.tsx
- PageFrame
- monthKeyFromDate
- document.ts
- materials.ts
- MaterialReceiptFormTable.tsx
- MaterialsNormsScreen
- production-plan.ts
- sales-fact.ts
- Флоу товара
- SummaryTable.tsx
- ProductIndex
- PlanningScreen.tsx
- keepWithNext
- isOccurredOn
- ProductionJournalFactScreen.tsx
- Архитектура прототипа
- movement-plan.ts
- production-fact.ts
- FinishedProductEditScreen.tsx
- materials/text.ts
- DerivativeMovementSummaryTable.tsx
- SaleScreen.tsx
- DerivativesScreen.tsx
- InventoryScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- sales-plan.ts
- postcss.config.mjs
- Cells.tsx
- next
- Отчет общий движения
- DocumentProvider.tsx
- DerivativeCreateScreen.tsx
- Инвентаризация
- Ввод плана движения
- Ввод факта (производство)
- Ввод плана (производство)
- Ввод факта (продажи)
- Ввод плана (продажи)
- Отчет общий продаж
- Отчет подневный движения
- Отчет подневный производства
- inputs/README.md
- Отчет общий производства
- Отчет подневный продаж
- recipe-yield.ts
- Отчет общий движения производных
- SummaryHeadlineTable.tsx
- MaterialDocumentScreen.tsx
- FinishedGoodsFactScreen.tsx
- Icons.tsx
- RecipePrint.tsx
- index.ts
- materials/paths.ts
- production/paths.ts
- production-journal.ts
- AGENTS.md
- production/fact/page.tsx
- sales.ts
- DerivativeCompositionEditor
- receipts/[id]/page.tsx
- ProductCategory

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 76 edges
2. `PageFrame()` - 67 edges
3. `next` - 66 edges
4. `planMonthOpen()` - 59 edges
5. `keepWithNext()` - 59 edges
6. `react` - 58 edges
7. `VatMoneyCell()` - 49 edges
8. `DerivativeForm()` - 43 edges
9. `IconChevronDown()` - 43 edges
10. `IconChevronRight()` - 42 edges

## Surprising Connections (you probably didn't know these)
- `Что пишется` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/tables/production-plan.md → src/domain/finished-goods.ts
- `Ввод плана (движение)` --references--> `finishedGoodsMonthDays()`  [INFERRED]
  docs/domain.md → src/domain/finished-goods.ts
- `Единицы` --references--> `costWithVat()`  [INFERRED]
  docs/architecture.md → src/domain/cost.ts
- `Единицы` --references--> `plannedProductionVolumePieces()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts
- `Удаление` --references--> `finishedGoodsGridProducts()`  [INFERRED]
  docs/architecture.md → src/domain/finished-goods.ts

## Import Cycles
- 3-file cycle: `src/domain/derivatives.ts -> src/domain/materials.ts -> src/domain/recipe-consumption.ts -> src/domain/derivatives.ts`
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (79 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (49): Единицы, SalesPlan, percentHundredths(), ratioRound(), daysInMonth(), planPhase, priceExVatTenThousandths(), profitabilityHundredths() (+41 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.14
Nodes (24): metadata, NewProductionEntryPage(), defaultProductionEntryDay(), ProductionEntryRejection, productionLineAmountWithVat(), NEW_PRODUCTION_ENTRY_TITLE, productionJournalHref(), emptyProductionEntryLineDraft() (+16 more)

### Community 2 - "products.ts"
Cohesion: 0.12
Nodes (41): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+33 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.09
Nodes (41): buildRow(), costForQuantity(), derivativeConsumptionPrice(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList() (+33 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.09
Nodes (42): costWithVat(), DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS (+34 more)

### Community 6 - "Предметная область"
Cohesion: 0.08
Nodes (26): Блоки, Ввод плана (движение), Ввод плана (движение производных), Ввод факта (производство), Верхний блок сводки, Готовая продукция (рецептурный журнал), Движение готовой продукции, Движение производных (+18 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.14
Nodes (39): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), clampSummaryMonth(), closingNormMetrics(), closingStockPieces() (+31 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.18
Nodes (27): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+19 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.21
Nodes (19): activeDerivatives(), addDerivative(), derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById(), isDerivativeUnit() (+11 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.13
Nodes (32): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent(), enableByPiece() (+24 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.25
Nodes (19): CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf(), FACT_COLUMNS, MetricCell(), Pieces(), PLAN_COLUMNS (+11 more)

### Community 15 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (27): OperatingExpenseRejection, FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), productionFactHref(), FullscreenToggle(), productionFactPageTitle() (+19 more)

### Community 16 - "PageFrame"
Cohesion: 0.09
Nodes (40): react, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, metadata (+32 more)

### Community 17 - "monthKeyFromDate"
Cohesion: 0.11
Nodes (39): productionEntryPieces(), workingProductionEntriesInMonth(), missingProductionPlanProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), saleTotals, workingSalesInMonth() (+31 more)

### Community 18 - "document.ts"
Cohesion: 0.05
Nodes (49): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+41 more)

### Community 19 - "materials.ts"
Cohesion: 0.09
Nodes (47): costExVat(), MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity() (+39 more)

### Community 20 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (65): DerivativeMovementInventoryTable(), WorkshopBlock(), WorkshopBlock(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup (+57 more)

### Community 21 - "MaterialsNormsScreen"
Cohesion: 0.50
Nodes (4): MaterialsNormsPage(), metadata, MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.10
Nodes (36): Удаление, unitCost, Product, PrototypeDocument, amountExVat(), vatPercentHundredths(), dayGridProducts(), periodGridCategories() (+28 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (25): amountWithVat(), priceWithVatFromExVat(), SummaryGroup, SummaryRow, SummarySide, SummaryVariance, VAT_PARSE_ERROR, CategoryBlock() (+17 more)

### Community 26 - "ProductIndex"
Cohesion: 0.16
Nodes (13): CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), ProductRow(), visibleDayRows(), editableFieldNear(), ProductRow(), editableFieldNear() (+5 more)

### Community 27 - "PlanningScreen.tsx"
Cohesion: 0.14
Nodes (25): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery(), PLANNING_ARCHIVE_TITLE (+17 more)

### Community 28 - "keepWithNext"
Cohesion: 0.11
Nodes (51): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, TotalCell(), MetricCell(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND (+43 more)

### Community 29 - "isOccurredOn"
Cohesion: 0.13
Nodes (18): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+10 more)

### Community 30 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.12
Nodes (26): defaultProductionJournalFactDay(), defaultSalesFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), productionJournalFactPageTitle(), resolveDay() (+18 more)

### Community 31 - "Архитектура прототипа"
Cohesion: 0.19
Nodes (9): Архитектура прототипа, Поток данных, Слои, Чего не делать, Как собрать первый прототип, Порядок, Формула, Запуск (+1 more)

### Community 32 - "movement-plan.ts"
Cohesion: 0.13
Nodes (32): closingInventoryDeviationPieces(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingDeviationPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+24 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.11
Nodes (38): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+30 more)

### Community 34 - "FinishedProductEditScreen.tsx"
Cohesion: 0.20
Nodes (13): FinishedProductRecipePage(), metadata, DerivativeAddRejection, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), FinishedProductEditScreen() (+5 more)

### Community 35 - "materials/text.ts"
Cohesion: 0.20
Nodes (9): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MATERIAL_DOCUMENT_ERROR, MATERIAL_NAME_ERROR, MATERIAL_NORM_ERROR, MATERIAL_OPENING_ERROR (+1 more)

### Community 36 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.11
Nodes (26): Подсказки заголовков таблицы, COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey, COLUMNS, DERIVATIVE_SUMMARY_SUB_BANNERS, DerivativeMovementSummaryTable() (+18 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.18
Nodes (25): maxSaleOccurredOn(), saleLineAmountWithVat(), saleLinePriceWithVat(), salesJournalHref(), emptySaleLineDraft(), rowMetrics(), SaleLineDraft, SaleLineField (+17 more)

### Community 39 - "DerivativesScreen.tsx"
Cohesion: 0.13
Nodes (24): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines(), derivativeReferencedInRecipes(), derivativeSections() (+16 more)

### Community 40 - "InventoryScreen.tsx"
Cohesion: 0.13
Nodes (24): metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage(), activeCategories(), resolveSummaryMonthRange() (+16 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.11
Nodes (22): DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE, DERIVATIVE_MOVEMENT_SUMMARY_HREF, AppShell(), currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV (+14 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "sales-plan.ts"
Cohesion: 0.26
Nodes (13): activeProducts(), activeSalesPlans(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), isPrice(), isVolume(), lineNumbersRejection() (+5 more)

### Community 45 - "Cells.tsx"
Cohesion: 0.18
Nodes (18): SaleRejection, formatRubles(), fromRubles(), fromRublesUpTo(), parseDecimal(), roundKopecksToRubles(), lineAmountWithVat(), quantityForAmount() (+10 more)

### Community 46 - "next"
Cohesion: 0.20
Nodes (13): nextConfig, next, Home(), metadata, metadata, PlanPage(), SummaryLens, parseSummaryQuery() (+5 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "DocumentProvider.tsx"
Cohesion: 0.13
Nodes (21): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+13 more)

### Community 49 - "DerivativeCreateScreen.tsx"
Cohesion: 0.20
Nodes (12): DerivativePage(), metadata, metadata, NewDerivativePage(), outputPieceThousandthsOf(), DerivativeCreateScreen(), DerivativeEditScreen(), initialGramsDraft() (+4 more)

### Community 50 - "Инвентаризация"
Cohesion: 0.67
Nodes (3): Инвентаризация, Колонки, Что пишется

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

### Community 62 - "recipe-yield.ts"
Cohesion: 0.25
Nodes (12): isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths() (+4 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.15
Nodes (10): Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется, Остаток на конец, Остаток на начало (+2 more)

### Community 64 - "SummaryHeadlineTable.tsx"
Cohesion: 0.33
Nodes (11): OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS, SummaryHeadlineTable() (+3 more)

### Community 65 - "MaterialDocumentScreen.tsx"
Cohesion: 0.18
Nodes (18): metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse() (+10 more)

### Community 66 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.17
Nodes (17): metadata, MovementFactPage(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay() (+9 more)

### Community 67 - "Icons.tsx"
Cohesion: 0.22
Nodes (17): componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem, SectionBlock() (+9 more)

### Community 68 - "RecipePrint.tsx"
Cohesion: 0.21
Nodes (17): react-dom, formatQuantity(), componentDraftKey(), RecipeListSection, derivativePrintModel(), draftsFromSavedLines(), formatPrintKilograms(), formatPrintPieces() (+9 more)

### Community 69 - "index.ts"
Cohesion: 0.09
Nodes (65): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND (+57 more)

### Community 70 - "materials/paths.ts"
Cohesion: 0.14
Nodes (17): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+9 more)

### Community 71 - "production/paths.ts"
Cohesion: 0.14
Nodes (16): metadata, ProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage() (+8 more)

### Community 72 - "production-journal.ts"
Cohesion: 0.26
Nodes (16): ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection(), productionEntryByIdOrNull() (+8 more)

### Community 73 - "AGENTS.md"
Cohesion: 0.40
Nodes (3): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта

### Community 74 - "production/fact/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, ProductionFactPage(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE

### Community 75 - "sales.ts"
Cohesion: 0.34
Nodes (14): SaleLine, productAllowedInPeriodSale(), addSale(), addSaleRejection(), deleteSale(), lineRejection(), normalizeCustomer(), replaceSales() (+6 more)

### Community 76 - "DerivativeCompositionEditor"
Cohesion: 0.33
Nodes (4): buildCandidateGroups(), DerivativeCompositionEditor(), RecipeComponentSearch(), selectedGroups()

### Community 77 - "receipts/[id]/page.tsx"
Cohesion: 0.50
Nodes (3): MaterialReceiptPage(), metadata, MATERIALS_RECEIPTS_TITLE

### Community 78 - "ProductCategory"
Cohesion: 0.67
Nodes (3): ProductCategory, EntryFormGroup, SaleFormGroup

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 393 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `package.json`, `SummaryScreen.tsx`, `PageFrame`, `monthKeyFromDate`, `MaterialsNormsScreen`, `PlanningScreen.tsx`, `isOccurredOn`, `ProductionJournalFactScreen.tsx`, `FinishedProductEditScreen.tsx`, `SaleScreen.tsx`, `DerivativesScreen.tsx`, `InventoryScreen.tsx`, `AppShell.tsx`, `DocumentProvider.tsx`, `DerivativeCreateScreen.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `Icons.tsx`, `materials/paths.ts`, `production/paths.ts`, `production/fact/page.tsx`, `receipts/[id]/page.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._
- **Why does `react` connect `PageFrame` to `ProductionEntryScreen.tsx`, `MaterialsSummaryTable.tsx`, `package.json`, `ProductionFactTable.tsx`, `SummaryScreen.tsx`, `monthKeyFromDate`, `MaterialReceiptFormTable.tsx`, `SummaryTable.tsx`, `PlanningScreen.tsx`, `keepWithNext`, `ProductionJournalFactScreen.tsx`, `FinishedProductEditScreen.tsx`, `DerivativeMovementSummaryTable.tsx`, `SaleScreen.tsx`, `InventoryScreen.tsx`, `AppShell.tsx`, `Cells.tsx`, `next`, `DocumentProvider.tsx`, `DerivativeCreateScreen.tsx`, `MaterialDocumentScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `Icons.tsx`, `RecipePrint.tsx`, `index.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13756613756613756 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `derivative-movement.ts`, `materials.ts`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12222222222222222 - nodes in this community are weakly interconnected._