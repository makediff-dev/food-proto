# Graph Report - food-proto  (2026-10-27)

## Corpus Check
- 192 files · ~112,712 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1800 nodes · 6745 edges · 71 communities (64 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b63d912e`
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
- materials.ts
- derivatives.ts
- compilerOptions
- DerivativeCreateScreen.tsx
- keepWithNext
- sales-plan.ts
- DerivativeMovementInventoryScreen.tsx
- monthKeyFromDate
- mock-materials.ts
- movementRow
- MaterialReceiptFormTable.tsx
- MaterialsNormsScreen.tsx
- production-plan.ts
- sales-fact.ts
- Флоу товара
- ratioRound
- Icons.tsx
- PageFrame
- SummaryTable.tsx
- ProductionJournalFactScreen.tsx
- FinishedGoodsFactScreen.tsx
- DerivativesScreen.tsx
- movement-plan.ts
- production-fact.ts
- index.ts
- MaterialsPlanScreen.tsx
- FinishedGoodsMonthTable.tsx
- SaleScreen.tsx
- formatQuantity
- movement/paths.ts
- AppShell.tsx
- Отчет общий сырья
- document.ts
- postcss.config.mjs
- production-journal-fact.ts
- FinishedGoodsMonthScreen.tsx
- Отчет общий движения
- DocumentProvider.tsx
- RecipeComponentSearch
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
- sales/text.ts
- Отчет общий движения производных
- SummaryScreen.tsx
- MaterialDocumentScreen.tsx
- useDocumentStore
- RecipePrint.tsx
- SalesFactTable.tsx
- next
- migrate-document.ts

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

## Communities (71 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.09
Nodes (48): Единицы, SalesPlan, factVolumeScale(), planVolumeScale(), daysInMonth(), PLAN_HORIZON_MONTHS, planPhase, priceWithVatFromExVat() (+40 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (69): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+61 more)

### Community 2 - "products.ts"
Cohesion: 0.12
Nodes (40): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+32 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.14
Nodes (29): buildRow(), derivativeConsumptionPrice(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList(), DerivativeOpeningRejection (+21 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialsSummaryTable.tsx"
Cohesion: 0.09
Nodes (40): DerivativeRow(), derivativeNormRangeInvalid(), DerivativeRow(), RowCell(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass(), ColumnKey (+32 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (38): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+30 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.12
Nodes (42): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyRangeView() (+34 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "materials.ts"
Cohesion: 0.12
Nodes (45): MaterialGroupId, MaterialReceiptLine, addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), emptyPlanLine(), hasStoredMaterialInventoryLine() (+37 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.19
Nodes (21): activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById() (+13 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.12
Nodes (46): activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), addComponent(), enableByPiece() (+38 more)

### Community 14 - "keepWithNext"
Cohesion: 0.11
Nodes (37): DerivativeMovementPlanTable(), FINISHED_GOODS_CLOSING_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders(), ReportSubBannerGroup (+29 more)

### Community 15 - "sales-plan.ts"
Cohesion: 0.23
Nodes (18): activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), isPrice(), isVolume() (+10 more)

### Community 16 - "DerivativeMovementInventoryScreen.tsx"
Cohesion: 0.15
Nodes (16): DerivativeMovementInventoryPage(), metadata, DerivativeMovementPlanPage(), metadata, DerivativeMovementInventoryScreen(), DerivativeMovementPlanScreen(), DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+8 more)

### Community 17 - "monthKeyFromDate"
Cohesion: 0.14
Nodes (30): activeCategories(), missingProductionPlanProducts(), activeProducts(), maxSaleOccurredOn(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth() (+22 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.11
Nodes (24): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+16 more)

### Community 19 - "movementRow"
Cohesion: 0.16
Nodes (22): addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyTotals(), gridMaterials() (+14 more)

### Community 20 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (62): buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput() (+54 more)

### Community 21 - "MaterialsNormsScreen.tsx"
Cohesion: 0.31
Nodes (8): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, materialNormQuantity(), MaterialsNormsScreen(), NormCell(), MATERIALS_NORMS_TITLE, MATERIAL_NORM_ERROR

### Community 22 - "production-plan.ts"
Cohesion: 0.14
Nodes (26): commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection() (+18 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.16
Nodes (24): costExVat(), costWithVat(), unitCost, PrototypeDocument, amountExVat(), amountWithVat(), averageAmount(), percentHundredths() (+16 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ratioRound"
Cohesion: 0.15
Nodes (23): costForQuantity(), derivativePriceInternal(), outputPieceThousandthsOf(), ratioRound(), isQuantityThousandths(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, consumptionQuantityForComponent() (+15 more)

### Community 26 - "Icons.tsx"
Cohesion: 0.12
Nodes (30): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, DerivativeMovementInventoryTable(), WorkshopBlock(), WorkshopBlock(), GroupBlock(), CategoryBlock() (+22 more)

### Community 27 - "PageFrame"
Cohesion: 0.12
Nodes (23): metadata, PlanningArchivePage(), metadata, PlanningPage(), metadata, QuestionsPage(), deletedCategories(), deletedProducts() (+15 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.15
Nodes (19): react, CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), PLAN_ASSIGNED, planColumnKind(), ProductRow() (+11 more)

### Community 29 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.13
Nodes (26): defaultProductionJournalFactDay(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), productionJournalFactHref(), FullscreenToggle(), DayDateControl() (+18 more)

### Community 30 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.12
Nodes (29): isOccurredOn(), defaultProductionEntryDay(), defaultSaleDay(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth() (+21 more)

### Community 31 - "DerivativesScreen.tsx"
Cohesion: 0.13
Nodes (21): DerivativePage(), metadata, metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), deleteDerivative(), derivativeCompositionLines() (+13 more)

### Community 32 - "movement-plan.ts"
Cohesion: 0.16
Nodes (26): closingInventoryDeviationPieces(), hasStoredInventoryLine(), openingDeviationPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), storedInventoryPiecesForProduct(), buildRow(), emptyNormLine() (+18 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (29): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+21 more)

### Community 34 - "index.ts"
Cohesion: 0.11
Nodes (50): DerivativeMovementRow, DerivativeMovementSection, MaterialMovementTotals, COLUMN_KIND, ColumnKey, COLUMNS, COLUMNS, ColumnKey (+42 more)

### Community 35 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (20): MATERIAL_GROUPS, MATERIAL_UNITS, MaterialUnit, MaterialWarehouseId, MaterialWeightPair, MaterialDocumentRejection, MaterialMovementRow, MaterialNormRejection (+12 more)

### Community 36 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.14
Nodes (31): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell() (+23 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (78): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+70 more)

### Community 39 - "formatQuantity"
Cohesion: 0.13
Nodes (19): FinishedProductRecipePage(), metadata, metadata, RecipeFinishedPage(), ProductRecipeLine, productCompositionLines(), ProductRecipeRejection, productRecipeSections() (+11 more)

### Community 40 - "movement/paths.ts"
Cohesion: 0.17
Nodes (14): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FinishedGoodsFactView, MOVEMENT_FACT_TITLE (+6 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.11
Nodes (22): MATERIALS_SECTION_TITLE, RECIPES_DERIVATIVES_HREF, RECIPES_FINISHED_HREF, SALES_SECTION_TITLE, AppShell(), currentNavLabel(), DERIVATIVE_MOVEMENT_NAV, MATERIALS_NAV (+14 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "document.ts"
Cohesion: 0.10
Nodes (21): catalogCategories(), DeletableRecord, DERIVATIVE_UNITS, DerivativeNorm, DerivativeNormLine, DerivativeOpening, DerivativeOpeningLine, FinishedGoodsNorm (+13 more)

### Community 45 - "production-journal-fact.ts"
Cohesion: 0.17
Nodes (19): Удаление, Product, dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds(), productionFactGridProducts(), dayTotals() (+11 more)

### Community 46 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "DocumentProvider.tsx"
Cohesion: 0.16
Nodes (16): metadata, onest, RootLayout(), unbounded, clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument() (+8 more)

### Community 49 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

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

### Community 62 - "sales/text.ts"
Cohesion: 0.16
Nodes (16): SalesPlanRejection, OperatingExpenseRejection, OperatingExpenseSide, headlineKind(), HeadlineRowId, HeadlineValue(), IndicatorHead(), PlanHeadlineTable() (+8 more)

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.15
Nodes (10): Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется, Остаток на конец, Остаток на начало (+2 more)

### Community 64 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (30): Home(), metadata, metadata, PlanPage(), ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange() (+22 more)

### Community 65 - "MaterialDocumentScreen.tsx"
Cohesion: 0.13
Nodes (22): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, isPrice(), materialReceiptById(), materialReceiptRejection() (+14 more)

### Community 66 - "useDocumentStore"
Cohesion: 0.29
Nodes (10): DerivativeMovementPage(), metadata, useDocumentStore(), derivativeMovementMonth(), sumMoney(), DerivativeMovementSummaryScreen(), DerivativeMovementSummaryTable(), DERIVATIVE_MOVEMENT_SUMMARY_TITLE (+2 more)

### Community 67 - "RecipePrint.tsx"
Cohesion: 0.15
Nodes (20): Derivative, componentLabel(), CompositionLine(), DeleteAction(), ItemRow(), RecipeJournalsTable(), RecipeListComponent, RecipeListItem (+12 more)

### Community 69 - "SalesFactTable.tsx"
Cohesion: 0.10
Nodes (32): adjacentDay(), ArrowButton(), DayLabel(), dayOfMonth(), ArrowButton(), CategoryBlock(), COLUMN_KIND, ColumnKey (+24 more)

### Community 70 - "next"
Cohesion: 0.10
Nodes (33): nextConfig, next, MaterialsInventoryPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+25 more)

### Community 72 - "migrate-document.ts"
Cohesion: 0.40
Nodes (5): LEGACY_OPENING_SCHEMA, migrateDocument(), normalizeMaterialUnits(), FinishedGoodsOpening, SCHEMA_VERSION

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `derivative-movement.ts`, `package.json`, `DerivativeCreateScreen.tsx`, `DerivativeMovementInventoryScreen.tsx`, `monthKeyFromDate`, `MaterialsNormsScreen.tsx`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `DerivativesScreen.tsx`, `MaterialsPlanScreen.tsx`, `SaleScreen.tsx`, `formatQuantity`, `movement/paths.ts`, `AppShell.tsx`, `FinishedGoodsMonthScreen.tsx`, `DocumentProvider.tsx`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `useDocumentStore`, `RecipePrint.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09387755102040816 - nodes in this community are weakly interconnected._
- **Why does `react` connect `SummaryTable.tsx` to `ProductionEntryScreen.tsx`, `derivative-movement.ts`, `MaterialsSummaryTable.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `keepWithNext`, `DerivativeMovementInventoryScreen.tsx`, `monthKeyFromDate`, `MaterialReceiptFormTable.tsx`, `Icons.tsx`, `PageFrame`, `ProductionJournalFactScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `index.ts`, `MaterialsPlanScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `SaleScreen.tsx`, `AppShell.tsx`, `FinishedGoodsMonthScreen.tsx`, `DocumentProvider.tsx`, `SummaryScreen.tsx`, `MaterialDocumentScreen.tsx`, `useDocumentStore`, `RecipePrint.tsx`, `SalesFactTable.tsx`, `next`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05540499849442939 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `derivative-movement.ts`, `materials.ts`, `movementRow`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12156448202959831 - nodes in this community are weakly interconnected._