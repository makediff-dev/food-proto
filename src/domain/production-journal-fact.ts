import { type UnitCost } from '@/domain/cost';
import { type Product, type PrototypeDocument } from '@/domain/document';
import { averageAmount } from '@/domain/money';
import { dayGridProducts, periodGridCategories } from '@/domain/period-grid';
import { productionFactGridProducts } from '@/domain/production-fact';
import {
  type ProductionProductSpend,
  productionSpendByProduct,
  workingProductionEntries,
} from '@/domain/production-journal';
import { adjacentDay, defaultSalesFactDay, monthDates } from '@/domain/sales-fact';

export { adjacentDay, monthDates };

/** День, который таблица показывает, пока в адресе нет другой даты. */
export function defaultProductionJournalFactDay(month: string, today: Date): string {
  return defaultSalesFactDay(month, today);
}

export interface ProductionJournalFactRow {
  productId: string;
  name: string;
  deleted: boolean;
  pieces: number;
  /** Сколько ещё выпустить к концу дня, чтобы добрать максимум, если остаток ниже минимума. */
  recommendedPieces: number;
  /** Цена 1 шт: сумма журнала этого дня / штуки. Нет выпуска — 0. */
  unitCost: UnitCost | null;
  /** Копейки. Сумма строк журнала за день (цена × штуки). Нет выпуска — 0. */
  volumeCostWithVat: number | null;
  /** Копейки. Сумма строк без НДС. Нет выпуска — 0. */
  volumeCostExVat: number | null;
}

export interface ProductionJournalFactTotals {
  pieces: number;
  /** Сумма рекомендуемых объёмов строк. */
  recommendedPieces: number;
  /** Копейки. Сумма стоимостей, если цена полная. */
  volumeCostWithVat: number | null;
  volumeCostExVat: number | null;
  /** Есть строка со штуками, у которой цена без НДС не считается. */
  costComplete: boolean;
  /** Стоимость / объём, копейки. Только если цена полная. Нет выпуска — 0. */
  averageCostWithVat: number | null;
  averageCostExVat: number | null;
}

/** Строка группы как в «Отчете подневном». Пустая рабочая категория тоже входит. */
export interface ProductionJournalFactGroup {
  categoryId: string;
  name: string;
  deleted: boolean;
  rows: ProductionJournalFactRow[];
  totals: ProductionJournalFactTotals;
}

export interface ProductionJournalFactDayView {
  occurredOn: string;
  groups: ProductionJournalFactGroup[];
  rows: ProductionJournalFactRow[];
  totals: ProductionJournalFactTotals;
}

/** Товары сетки месяца: как в «Отчете общем» производства. */
export function productionJournalFactGridProducts(document: PrototypeDocument, month: string): Product[] {
  return productionFactGridProducts(document, month);
}

/** Сумма штук журнала выпуска по товару за календарный день. */
export function productionEntryDayPieces(document: PrototypeDocument, occurredOn: string, productId: string): number {
  let pieces = 0;
  for (const entry of workingProductionEntries(document)) {
    if (entry.occurredOn !== occurredOn) {
      continue;
    }
    for (const line of entry.lines) {
      if (line.productId === productId) {
        pieces += line.pieces;
      }
    }
  }
  return pieces;
}

const ZERO_UNIT_COST: UnitCost = { withVat: 0, exVat: 0 };

function rowMetrics(
  product: Product,
  spend: ProductionProductSpend | undefined,
  recommendedPieces: number,
): ProductionJournalFactRow {
  const pieces = spend?.pieces ?? 0;
  if (!spend || pieces === 0) {
    return {
      productId: product.id,
      name: product.name,
      deleted: product.deletedAt !== null,
      pieces: 0,
      recommendedPieces,
      unitCost: ZERO_UNIT_COST,
      volumeCostWithVat: 0,
      volumeCostExVat: 0,
    };
  }

  const complete = spend.complete;
  const unitWith = complete ? averageAmount(spend.costWithVat, pieces) : null;
  const unitEx = complete ? averageAmount(spend.costExVat, pieces) : null;
  const unitCost: UnitCost | null =
    unitWith === null || unitEx === null
      ? null
      : {
          withVat: unitWith,
          exVat: unitEx,
        };

  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    pieces,
    recommendedPieces,
    unitCost,
    volumeCostWithVat: complete ? spend.costWithVat : null,
    volumeCostExVat: complete ? spend.costExVat : null,
  };
}

function dayTotals(rows: readonly ProductionJournalFactRow[]): ProductionJournalFactTotals {
  let pieces = 0;
  let recommendedPieces = 0;
  let costWith = 0;
  let costEx = 0;
  let costComplete = true;

  for (const row of rows) {
    pieces += row.pieces;
    recommendedPieces += row.recommendedPieces;
    if (row.pieces > 0 && (row.volumeCostWithVat === null || row.volumeCostExVat === null)) {
      costComplete = false;
    }
    if (row.volumeCostWithVat !== null) {
      costWith += row.volumeCostWithVat;
    }
    if (row.volumeCostExVat !== null) {
      costEx += row.volumeCostExVat;
    }
  }

  return {
    pieces,
    recommendedPieces,
    volumeCostWithVat: costComplete ? costWith : null,
    volumeCostExVat: costComplete ? costEx : null,
    costComplete,
    averageCostWithVat: !costComplete ? null : averageAmount(costWith, pieces),
    averageCostExVat: !costComplete ? null : averageAmount(costEx, pieces),
  };
}

function productionJournalFactGroups(
  document: PrototypeDocument,
  products: readonly Product[],
  rows: readonly ProductionJournalFactRow[],
): ProductionJournalFactGroup[] {
  const byId = new Map(rows.map((row) => [row.productId, row]));

  return periodGridCategories(document, products).map((category) => {
    const groupRows = products
      .filter((item) => item.categoryId === category.id)
      .sort((left, right) => left.name.localeCompare(right.name, 'ru'))
      .flatMap((item) => {
        const row = byId.get(item.id);
        return row ? [row] : [];
      });

    return {
      categoryId: category.id,
      name: category.name,
      deleted: category.deletedAt !== null,
      rows: groupRows,
      totals: dayTotals(groupRows),
    };
  });
}

/** Дни месяца сверху вниз. Факт дня считается из журнала выпуска. */
export function productionJournalFactMonth(
  document: PrototypeDocument,
  month: string,
  recommendedPieces: (productId: string, occurredOn: string) => number = () => 0,
): ProductionJournalFactDayView[] {
  const products = productionJournalFactGridProducts(document, month);

  return monthDates(month).map((occurredOn) => {
    const spendByProduct = productionSpendByProduct(
      document,
      workingProductionEntries(document).filter((entry) => entry.occurredOn === occurredOn),
    );
    const dayProducts = dayGridProducts(products, (product) => (spendByProduct.get(product.id)?.pieces ?? 0) > 0);
    const rows = dayProducts.map((product) =>
      rowMetrics(product, spendByProduct.get(product.id), recommendedPieces(product.id, occurredOn)),
    );
    const groups = productionJournalFactGroups(document, dayProducts, rows);
    const groupedRows = groups.flatMap((group) => group.rows);

    return {
      occurredOn,
      groups,
      rows: groupedRows,
      totals: dayTotals(groupedRows),
    };
  });
}
