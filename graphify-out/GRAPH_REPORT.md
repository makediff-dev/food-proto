# Graph Report - food-proto  (2026-10-27)

## Corpus Check
- 192 files · ~112,161 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1795 nodes · 6722 edges · 60 communities (53 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd0f4b54`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- products.ts
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
- DerivativeCreateScreen.tsx
- keepWithNext
- ProductionJournalFactScreen.tsx
- monthKeyFromDate
- MovementPlanScreen.tsx
- document.ts
- materials.ts
- sales-plan.ts
- materials/text.ts
- movement-plan.ts
- sales-fact.ts
- Флоу товара
- ratioRound
- RecipeComponentSearch
- PlanningScreen.tsx
- SummaryTable.tsx
- FinishedGoodsFactScreen.tsx
- recipes/paths.ts
- production-fact.ts
- MaterialsSummaryTable.tsx
- Icons.tsx
- FinishedGoodsMonthTable.tsx
- SaleScreen.tsx
- planMonthOpen
- AppShell.tsx
- Отчет общий сырья
- postcss.config.mjs
- Отчет общий движения
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
- PageFrame
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

## Communities (60 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.09
Nodes (48): Единицы, SalesPlan, factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, priceWithVatFromExVat(), profitabilityHundredths() (+40 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.09
Nodes (44): metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), ProductCategory, ProductionEntryLine, addProductionEntry(), addProductionEntryRejection() (+36 more)

### Community 2 - "products.ts"
Cohesion: 0.07
Nodes (64): commitDocumentUpdate(), useDocumentStore(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory() (+56 more)

### Community 3 - "derivative-movement.ts"
Cohesion: 0.10
Nodes (37): buildRow(), costForQuantity(), derivativeConsumptionPrice(), DerivativeMovementMonthView, DerivativeNormField, derivativeNormMetrics(), DerivativeNormRejection, derivativeNormsList() (+29 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.05
Nodes (47): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+39 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.07
Nodes (59): DerivativeMovementInventoryTable(), WorkshopBlock(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals (+51 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (38): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+30 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.15
Nodes (38): isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), closingNormMetrics(), closingStockPieces(), emptyRangeView() (+30 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+25 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "use-materials.ts"
Cohesion: 0.16
Nodes (27): addMaterial(), deletedMaterials(), deleteMaterial(), deleteMaterialReceipt(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair() (+19 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.19
Nodes (20): activeDerivatives(), addDerivative(), derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById(), isDerivativeUnit() (+12 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeCreateScreen.tsx"
Cohesion: 0.11
Nodes (44): metadata, NewDerivativePage(), isDerivativeWorkshopId(), outputPieceThousandthsOf(), activeMaterials(), gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), formatQuantityDraft() (+36 more)

### Community 14 - "keepWithNext"
Cohesion: 0.10
Nodes (49): ProductionFactGroup, ProductionFactRow, ProductionFactSide, ProductionFactVariance, CategoryBlock(), ColumnHeadings(), ColumnKey, columnsOf() (+41 more)

### Community 15 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.15
Nodes (19): metadata, ProductionFactPage(), recommendedDayKey(), defaultProductionJournalFactDay(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE, productionJournalFactHref(), DayDateControl() (+11 more)

### Community 16 - "monthKeyFromDate"
Cohesion: 0.09
Nodes (45): nextConfig, next, DerivativeMovementInventoryPage(), metadata, DerivativeMovementPage(), metadata, DerivativeMovementPlanPage(), metadata (+37 more)

### Community 17 - "MovementPlanScreen.tsx"
Cohesion: 0.08
Nodes (42): metadata, MovementFactPage(), metadata, MovementInventoryPage(), metadata, MovementPage(), metadata, MovementPlanPage() (+34 more)

### Community 18 - "document.ts"
Cohesion: 0.06
Nodes (45): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+37 more)

### Community 19 - "materials.ts"
Cohesion: 0.11
Nodes (42): costExVat(), addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney(), emptyPlanLine() (+34 more)

### Community 20 - "sales-plan.ts"
Cohesion: 0.21
Nodes (20): SalesPlanLine, activeSalesPlans(), addMissingPlanLines(), addMissingPlanLinesRejection(), addSalesPlan(), createRejection(), defaultSalesPlanLines(), ensureSalesPlan() (+12 more)

### Community 21 - "materials/text.ts"
Cohesion: 0.15
Nodes (15): MaterialsNormsPage(), metadata, NORMED_MATERIAL_GROUP_ID, MaterialDocumentRejection, materialNormQuantity(), MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection (+7 more)

### Community 22 - "movement-plan.ts"
Cohesion: 0.14
Nodes (29): closingInventoryDeviationPieces(), FinishedGoodsOpeningRejection, finishedGoodsOpeningsList(), hasStoredInventoryLine(), isOpeningPieces(), openingDeviationPieces(), setFinishedGoodsOpening(), setFinishedGoodsOpeningRejection() (+21 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.10
Nodes (39): Удаление, unitCost, Product, amountWithVat(), averageAmount(), percentHundredths(), vatPercentHundredths(), dayGridProducts() (+31 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "ratioRound"
Cohesion: 0.15
Nodes (18): Derivative, ratioRound(), MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, derivativeBatchThousandths(), RecipeComponentTarget, requirementFromDerivative(), applyHeatTreatmentYield() (+10 more)

### Community 26 - "RecipeComponentSearch"
Cohesion: 0.33
Nodes (3): buildCandidateGroups(), RecipeComponentSearch(), selectedGroups()

### Community 27 - "PlanningScreen.tsx"
Cohesion: 0.14
Nodes (24): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), missingPlanProducts(), parsePlanningQuery() (+16 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.09
Nodes (46): costWithVat(), SalesPlanRejection, OperatingExpenseRejection, OperatingExpenseSide, Pieces(), RowCell(), headlineKind(), HeadlineRowId (+38 more)

### Community 30 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.12
Nodes (29): isOccurredOn(), defaultSalesFactDay(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), FullscreenToggle(), mondayLeadForMonth(), resolveDay() (+21 more)

### Community 31 - "recipes/paths.ts"
Cohesion: 0.15
Nodes (20): metadata, RecipeFinishedPage(), DerivativePage(), metadata, metadata, RecipeDerivativesPage(), derivativeCompositionLines(), derivativeSections() (+12 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.18
Nodes (26): amountExVat(), actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts() (+18 more)

### Community 34 - "MaterialsSummaryTable.tsx"
Cohesion: 0.07
Nodes (53): DerivativeRow(), DerivativeMovementPlanTable(), DerivativeRow(), RowCell(), WorkshopBlock(), COLUMN_GROUPS, COLUMN_KIND, columnEdgeClass() (+45 more)

### Community 35 - "Icons.tsx"
Cohesion: 0.17
Nodes (19): react, MaterialsPlanPage(), metadata, AddMaterialDialog(), MaterialsPlanScreen(), materialUnitHint(), MaterialsWarehouseBlocks(), MATERIALS_PLAN_TITLE (+11 more)

### Community 36 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.10
Nodes (41): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), MetricCell() (+33 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (80): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+72 more)

### Community 39 - "planMonthOpen"
Cohesion: 0.10
Nodes (36): metadata, ProductionJournalPage(), metadata, ProductionPage(), metadata, ProductionPlanPage(), productionEntryPieces(), workingProductionEntriesInMonth() (+28 more)

### Community 41 - "AppShell.tsx"
Cohesion: 0.07
Nodes (31): metadata, onest, RootLayout(), unbounded, DERIVATIVE_MOVEMENT_INVENTORY_HREF, DERIVATIVE_MOVEMENT_PLAN_HREF, DERIVATIVE_MOVEMENT_SECTION_TITLE, DERIVATIVE_MOVEMENT_SUMMARY_HREF (+23 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

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

### Community 64 - "PageFrame"
Cohesion: 0.11
Nodes (36): Home(), metadata, metadata, PlanPage(), metadata, QuestionsPage(), activeCategories(), recommendedVolumePiecesForMonths() (+28 more)

### Community 65 - "MaterialDocumentScreen.tsx"
Cohesion: 0.15
Nodes (19): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), occurredOnOpen(), maxProductionEntryOccurredOn(), DocumentForm(), changeWarehouse() (+11 more)

### Community 67 - "RecipePrint.tsx"
Cohesion: 0.14
Nodes (27): react-dom, recipeComponentsKilogramThousandths(), formatQuantity(), componentDraftKey(), componentLabel(), CompositionLine(), ItemRow(), RecipeJournalsTable() (+19 more)

### Community 68 - "FinishedProductEditScreen.tsx"
Cohesion: 0.18
Nodes (13): FinishedProductRecipePage(), metadata, DerivativeAddRejection, ProductRecipeLine, ProductRecipeRejection, DerivativeLineDraft, FinishedProductEditScreen(), initialPiecesDraft() (+5 more)

### Community 69 - "index.ts"
Cohesion: 0.08
Nodes (72): DerivativeMovementRow, DerivativeMovementSection, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), COLUMN_KIND, ColumnKey (+64 more)

## Knowledge Gaps
- **8 isolated node(s):** `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 393 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `monthKeyFromDate` to `PageFrame`, `MaterialDocumentScreen.tsx`, `ProductionEntryScreen.tsx`, `Icons.tsx`, `FinishedProductEditScreen.tsx`, `SaleScreen.tsx`, `RecipePrint.tsx`, `planMonthOpen`, `package.json`, `AppShell.tsx`, `DerivativeCreateScreen.tsx`, `ProductionJournalFactScreen.tsx`, `MovementPlanScreen.tsx`, `materials/text.ts`, `PlanningScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `recipes/paths.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0946938775510204 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Icons.tsx` to `ProductionEntryScreen.tsx`, `mock-document.ts`, `MaterialReceiptFormTable.tsx`, `package.json`, `DerivativeCreateScreen.tsx`, `keepWithNext`, `ProductionJournalFactScreen.tsx`, `monthKeyFromDate`, `MovementPlanScreen.tsx`, `PlanningScreen.tsx`, `SummaryTable.tsx`, `FinishedGoodsFactScreen.tsx`, `MaterialsSummaryTable.tsx`, `FinishedGoodsMonthTable.tsx`, `SaleScreen.tsx`, `planMonthOpen`, `AppShell.tsx`, `PageFrame`, `MaterialDocumentScreen.tsx`, `RecipePrint.tsx`, `FinishedProductEditScreen.tsx`, `index.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08784313725490196 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `products.ts`, `derivative-movement.ts`, `materials.ts`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `products.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07080745341614907 - nodes in this community are weakly interconnected._