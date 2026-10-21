# Graph Report - food-proto  (2026-10-21)

## Corpus Check
- 155 files · ~92,991 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .mdc 5, (none) 1, .ico 1)

## Summary
- 1460 nodes · 5317 edges · 58 communities (51 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0050f01a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- summary.ts
- ProductionEntryFormTable.tsx
- sales-plan.ts
- PlanningScreen.tsx
- mock-document.ts
- SummaryTable.tsx
- Предметная область
- finished-goods.ts
- package.json
- biome.json
- SaleScreen.tsx
- monthKeyFromDate
- compilerOptions
- index.ts
- MaterialsPlanScreen.tsx
- FinishedGoodsFactTable.tsx
- SummaryScreen.tsx
- ProductionFactTable.tsx
- document.ts
- use-materials.ts
- FinishedGoodsFactScreen.tsx
- materials.ts
- ProductionEntryScreen.tsx
- production-journal-fact.ts
- Флоу товара
- MovementPlanScreen.tsx
- AppShell.tsx
- MaterialReceiptFormTable.tsx
- layout.tsx
- PageFrame
- next
- sales-fact.ts
- ProductionJournalFactTable
- production-fact.ts
- DocumentProvider.tsx
- ProductionJournalFactScreen.tsx
- production-plan.ts
- materials/text.ts
- SalesFactScreen.tsx
- Отчет общий сырья
- postcss.config.mjs
- revenueExVat
- Отчет общий движения
- MaterialsSummaryTable.tsx
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
- IconFullscreen

## God Nodes (most connected - your core abstractions)
1. `monthKeyFromDate()` - 70 edges
2. `planMonthOpen()` - 56 edges
3. `PageFrame()` - 53 edges
4. `next` - 51 edges
5. `keepWithNext()` - 51 edges
6. `VatMoneyCell()` - 46 edges
7. `react` - 45 edges
8. `shiftMonth()` - 38 edges
9. `TableNumber()` - 36 edges
10. `useSales()` - 34 edges

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

## Communities (58 total, 7 thin omitted)

### Community 0 - "summary.ts"
Cohesion: 0.12
Nodes (37): Единицы, PROFIT_TAX_PERCENT, SalesPlan, priceWithVatFromExVat(), salesPlanTotals, actualRangeSummary(), applyFactScale(), applyPlanScale() (+29 more)

### Community 1 - "ProductionEntryFormTable.tsx"
Cohesion: 0.09
Nodes (36): formatKopecks(), GridInput(), RowCell(), editableFieldNear(), ProductRow(), buildGroups(), CategoryBlock(), COLUMN_KIND (+28 more)

### Community 2 - "sales-plan.ts"
Cohesion: 0.08
Nodes (57): Home(), metadata, metadata, PlanPage(), addCategory(), categoryNameRejection(), CategoryRejection, deleteCategory() (+49 more)

### Community 3 - "PlanningScreen.tsx"
Cohesion: 0.10
Nodes (38): metadata, PlanningArchivePage(), metadata, PlanningPage(), deletedCategories(), activeProducts(), deletedProducts(), missingPlanProducts() (+30 more)

### Community 4 - "mock-document.ts"
Cohesion: 0.07
Nodes (26): burger, caesar, CatalogProductId, catalogProductIds, closingInventorySeptember, factPriceWithVat, finishedGoodsNorms, finishedGoodsOpenings (+18 more)

### Community 5 - "SummaryTable.tsx"
Cohesion: 0.09
Nodes (50): TotalCell(), RowCell(), TotalCell(), AverageCost(), Pieces(), RowCell(), TotalCell(), VolumeTotal() (+42 more)

### Community 6 - "Предметная область"
Cohesion: 0.06
Nodes (29): Cursor Cloud specific instructions, This is NOT the Next.js you know, Прототип учёта, Блоки, Ввод плана (движение), Ввод факта (производство), Верхний блок сводки, Движение готовой продукции (+21 more)

### Community 7 - "finished-goods.ts"
Cohesion: 0.07
Nodes (79): metadata, MovementPage(), FinishedGoodsNormLine, FinishedGoodsOpeningLine, isMonthKey(), bookClosingPiecesForProduct(), bookClosingReferencedProductIds(), bookOpeningPiecesForProduct() (+71 more)

### Community 8 - "package.json"
Cohesion: 0.06
Nodes (34): dependencies, next, react, react-dom, devDependencies, @biomejs/biome, portless, tailwindcss (+26 more)

### Community 9 - "biome.json"
Cohesion: 0.06
Nodes (33): source, assist, actions, enabled, noUnusedImports, noUnusedVariables, css, parser (+25 more)

### Community 10 - "SaleScreen.tsx"
Cohesion: 0.06
Nodes (77): metadata, SalePage(), metadata, SalesJournalPage(), metadata, NewSalePage(), metadata, SalesFactPage() (+69 more)

### Community 11 - "monthKeyFromDate"
Cohesion: 0.15
Nodes (23): metadata, ProductionPlanPage(), missingProductionPlanProducts(), monthKeyFromDate(), planMonthOpen(), shiftMonth(), lastHorizonMonth(), resolveMonth() (+15 more)

### Community 12 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 13 - "index.ts"
Cohesion: 0.11
Nodes (53): react, MaterialMovementRow, MaterialMovementTotals, MovementPlanGroup, MovementPlanRow, MovementPlanTotals, COLUMNS, ColumnKey (+45 more)

### Community 14 - "MaterialsPlanScreen.tsx"
Cohesion: 0.13
Nodes (23): MaterialsPage(), metadata, MATERIAL_GROUPS, MATERIAL_UNITS, MaterialGroupId, MaterialUnit, MaterialWarehouseId, deletedMaterials() (+15 more)

### Community 15 - "FinishedGoodsFactTable.tsx"
Cohesion: 0.11
Nodes (38): FinishedGoodsGroup, FinishedGoodsRow, FinishedGoodsTotals, ArrowButton(), CategoryBlock(), COLUMN_GROUPS, COLUMN_KIND, ColumnKey (+30 more)

### Community 16 - "SummaryScreen.tsx"
Cohesion: 0.14
Nodes (29): SalesPlanRejection, displayedOperatingExpense(), ensureRangeIncludesMonth(), monthOperatingExpenseAmounts(), monthsInRange(), normalizeMonthRange(), OperatingExpenseRejection, SummaryLens (+21 more)

### Community 17 - "ProductionFactTable.tsx"
Cohesion: 0.13
Nodes (32): Подсказки заголовков таблицы, FINISHED_GOODS_CLOSING_SUB_BANNERS, FinishedGoodsReportColumnHeaders(), ReportSubBannerColumnHeaders(), ReportSubBannerGroup, subBannerGroupForKey(), subBannerLastKey(), CategoryBlock() (+24 more)

### Community 18 - "document.ts"
Cohesion: 0.10
Nodes (22): defaultMax(), LineOverride, materialNorms, materialPlan(), materials, mockMaterials, priceWithVat, q() (+14 more)

### Community 19 - "use-materials.ts"
Cohesion: 0.21
Nodes (23): addMaterial(), deleteMaterial(), isMaterialUnit(), isMaterialWarehouseId(), isPrice(), isVatPercent(), materialById(), materialNameRejection (+15 more)

### Community 20 - "FinishedGoodsFactScreen.tsx"
Cohesion: 0.13
Nodes (23): metadata, MovementFactPage(), metadata, MovementInventoryPage(), isOccurredOn(), defaultSalesFactDay(), DayDateControl(), onKeyDown() (+15 more)

### Community 21 - "materials.ts"
Cohesion: 0.10
Nodes (40): costExVat(), MaterialReceiptLine, addMoney(), addMoneyNullable(), bookClosingQuantity(), closingMaterialQuantity(), consumptionQuantity(), deleteMaterialReceipt() (+32 more)

### Community 22 - "ProductionEntryScreen.tsx"
Cohesion: 0.06
Nodes (72): metadata, ProductionFactPage(), metadata, ProductionEntryPage(), metadata, NewProductionEntryPage(), metadata, ProductionJournalPage() (+64 more)

### Community 23 - "production-journal-fact.ts"
Cohesion: 0.09
Nodes (30): Архитектура прототипа, Поток данных, Слои, Удаление, Чего не делать, Product, ProductCategory, averageAmount() (+22 more)

### Community 24 - "Флоу товара"
Cohesion: 0.12
Nodes (17): Деньги, Категория и «Всего», Операционные расходы, Остаток, Отклонение, Прогноз и фактическая, Путь товара, Рекомендуемый объём (+9 more)

### Community 25 - "MovementPlanScreen.tsx"
Cohesion: 0.22
Nodes (12): metadata, MovementPlanPage(), activeCategories(), FullscreenToggle(), MovementPlanScreen(), resolveMonth(), Workspace(), open() (+4 more)

### Community 26 - "AppShell.tsx"
Cohesion: 0.18
Nodes (15): MATERIALS_SECTION_TITLE, SALES_SECTION_TITLE, currentNavLabel(), MATERIALS_NAV, MOVEMENT_NAV, NavGroup(), NavItem, navItemIsCurrent() (+7 more)

### Community 27 - "MaterialReceiptFormTable.tsx"
Cohesion: 0.09
Nodes (34): setLine(), buildGroups(), COLUMN_KIND, ColumnKey, COLUMNS, emptyMaterialReceiptLineDraft(), EntryFormGroup, EntryFormRow (+26 more)

### Community 28 - "layout.tsx"
Cohesion: 0.20
Nodes (6): metadata, onest, RootLayout(), unbounded, AppShell(), MockReset()

### Community 29 - "PageFrame"
Cohesion: 0.21
Nodes (11): MaterialsNormsPage(), metadata, metadata, QuestionsPage(), activeMaterials(), materialNormQuantity(), MaterialsNormsScreen(), NormCell() (+3 more)

### Community 30 - "next"
Cohesion: 0.11
Nodes (29): nextConfig, next, MaterialsInventoryPage(), metadata, MaterialsPlanPage(), metadata, MaterialReceiptPage(), metadata (+21 more)

### Community 31 - "sales-fact.ts"
Cohesion: 0.20
Nodes (18): unitCost, amountExVat(), amountWithVat(), percentHundredths(), ratioRound(), vatPercentHundredths(), ProductionJournalFactRow, dayTotals() (+10 more)

### Community 32 - "ProductionJournalFactTable"
Cohesion: 0.22
Nodes (9): adjacentDay(), ArrowButton(), DayLabel(), dayOfMonth(), ProductionJournalFactTable(), visibleDayRows(), ArrowButton(), DayLabel() (+1 more)

### Community 33 - "production-fact.ts"
Cohesion: 0.14
Nodes (32): actualRangeProductionFact(), applyProductionFactLens(), applyRowLens(), factRow(), factSpendByProduct(), factVolumeScale(), mergeFactRows(), mergeMonthProductionFacts() (+24 more)

### Community 34 - "DocumentProvider.tsx"
Cohesion: 0.19
Nodes (17): clearDocument(), DOCUMENT_STORAGE_KEY, DocumentStorageError, readDocument(), writeDocument(), createInitialState(), DocumentProvider(), DocumentSource (+9 more)

### Community 36 - "ProductionJournalFactScreen.tsx"
Cohesion: 0.22
Nodes (13): recommendedDayKey(), defaultProductionJournalFactDay(), productionJournalFactGridProducts(), productionJournalFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay() (+5 more)

### Community 39 - "production-plan.ts"
Cohesion: 0.16
Nodes (22): ProductionPlan, plannedProductionVolumePieces(), activeProductionPlans(), addProductionPlan(), createRejection(), defaultProductionPlanLines(), emptyTotals(), ensureProductionPlan() (+14 more)

### Community 40 - "materials/text.ts"
Cohesion: 0.18
Nodes (10): MaterialDocumentRejection, MaterialNormRejection, MaterialOpeningRejection, MaterialPlanRejection, MAX_QUANTITY_THOUSANDTHS, QUANTITY_SCALE, MATERIAL_DOCUMENT_ERROR, MATERIAL_NORM_ERROR (+2 more)

### Community 41 - "SalesFactScreen.tsx"
Cohesion: 0.23
Nodes (14): salesFactGridProducts(), salesFactHref(), DayDateControl(), onKeyDown(), mondayLeadForMonth(), resolveDay(), resolveMonth(), salesFactPageTitle() (+6 more)

### Community 42 - "Отчет общий сырья"
Cohesion: 0.33
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий сырья, Приход от поставщика, Расход в производстве

### Community 45 - "revenueExVat"
Cohesion: 0.38
Nodes (7): productionPlanLineMetrics, profitabilityHundredths(), revenueExVat(), revenueWithVat(), salesPlanLineMetrics, planSide(), planSideAtVolume()

### Community 47 - "Отчет общий движения"
Cohesion: 0.40
Nodes (5): Остаток на конец, Остаток на начало, Отчет общий движения, Продажи, Производство

### Community 49 - "MaterialsSummaryTable.tsx"
Cohesion: 0.14
Nodes (24): costWithVat(), MaterialNormDeviation(), MaterialsInventoryTable(), MaterialsPlanTable(), PlanCell(), planColumnKind(), PlanTotal(), COLUMN_GROUPS (+16 more)

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

### Community 63 - "IconFullscreen"
Cohesion: 0.33
Nodes (11): FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle(), FullscreenToggle() (+3 more)

## Knowledge Gaps
- **9 isolated node(s):** `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 333 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `plannedProductionVolumePieces()` connect `production-plan.ts` to `summary.ts`, `production-fact.ts`, `sales-plan.ts`, `finished-goods.ts`, `revenueExVat`, `Ввод плана (производство)`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `react-dom`, `@biomejs/biome`, `@tailwindcss/postcss` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `summary.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11605937921727395 - nodes in this community are weakly interconnected._
- **Why does `Что пишется` connect `Ввод плана (производство)` to `production-plan.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `ProductionEntryFormTable.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09175377468060394 - nodes in this community are weakly interconnected._
- **Why does `react` connect `index.ts` to `ProductionEntryFormTable.tsx`, `sales-plan.ts`, `PlanningScreen.tsx`, `SummaryTable.tsx`, `finished-goods.ts`, `package.json`, `SaleScreen.tsx`, `monthKeyFromDate`, `MaterialsPlanScreen.tsx`, `FinishedGoodsFactTable.tsx`, `SummaryScreen.tsx`, `ProductionFactTable.tsx`, `FinishedGoodsFactScreen.tsx`, `ProductionEntryScreen.tsx`, `MovementPlanScreen.tsx`, `AppShell.tsx`, `MaterialReceiptFormTable.tsx`, `PageFrame`, `next`, `DocumentProvider.tsx`, `ProductionJournalFactScreen.tsx`, `SalesFactScreen.tsx`, `MaterialsSummaryTable.tsx`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `sales-plan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08158508158508158 - nodes in this community are weakly interconnected._