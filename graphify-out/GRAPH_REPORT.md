# Graph Report - food-proto  (2026-10-26)

## Corpus Check
- 192 files · ~111,543 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1783 nodes · 6700 edges · 68 communities (61 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `960d4b9c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- sales-plan.ts
- derivative-movement.ts
- mock-document.ts
- MaterialReceiptFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- use-materials.ts
- derivatives.ts
- compilerOptions
- DerivativeForm
- keepWithNext
- ProductionJournalFactScreen.tsx
- monthKeyFromDate
- MovementPlanScreen.tsx
- document.ts
- materials.ts
- FinishedGoodsMonthTable.tsx
- DerivativeMovementSummaryTable.tsx
- movement-plan.ts
- sales-fact.ts
- Флоу товара
- DerivativeFormTable.tsx
- MaterialJournalScreen.tsx
- DerivativeCreateScreen.tsx
- SummaryTable.tsx
- next
- SalesFactScreen.tsx
- useDocumentStore
- daysInMonth
- production-fact.ts
- MaterialsSummaryTable.tsx
- MaterialsPlanScreen.tsx
- MovementPlanTable.tsx
- SaleScreen.tsx
- production-plan.ts
- FinishedGoodsFactScreen.tsx
- AppShell.tsx
- Отчет общий сырья
- ProductionEntryFormTable.tsx
- postcss.config.mjs
- FinishedGoodsMonthScreen.tsx
- PlanRedirect.tsx
- Отчет общий движения
- Icons.tsx
- PageFrame
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
- Отчет общий движения производных
- planMonthOpen
- MaterialDocumentScreen.tsx
- RecipePrint.tsx
- FinishedProductEditScreen.tsx
- index.ts

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 76 edges
2. `PageFrame()` - 67 edges
3. `next` - 66 edges
4. `planMonthOpen()` - 59 edges
5. `keepWithNext()` - 59 edges
6. `react` - 58 edges
7. `VatMoneyCell()` - 49 edges
8. `IconChevronDown()` - 43 edges
9. `IconChevronRight()` - 42 edges
10. `useDocumentStore()` - 41 edges

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

## Communities (68 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.12
Nodes (33): Единицы, unitCost, SalesPlan, ProductionJournalFactRow, SalesFactRow, salesPlanLineMetrics, actualRangeSummary(), calendarDays() (+25 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.05
Nodes (72): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+64 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.05
Nodes (90): metadata, PlanningArchivePage(), metadata, PlanningPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+82 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.12
Nodes (35): buildRow(), costForQuantity(), derivativeConsumptionPrice(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList() (+27 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (47): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+39 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.08
Nodes (39): react, buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks() (+31 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (38): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+30 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.13
Nodes (41): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingInventoryDeviationPieces(), closingNormMetrics(), closingStockPieces() (+33 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.20
Nodes (24): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice(), isVatPercent() (+16 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.12
Nodes (31): activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), isDerivativeUnit() (+23 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.19
Nodes (27): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), enableByPiece(), onGramsChange() (+19 more)

### Community 14 - "keepWithNext"
Cohesion: 0.15
Nodes (34): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, RowCell(), TotalsCell(), CategoryBlock(), ColumnHeadings() (+26 more)

### Community 15 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.11
Nodes (29): Удаление, dayGridProducts(), productionFactGridProducts(), dayTotals(), defaultProductionJournalFactDay(), ProductionJournalFactDayView, productionJournalFactGridProducts(), ProductionJournalFactGroup (+21 more)

### Community 16 - "monthKeyFromDate"
Cohesion: 0.16
Nodes (19): DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata, derivativeMovementMonth(), monthKeyFromDate(), DerivativeMovementPlanScreen(), derivativeNormRangeInvalid() (+11 more)

### Community 17 - "MovementPlanScreen.tsx"
Cohesion: 0.10
Nodes (30): metadata, MovementInventoryPage(), metadata, MovementPlanPage(), FullscreenToggle(), FullscreenToggle(), InventoryScreen(), resolveMonth() (+22 more)

### Community 18 - "document.ts"
Cohesion: 0.07
Nodes (40): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+32 more)

### Community 19 - "materials.ts"
Cohesion: 0.08
Nodes (48): costExVat(), MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity() (+40 more)

### Community 20 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.13
Nodes (22): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, DerivativeMovementInventoryTable(), WorkshopBlock(), DerivativeMovementPlanTable(), WorkshopBlock(), DerivativeMovementSummaryTable() (+14 more)

### Community 21 - "DerivativeMovementSummaryTable.tsx"
Cohesion: 0.10
Nodes (55): costWithVat(), DerivativeMovementRow, DerivativeMovementSection, DerivativeRow(), COLUMN_KIND, ColumnKey, COLUMNS, DerivativeRow() (+47 more)

### Community 22 - "movement-plan.ts"
Cohesion: 0.14
Nodes (29): FinishedGoodsOpeningRejection, hasStoredInventoryLine(), isOpeningPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection(), storedInventoryPiecesForProduct(), buildRow(), emptyNormLine() (+21 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.17
Nodes (22): amountExVat(), amountWithVat(), averageAmount(), percentHundredths(), ratioRound(), vatPercentHundredths(), dayTotals(), productById() (+14 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "DerivativeFormTable.tsx"
Cohesion: 0.13
Nodes (19): DeletableRecord, Derivative, Material, MATERIAL_GROUPS, Product, EntryFormRow, EntryFormRow, buildGroups() (+11 more)

### Community 26 - "MaterialJournalScreen.tsx"
Cohesion: 0.29
Nodes (10): MaterialReceiptsPage(), metadata, materialReceiptsInMonth(), MaterialJournalScreen(), MaterialMonthBar(), resolveMaterialMonth(), materialReceiptHref(), materialReceiptNewHref() (+2 more)

### Community 27 - "DerivativeCreateScreen.tsx"
Cohesion: 0.16
Nodes (14): DerivativePage(), metadata, metadata, NewDerivativePage(), DERIVATIVE_WORKSHOPS, DerivativeCreateScreen(), DerivativeEditScreen(), draftsFromLines() (+6 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.09
Nodes (46): CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, DayLabel(), dayOfMonth(), Pieces(), ProductName() (+38 more)

### Community 29 - "next"
Cohesion: 0.19
Nodes (10): nextConfig, next, DerivativeMovementInventoryPage(), metadata, MaterialReceiptPage(), metadata, DerivativeMovementInventoryScreen(), DERIVATIVE_MOVEMENT_INVENTORY_TITLE (+2 more)

### Community 30 - "SalesFactScreen.tsx"
Cohesion: 0.18
Nodes (17): metadata, SalesFactPage(), isOccurredOn(), defaultSalesFactDay(), parseSalesFactQuery(), SALES_FACT_TITLE, salesFactHref(), DayDateControl() (+9 more)

### Community 31 - "useDocumentStore"
Cohesion: 0.15
Nodes (22): metadata, RecipeFinishedPage(), metadata, RecipeDerivativesPage(), useDocumentStore(), derivativeCompositionLines(), derivativeSections(), isDerivativeWorkshopId() (+14 more)

### Community 32 - "daysInMonth"
Cohesion: 0.23
Nodes (15): factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, applyPlanScale(), applySummaryLens(), displayedOperatingExpense(), elapsedDaysInMonth() (+7 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.18
Nodes (25): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+17 more)

### Community 34 - "MaterialsSummaryTable.tsx"
Cohesion: 0.10
Nodes (28): Подсказки заголовков таблицы, MaterialMovementTotals, buildSections(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, GROUP_END_KEYS (+20 more)

### Community 35 - "MaterialsPlanScreen.tsx"
Cohesion: 0.11
Nodes (27): MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+19 more)

### Community 36 - "MovementPlanTable.tsx"
Cohesion: 0.16
Nodes (23): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, CategoryBlock(), InventoryTable(), RowCell(), TotalsCell(), CategoryBlock() (+15 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (72): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), SaleLine, addSale() (+64 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.10
Nodes (37): metadata, ProductionPlanPage(), commitDocumentUpdate(), ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection() (+29 more)

### Community 40 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.18
Nodes (16): metadata, MovementFactPage(), monthDates(), DayDateControl(), onKeyDown(), FinishedGoodsFactScreen(), mondayLeadForMonth(), resolveDay() (+8 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.10
Nodes (24): metadata, onest, RootLayout(), unbounded, MOVEMENT_SECTION_TITLE, RECIPES_SECTION_TITLE, SALES_SECTION_TITLE, AppShell() (+16 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "ProductionEntryFormTable.tsx"
Cohesion: 0.25
Nodes (13): buildGroups(), CategoryBlock(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormTotals, formatKopecks(), GridInput() (+5 more)

### Community 45 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.29
Nodes (12): metadata, MovementPage(), clampSummaryMonth(), lastSummaryMonth(), resolveSummaryMonthRange(), FinishedGoodsMonthScreen(), FullscreenToggle(), Workspace() (+4 more)

### Community 46 - "PlanRedirect.tsx"
Cohesion: 0.32
Nodes (8): Home(), metadata, metadata, PlanPage(), parseSummaryQuery(), SUMMARY_SECTION_TITLE, summaryHref(), PlanRedirect()

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "Icons.tsx"
Cohesion: 0.32
Nodes (9): Glyph(), IconChevronLeft(), IconClose(), IconEye(), IconList(), IconMenu(), IconTrash(), IconUndo() (+1 more)

### Community 49 - "PageFrame"
Cohesion: 0.39
Nodes (4): metadata, QuestionsPage(), ProductionPlaceholderScreen(), PageFrame()

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

### Community 63 - "Отчет общий движения производных"
Cohesion: 0.15
Nodes (10): Инвентаризация производных, Колонки, Что пишется, Ввод плана движения производных, Колонки, Что пишется, Остаток на конец, Остаток на начало (+2 more)

### Community 64 - "planMonthOpen"
Cohesion: 0.21
Nodes (24): activeCategories(), planMonthOpen(), ensureRangeIncludesMonth(), lastHorizonMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), SummaryLens (+16 more)

### Community 65 - "MaterialDocumentScreen.tsx"
Cohesion: 0.11
Nodes (26): metadata, NewMaterialReceiptPage(), MATERIAL_WAREHOUSES, activeMaterials(), MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection (+18 more)

### Community 67 - "RecipePrint.tsx"
Cohesion: 0.14
Nodes (27): react-dom, derivativeWorkshopById(), warehouseIdForWorkshop(), formatQuantity(), componentDraftKey(), componentLabel(), CompositionLine(), ItemRow() (+19 more)

### Community 68 - "FinishedProductEditScreen.tsx"
Cohesion: 0.17
Nodes (16): FinishedProductRecipePage(), metadata, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, updateProductRecipe(), FinishedProductEditScreen(), initialGramsDraft() (+8 more)

### Community 69 - "index.ts"
Cohesion: 0.09
Nodes (48): adjacentDay(), ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey, COLUMNS, DayLabel() (+40 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 386 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `package.json`, `ProductionJournalFactScreen.tsx`, `monthKeyFromDate`, `MovementPlanScreen.tsx`, `MaterialJournalScreen.tsx`, `DerivativeCreateScreen.tsx`, `SalesFactScreen.tsx`, `useDocumentStore`, `MaterialsPlanScreen.tsx`, `SaleScreen.tsx`, `production-plan.ts`, `FinishedGoodsFactScreen.tsx`, `AppShell.tsx`, `FinishedGoodsMonthScreen.tsx`, `PlanRedirect.tsx`, `PageFrame`, `planMonthOpen`, `MaterialDocumentScreen.tsx`, `RecipePrint.tsx`, `FinishedProductEditScreen.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1226890756302521 - nodes in this community are weakly interconnected._
- **Why does `react` connect `MaterialReceiptFormTable.tsx` to `ProductionEntryScreen.tsx`, `sales-plan.ts`, `mock-document.ts`, `package.json`, `keepWithNext`, `ProductionJournalFactScreen.tsx`, `monthKeyFromDate`, `MovementPlanScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `DerivativeMovementSummaryTable.tsx`, `DerivativeFormTable.tsx`, `MaterialJournalScreen.tsx`, `DerivativeCreateScreen.tsx`, `SummaryTable.tsx`, `next`, `SalesFactScreen.tsx`, `MaterialsSummaryTable.tsx`, `MaterialsPlanScreen.tsx`, `MovementPlanTable.tsx`, `SaleScreen.tsx`, `production-plan.ts`, `FinishedGoodsFactScreen.tsx`, `AppShell.tsx`, `ProductionEntryFormTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `PlanRedirect.tsx`, `Icons.tsx`, `PageFrame`, `planMonthOpen`, `MaterialDocumentScreen.tsx`, `RecipePrint.tsx`, `FinishedProductEditScreen.tsx`, `index.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.054061624649859946 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `derivative-movement.ts`, `production-plan.ts`, `materials.ts`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0526111434672879 - nodes in this community are weakly interconnected._