import { type FinishedGoodsOpening, isMonthKey, type PrototypeDocument, SCHEMA_VERSION } from '@/domain/document';
import { shiftMonth } from '@/domain/sales-plan';

const LEGACY_OPENING_SCHEMA = 41 as const;

/**
 * v42: инвентаризация на конец месяца; перенос на начало следующего — факт прошлого конца.
 * Старые записи месяца M хранили остаток на начало M → переносим в конец M−1.
 */
export function migrateDocument(document: PrototypeDocument): PrototypeDocument {
  if (document.schemaVersion === SCHEMA_VERSION) {
    return document;
  }

  if (document.schemaVersion !== LEGACY_OPENING_SCHEMA) {
    return document;
  }

  const legacyOpenings = document.finishedGoodsOpenings ?? [];
  const endByMonth = new Map<string, Map<string, number>>();

  for (const opening of legacyOpenings) {
    if (!isMonthKey(opening.month)) {
      continue;
    }
    const previousMonth = shiftMonth(opening.month, -1);
    if (!isMonthKey(previousMonth) || previousMonth < '2000-01') {
      continue;
    }
    const lines = new Map<string, number>();
    for (const line of opening.lines) {
      lines.set(line.productId, line.pieces);
    }
    endByMonth.set(previousMonth, lines);
  }

  const finishedGoodsOpenings: FinishedGoodsOpening[] = [];
  for (const [month, linesByProduct] of endByMonth) {
    finishedGoodsOpenings.push({
      id: `finished-goods-opening:${month}`,
      month,
      lines: [...linesByProduct.entries()].map(([productId, pieces]) => ({
        id: `finished-goods-opening-line:${month}:${productId}`,
        productId,
        pieces,
      })),
    });
  }

  return {
    ...document,
    schemaVersion: SCHEMA_VERSION,
    finishedGoodsOpenings,
  };
}
