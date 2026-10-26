# Graph Report - food-proto  (2026-10-26)

## Corpus Check
- 179 files · ~105,183 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1673 nodes · 6231 edges · 69 communities (62 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bc4015a5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- sales-plan.ts
- document.ts
- mock-document.ts
- ProductionEntryFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- MaterialDocumentScreen.tsx
- DerivativeCreateScreen.tsx
- compilerOptions
- FinishedProductEditScreen.tsx
- ProductionFactTable.tsx
- recipe-yield.ts
- SalesFactTable.tsx
- production-journal-fact.ts
- mock-materials.ts
- materials.ts
- MaterialsPlanScreen.tsx
- index.ts
- InventoryScreen.tsx
- sales-fact.ts
- Флоу товара
- MaterialReceiptFormTable.tsx
- use-materials.ts
- movement-plan.ts
- SummaryTable.tsx
- FinishedGoodsMonthScreen.tsx
- FinishedGoodsFactScreen.tsx
- useDocumentStore
- PlanRedirect.tsx
- production-fact.ts
- FinishedGoodsMonthTable.tsx
- MaterialJournalScreen.tsx
- ProductionJournalFactScreen.tsx
- SaleScreen.tsx
- production-plan.ts
- next
- AppShell.tsx
- Отчет общий сырья
- recipes/paths.ts
- postcss.config.mjs
- SummaryHeadlineTable.tsx
- IconFullscreen
- Отчет общий движения
- buildRow
- MaterialsPlanTable.tsx
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
- ratioRound
- averageAmount
- SummaryScreen.tsx
- orderLines
- PageFrame
- MaterialsNormsScreen
- monthKeyFromDate

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 72 edges
2. `PageFrame()` - 63 edges
3. `next` - 62 edges
4. `planMonthOpen()` - 56 edges
5. `keepWithNext()` - 55 edges
6. `react` - 53 edges
7. `VatMoneyCell()` - 46 edges
8. `useDocumentStore()` - 39 edges
9. `shiftMonth()` - 38 edges
10. `IconChevronDown()` - 37 edges

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
- 3-file cycle: `src/domain/finished-goods.ts -> src/domain/production-journal-fact.ts -> src/domain/production-fact.ts -> src/domain/finished-goods.ts`

## Communities (69 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.11
Nodes (41): Единицы, SalesPlan, percentHundredths(), vatPercentHundredths(), salesPlanTotals, actualRangeSummary(), applyFactScale(), applyPlanScale() (+33 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (71): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage(), metadata, ProductionPage() (+63 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.06
Nodes (79): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+71 more)

### Community 3 - "document.ts"
Cohesion: 0.10
Nodes (25): consumptionQuantityForDerivative(), derivativeBatchThousandths(), derivativeMovementMonth(), DerivativeMovementMonthView, DerivativeMovementRow, DerivativeMovementSection, factConsumptionQuantityForDerivative(), factSalesVolumePiecesForProduct() (+17 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.06
Nodes (25): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+17 more)

### Community 5 - "ProductionEntryFormTable.tsx"
Cohesion: 0.07
Nodes (54): columnEdgeClass(), DerivativeMovementSummaryTable(), DerivativeRow(), WorkshopBlock(), GridInput(), editableFieldNear(), ProductRow(), buildGroups() (+46 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (35): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+27 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.17
Nodes (33): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingStockPieces(), emptyRangeView(), emptyTotals() (+25 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "MaterialDocumentScreen.tsx"
Cohesion: 0.17
Nodes (20): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), activeMaterials(), materialReceiptById(), DocumentForm(), changeWarehouse() (+12 more)

### Community 11 - "DerivativeCreateScreen.tsx"
Cohesion: 0.16
Nodes (24): DerivativePage(), metadata, activeDerivatives(), addDerivative(), derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList() (+16 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "FinishedProductEditScreen.tsx"
Cohesion: 0.15
Nodes (36): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantity(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), enableByPiece() (+28 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.16
Nodes (28): Подсказки заголовков таблицы, CategoryBlock(), InventoryTable(), TotalsCell(), CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+20 more)

### Community 15 - "recipe-yield.ts"
Cohesion: 0.24
Nodes (11): MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths() (+3 more)

### Community 16 - "SalesFactTable.tsx"
Cohesion: 0.13
Nodes (24): adjacentDay(), ArrowButton(), DayLabel(), dayOfMonth(), ArrowButton(), CategoryBlock(), DayLabel(), dayOfMonth() (+16 more)

### Community 17 - "production-journal-fact.ts"
Cohesion: 0.16
Nodes (17): Product, productionFactGridProducts(), dayTotals(), ProductionJournalFactDayView, productionJournalFactGridProducts(), ProductionJournalFactGroup, productionJournalFactGroups(), productionJournalFactMonth() (+9 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "materials.ts"
Cohesion: 0.09
Nodes (44): costExVat(), MaterialOpeningLine, MaterialReceiptLine, NORMED_MATERIAL_GROUP_ID, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity() (+36 more)

### Community 20 - "MaterialsPlanScreen.tsx"
Cohesion: 0.10
Nodes (24): MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialWeightPair, deletedMaterials(), MaterialDocumentRejection, MaterialGroupMovement, MaterialNormRejection (+16 more)

### Community 21 - "index.ts"
Cohesion: 0.10
Nodes (55): react, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMN_GROUPS, ColumnKey, COLUMNS, GROUP_END_KEYS (+47 more)

### Community 22 - "InventoryScreen.tsx"
Cohesion: 0.18
Nodes (14): metadata, MovementFactPage(), metadata, MovementInventoryPage(), InventoryScreen(), resolveMonth(), Workspace(), open() (+6 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.16
Nodes (21): Удаление, unitCost, PrototypeDocument, amountExVat(), dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds() (+13 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.21
Nodes (14): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GroupBlock() (+6 more)

### Community 26 - "use-materials.ts"
Cohesion: 0.20
Nodes (25): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+17 more)

### Community 27 - "movement-plan.ts"
Cohesion: 0.17
Nodes (22): FinishedGoodsOpeningRejection, isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), emptyNormLine(), emptyTotals(), FinishedGoodsNormField, FinishedGoodsNormRejection (+14 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.11
Nodes (51): RowCell(), TotalCell(), RowCell(), RowCell(), TotalCell(), Pieces(), RowCell(), TotalCell() (+43 more)

### Community 29 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.26
Nodes (13): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+5 more)

### Community 30 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.14
Nodes (25): isOccurredOn(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay() (+17 more)

### Community 31 - "useDocumentStore"
Cohesion: 0.14
Nodes (18): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), useDocumentStore(), DerivativeAddRejection, ProductRecipeLine, productCompositionLines() (+10 more)

### Community 32 - "PlanRedirect.tsx"
Cohesion: 0.29
Nodes (9): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref(), PlanRedirect() (+1 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (31): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+23 more)

### Community 34 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.12
Nodes (29): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell(), ProductRow() (+21 more)

### Community 35 - "MaterialJournalScreen.tsx"
Cohesion: 0.11
Nodes (30): MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptsPage(), metadata (+22 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.21
Nodes (13): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), ProductionJournalFactView, DayDateControl(), onKeyDown(), mondayLeadForMonth(), productionJournalFactPageTitle() (+5 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.07
Nodes (71): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), SaleLine, productAllowedInPeriodSale() (+63 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.15
Nodes (27): commitDocumentUpdate(), ProductionPlan, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+19 more)

### Community 40 - "next"
Cohesion: 0.19
Nodes (12): nextConfig, next, metadata, MovementPlanPage(), MovementPlanScreen(), resolveMonth(), Workspace(), open() (+4 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.05
Nodes (55): DerivativeMovementPage(), metadata, metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY (+47 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "recipes/paths.ts"
Cohesion: 0.20
Nodes (15): metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), derivativeCompositionLines(), derivativeSections(), isDerivativeWorkshopId(), outputPieceThousandthsOf() (+7 more)

### Community 45 - "SummaryHeadlineTable.tsx"
Cohesion: 0.24
Nodes (12): OperatingExpenseSide, SummaryLens, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable(), ROWS (+4 more)

### Community 46 - "IconFullscreen"
Cohesion: 0.27
Nodes (13): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+5 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "buildRow"
Cohesion: 0.31
Nodes (9): closingInventoryDeviationPieces(), finishedGoodsOpeningsList(), hasStoredInventoryLine(), openingDeviationPieces(), openingReferencedProductIds(), storedInventoryPiecesForProduct(), workingFinishedGoodsOpening(), buildRow() (+1 more)

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.09
Nodes (38): costWithVat(), MaterialMovementRow, MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS (+30 more)

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

### Community 62 - "ratioRound"
Cohesion: 0.33
Nodes (9): ratioRound(), productSide(), priceExVatTenThousandths(), profitabilityHundredths(), revenueExVat(), revenueWithVat(), salesPlanLineMetrics, planSide() (+1 more)

### Community 63 - "averageAmount"
Cohesion: 0.50
Nodes (5): closingNormMetrics(), priceAverage(), rowFromParts(), averageAmount(), productionPlanTotals

### Community 64 - "SummaryScreen.tsx"
Cohesion: 0.17
Nodes (27): activeCategories(), SalesPlanRejection, ensureRangeIncludesMonth(), lastHorizonMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection (+19 more)

### Community 65 - "orderLines"
Cohesion: 0.67
Nodes (3): orderLines(), productionFromOrders(), salesFromOrders()

### Community 66 - "PageFrame"
Cohesion: 0.24
Nodes (8): metadata, QuestionsPage(), ProductionPlaceholderScreen(), RecipeJournalsScreen(), RecipeJournalsTable(), RecipeListSection, useNameColumnWidth(), PageFrame()

### Community 68 - "MaterialsNormsScreen"
Cohesion: 0.40
Nodes (5): MaterialsNormsPage(), metadata, materialNormQuantity(), MaterialsNormsScreen(), MATERIALS_NORMS_TITLE

### Community 73 - "monthKeyFromDate"
Cohesion: 0.17
Nodes (17): metadata, ProductionFactPage(), metadata, SalesFactPage(), monthKeyFromDate(), planMonthOpen(), resolveMonth(), resolveMonth() (+9 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 366 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `index.ts` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `ProductionEntryFormTable.tsx`, `package.json`, `MaterialDocumentScreen.tsx`, `DerivativeCreateScreen.tsx`, `FinishedProductEditScreen.tsx`, `ProductionFactTable.tsx`, `SalesFactTable.tsx`, `MaterialsPlanScreen.tsx`, `InventoryScreen.tsx`, `MaterialReceiptFormTable.tsx`, `SummaryTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `PlanRedirect.tsx`, `FinishedGoodsMonthTable.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `next`, `AppShell.tsx`, `MaterialsPlanTable.tsx`, `SummaryScreen.tsx`, `PageFrame`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11406423034330011 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `ProductionEntryFormTable.tsx`, `package.json`, `MaterialDocumentScreen.tsx`, `DerivativeCreateScreen.tsx`, `FinishedProductEditScreen.tsx`, `MaterialsPlanScreen.tsx`, `InventoryScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `useDocumentStore`, `PlanRedirect.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `AppShell.tsx`, `recipes/paths.ts`, `SummaryScreen.tsx`, `PageFrame`, `MaterialsNormsScreen`, `monthKeyFromDate`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05307797537619699 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `production-plan.ts`, `Ввод плана (производство)`, `averageAmount`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06017478152309613 - nodes in this community are weakly interconnected._