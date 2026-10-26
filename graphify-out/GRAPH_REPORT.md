# Graph Report - food-proto  (2026-10-26)

## Corpus Check
- 174 files · ~103,813 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1641 nodes · 6094 edges · 66 communities (59 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf761aed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryScreen.tsx
- sales-plan.ts
- AppShell.tsx
- mock-document.ts
- MaterialReceiptFormTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- MaterialDocumentScreen.tsx
- derivatives.ts
- compilerOptions
- DerivativeForm
- ProductionFactTable.tsx
- recipe-yield.ts
- InventoryScreen.tsx
- production/paths.ts
- mock-materials.ts
- materials.ts
- MaterialsPlanScreen.tsx
- index.ts
- FinishedGoodsFactScreen.tsx
- sales-fact.ts
- Флоу товара
- revenueExVat
- use-materials.ts
- production-journal-fact.ts
- SummaryTable.tsx
- FinishedGoodsMonthScreen.tsx
- production/fact/page.tsx
- RecipeJournalsTable.tsx
- document.ts
- production-fact.ts
- ColumnLabel
- MaterialJournalScreen.tsx
- ProductionJournalFactScreen.tsx
- SaleScreen.tsx
- production-plan.ts
- monthKeyFromDate
- DocumentProvider.tsx
- Отчет общий сырья
- DerivativeCreateScreen.tsx
- postcss.config.mjs
- FinishedGoodsMonthTable.tsx
- Отчет общий движения
- FinishedProductEditScreen.tsx
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
- production-journal.ts
- production/plan/page.tsx
- SummaryScreen.tsx
- PageFrame
- PlanningScreen.tsx

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `PageFrame()` - 61 edges
3. `next` - 60 edges
4. `planMonthOpen()` - 56 edges
5. `keepWithNext()` - 53 edges
6. `react` - 51 edges
7. `VatMoneyCell()` - 46 edges
8. `shiftMonth()` - 38 edges
9. `useDocumentStore()` - 37 edges
10. `TableNumber()` - 36 edges

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

## Communities (66 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.10
Nodes (46): Единицы, SalesPlan, factVolumeScale(), planVolumeScale(), daysInMonth(), planPhase, priceWithVatFromExVat(), salesPlanTotals (+38 more)

### Community 1 - "ProductionEntryScreen.tsx"
Cohesion: 0.12
Nodes (25): ProductionEntryPage(), metadata, NewProductionEntryPage(), defaultProductionEntryDay(), ProductionEntryRejection, productionLineAmountExVat(), productionLineAmountWithVat(), NEW_PRODUCTION_ENTRY_TITLE (+17 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.09
Nodes (56): addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory(), renameCategory(), restoreCategory(), nameKey(), NameRejection (+48 more)

### Community 3 - "AppShell.tsx"
Cohesion: 0.11
Nodes (21): metadata, onest, RootLayout(), unbounded, PRODUCTION_SECTION_TITLE, SALES_SECTION_TITLE, AppShell(), currentNavLabel() (+13 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (24): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+16 more)

### Community 5 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.06
Nodes (69): COLUMN_KIND, ColumnKey, COLUMNS, EntryFormGroup, EntryFormTotals, formatKopecks(), GridInput(), GroupBlock() (+61 more)

### Community 6 - "Предметная область"
Cohesion: 0.05
Nodes (35): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Архитектура прототипа, Поток данных, Слои, Чего не делать, Блоки (+27 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.08
Nodes (71): FinishedGoodsNormLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct(), buildGroups(), clampSummaryMonth(), closingInventoryDeviationPieces() (+63 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "MaterialDocumentScreen.tsx"
Cohesion: 0.15
Nodes (22): MaterialReceiptPage(), metadata, metadata, NewMaterialReceiptPage(), activeMaterials(), materialReceiptById(), maxProductionEntryOccurredOn(), DocumentForm() (+14 more)

### Community 11 - "derivatives.ts"
Cohesion: 0.20
Nodes (20): activeDerivatives(), addDerivative(), DerivativeAddRejection, derivativeByIdOrNull(), DerivativeCompositionLineView, derivativeNameRejection, derivativesList(), derivativeWorkshopById() (+12 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "DerivativeForm"
Cohesion: 0.17
Nodes (28): gramsPerPieceThousandths(), outputKilogramThousandthsFromPiecesAndGrams(), quantityForAmount(), commit(), formatQuantityDraft(), parseQuantityInput(), DerivativeForm(), enableByPiece() (+20 more)

### Community 14 - "ProductionFactTable.tsx"
Cohesion: 0.10
Nodes (59): MetricCell(), RowCell(), TotalsCell(), RowCell(), RowCell(), NormDeviationCell(), CategoryBlock(), ColumnHeadings() (+51 more)

### Community 15 - "recipe-yield.ts"
Cohesion: 0.24
Nodes (11): MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, applyHeatTreatmentYield(), isRecipeOutputKilogramThousandths(), materialQuantityToKilogramThousandths(), RECIPE_YIELD_TOLERANCE_THOUSANDTHS, recipeComponentsKilogramThousandths(), recipeLineKilogramThousandths() (+3 more)

### Community 16 - "InventoryScreen.tsx"
Cohesion: 0.18
Nodes (16): metadata, MovementInventoryPage(), FullscreenToggle(), FullscreenToggle(), InventoryScreen(), Workspace(), open(), MOVEMENT_INVENTORY_TITLE (+8 more)

### Community 17 - "production/paths.ts"
Cohesion: 0.13
Nodes (20): metadata, metadata, ProductionJournalPage(), metadata, ProductionPage(), productionEntryPieces(), workingProductionEntriesInMonth(), parseProductionFactQuery() (+12 more)

### Community 18 - "mock-materials.ts"
Cohesion: 0.12
Nodes (22): defaultMax(), KG_PER_50_M, LineOverride, materialId(), materialNorms, materialOpening(), materialPlan(), materials (+14 more)

### Community 19 - "materials.ts"
Cohesion: 0.10
Nodes (42): MaterialGroupId, MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deviationCostMoney() (+34 more)

### Community 20 - "MaterialsPlanScreen.tsx"
Cohesion: 0.13
Nodes (19): MATERIAL_GROUPS, MATERIAL_UNITS, MATERIAL_WAREHOUSES, MaterialUnit, MaterialWeightPair, deletedMaterials(), MaterialDocumentRejection, MaterialMovementRow (+11 more)

### Community 21 - "index.ts"
Cohesion: 0.09
Nodes (64): MovementPlanGroup, MovementPlanRow, MovementPlanTotals, adjacentDay(), COLUMNS, ArrowButton(), COLUMN_GROUPS, COLUMN_KIND (+56 more)

### Community 22 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.15
Nodes (25): isOccurredOn(), defaultSalesFactDay(), monthDates(), DayDateControl(), onKeyDown(), finishedGoodsFactPageTitle(), mondayLeadForMonth(), resolveDay() (+17 more)

### Community 23 - "sales-fact.ts"
Cohesion: 0.15
Nodes (26): costExVat(), unitCost, amountExVat(), amountWithVat(), averageAmount(), percentHundredths(), ratioRound(), vatPercentHundredths() (+18 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "revenueExVat"
Cohesion: 0.38
Nodes (7): productSide(), profitabilityHundredths(), revenueExVat(), revenueWithVat(), salesPlanLineMetrics, planSide(), planSideAtVolume()

### Community 26 - "use-materials.ts"
Cohesion: 0.17
Nodes (28): addMaterial(), deleteMaterial(), deleteMaterialReceipt(), isMaterialGroupId(), isMaterialUnit(), isMaterialWarehouseId(), isMaterialWeightPair(), isPrice() (+20 more)

### Community 27 - "production-journal-fact.ts"
Cohesion: 0.14
Nodes (23): Удаление, Product, ProductCategory, PrototypeDocument, dayGridProducts(), periodGridCategories(), periodGridProducts(), periodReferencedProductIds() (+15 more)

### Community 28 - "SummaryTable.tsx"
Cohesion: 0.18
Nodes (17): CategoryBlock(), editableFieldNear(), FACT_REPEATED, factColumnKind(), PLAN_ASSIGNED, planColumnKind(), ProductRow(), sectionRightClass() (+9 more)

### Community 29 - "FinishedGoodsMonthScreen.tsx"
Cohesion: 0.19
Nodes (16): metadata, MovementFactPage(), metadata, MovementPage(), resolveSummaryMonthRange(), FinishedGoodsFactScreen(), FinishedGoodsMonthScreen(), FullscreenToggle() (+8 more)

### Community 30 - "production/fact/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, ProductionFactPage(), parseProductionJournalFactQuery(), PRODUCTION_FACT_TITLE

### Community 31 - "RecipeJournalsTable.tsx"
Cohesion: 0.17
Nodes (18): metadata, RecipeFinishedPage(), productCompositionLines(), productRecipeSections(), formatQuantity(), FinishedProductsScreen(), finishedProductHref(), RecipeJournalsScreen() (+10 more)

### Community 32 - "document.ts"
Cohesion: 0.12
Nodes (16): catalogCategories(), DeletableRecord, DERIVATIVE_UNITS, FinishedGoodsNorm, FinishedGoodsOpeningLine, Material, MaterialMonthPlan, MaterialNorm (+8 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.16
Nodes (25): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), mergeFactRows(), mergeMonthProductionFacts(), moneyDelta() (+17 more)

### Community 34 - "ColumnLabel"
Cohesion: 0.14
Nodes (22): FINISHED_GOODS_CLOSING_SUB_BANNERS, MATERIALS_CLOSING_SUB_BANNERS, MATERIALS_CONSUMPTION_SUB_BANNERS, MATERIALS_RECEIPT_SUB_BANNERS, MATERIALS_SUMMARY_SUB_BANNERS, ReportSubBannerColumnHeaders(), ReportSubBannerGroup, subBannerColumnBorderClass() (+14 more)

### Community 35 - "MaterialJournalScreen.tsx"
Cohesion: 0.09
Nodes (35): MaterialsInventoryPage(), metadata, MaterialsNormsPage(), metadata, MaterialsPage(), metadata, MaterialsPlanPage(), metadata (+27 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.18
Nodes (15): useDocumentStore(), recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactHref(), DayDateControl(), onKeyDown(), FullscreenToggle(), mondayLeadForMonth() (+7 more)

### Community 37 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (81): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+73 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.14
Nodes (28): ProductionPlan, ProductionPlanLine, activeProductionPlans(), addMissingProductionPlanLines(), addMissingProductionPlanLinesRejection(), addProductionPlan(), createRejection(), defaultProductionPlanLines() (+20 more)

### Community 40 - "monthKeyFromDate"
Cohesion: 0.12
Nodes (29): metadata, MovementPlanPage(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), resolveMonth(), resolveMonth() (+21 more)

### Community 41 - "DocumentProvider.tsx"
Cohesion: 0.17
Nodes (17): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+9 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 43 - "DerivativeCreateScreen.tsx"
Cohesion: 0.12
Nodes (26): DerivativePage(), metadata, metadata, NewDerivativePage(), metadata, RecipeDerivativesPage(), derivativeCompositionLines(), derivativeSections() (+18 more)

### Community 46 - "FinishedGoodsMonthTable.tsx"
Cohesion: 0.15
Nodes (19): Подсказки заголовков таблицы, FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, CategoryBlock(), FinishedGoodsFactTable(), groupEndClass(), ProductRow() (+11 more)

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 48 - "FinishedProductEditScreen.tsx"
Cohesion: 0.18
Nodes (14): FinishedProductRecipePage(), metadata, ProductRecipeLine, productByIdOrNull(), ProductRecipeRejection, DerivativeLineDraft, FinishedProductEditScreen(), initialGramsDraft() (+6 more)

### Community 49 - "MaterialsPlanTable.tsx"
Cohesion: 0.12
Nodes (27): costWithVat(), MaterialMovementTotals, MaterialNormDeviation(), MaterialsInventoryTable(), NormCell(), ColumnKey, COLUMNS, MaterialsPlanTable() (+19 more)

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

### Community 62 - "production-journal.ts"
Cohesion: 0.29
Nodes (15): commitDocumentUpdate(), ProductionEntryLine, addProductionEntry(), addProductionEntryRejection(), deleteProductionEntry(), entryById(), isLinePrice(), lineRejection() (+7 more)

### Community 63 - "production/plan/page.tsx"
Cohesion: 0.50
Nodes (4): metadata, ProductionPlanPage(), parseProductionPlanQuery(), PRODUCTION_PLAN_TITLE

### Community 64 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (30): activeCategories(), SalesPlanRejection, ensureRangeIncludesMonth(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection, SummaryLens, productionFactHref() (+22 more)

### Community 66 - "PageFrame"
Cohesion: 0.16
Nodes (13): nextConfig, next, Home(), metadata, metadata, PlanPage(), metadata, QuestionsPage() (+5 more)

### Community 73 - "PlanningScreen.tsx"
Cohesion: 0.11
Nodes (34): react, metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), deletedProducts(), parsePlanningQuery() (+26 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 359 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `PlanningScreen.tsx` to `ProductionEntryScreen.tsx`, `AppShell.tsx`, `MaterialReceiptFormTable.tsx`, `package.json`, `MaterialDocumentScreen.tsx`, `ProductionFactTable.tsx`, `InventoryScreen.tsx`, `MaterialsPlanScreen.tsx`, `index.ts`, `FinishedGoodsFactScreen.tsx`, `SummaryTable.tsx`, `FinishedGoodsMonthScreen.tsx`, `RecipeJournalsTable.tsx`, `ColumnLabel`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `monthKeyFromDate`, `DocumentProvider.tsx`, `DerivativeCreateScreen.tsx`, `FinishedGoodsMonthTable.tsx`, `FinishedProductEditScreen.tsx`, `MaterialsPlanTable.tsx`, `SummaryScreen.tsx`, `PageFrame`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09840425531914894 - nodes in this community are weakly interconnected._
- **Why does `next` connect `PageFrame` to `ProductionEntryScreen.tsx`, `AppShell.tsx`, `package.json`, `MaterialDocumentScreen.tsx`, `InventoryScreen.tsx`, `production/paths.ts`, `MaterialsPlanScreen.tsx`, `FinishedGoodsFactScreen.tsx`, `FinishedGoodsMonthScreen.tsx`, `production/fact/page.tsx`, `RecipeJournalsTable.tsx`, `MaterialJournalScreen.tsx`, `ProductionJournalFactScreen.tsx`, `SaleScreen.tsx`, `monthKeyFromDate`, `DerivativeCreateScreen.tsx`, `FinishedProductEditScreen.tsx`, `production/plan/page.tsx`, `SummaryScreen.tsx`, `PlanningScreen.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `ProductionEntryScreen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12315270935960591 - nodes in this community are weakly interconnected._
- **Why does `plannedProductionVolumePieces()` connect `finished-goods.ts` to `summary.ts`, `production-fact.ts`, `Ввод плана (производство)`, `production-plan.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0912568306010929 - nodes in this community are weakly interconnected._