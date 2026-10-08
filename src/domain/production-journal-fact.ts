import { type Product, type PrototypeDocument } from '@/domain/document';
import { periodGridCategories } from '@/domain/period-grid';
import { productionFactGridProducts } from '@/domain/production-fact';
import { workingProductionEntries } from '@/domain/production-journal';
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
}

export interface ProductionJournalFactTotals {
  pieces: number;
}

/** Строка группы как на «Продажах». Пустая рабочая категория тоже входит. */
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

/** Товары сетки месяца: как на «Производстве». */
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

function rowMetrics(product: Product, pieces: number): ProductionJournalFactRow {
  return {
    productId: product.id,
    name: product.name,
    deleted: product.deletedAt !== null,
    pieces,
  };
}

function dayTotals(rows: readonly ProductionJournalFactRow[]): ProductionJournalFactTotals {
  let pieces = 0;
  for (const row of rows) {
    pieces += row.pieces;
  }
  return { pieces };
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
export function productionJournalFactMonth(document: PrototypeDocument, month: string): ProductionJournalFactDayView[] {
  const products = productionJournalFactGridProducts(document, month);

  return monthDates(month).map((occurredOn) => {
    const rows = products.map((product) =>
      rowMetrics(product, productionEntryDayPieces(document, occurredOn, product.id)),
    );
    const groups = productionJournalFactGroups(document, products, rows);
    const groupedRows = groups.flatMap((group) => group.rows);

    return {
      occurredOn,
      groups,
      rows: groupedRows,
      totals: dayTotals(groupedRows),
    };
  });
}
