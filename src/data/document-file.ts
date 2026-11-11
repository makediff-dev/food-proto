import { migrateDocument } from '@/data/migrate-document';
import { type PrototypeDocument, SCHEMA_VERSION } from '@/domain/document';

type DocumentCollectionKey = Exclude<keyof PrototypeDocument, 'schemaVersion'>;

const DOCUMENT_COLLECTION_KEYS = {
  categories: 'object',
  products: 'object',
  salesPlans: 'object',
  productionPlans: 'object',
  sales: 'object',
  productionEntries: 'object',
  hrPositions: 'object',
  hrMonthPlans: 'object',
  hrMonthFacts: 'object',
  hrDayFacts: 'object',
  hrTaxRates: 'object',
  transportCarriers: 'object',
  transportHireMonthPlans: 'object',
  transportHireDayFacts: 'object',
  transportVehicles: 'object',
  transportOwnMonthPlans: 'object',
  transportOwnDayFacts: 'object',
  opexOtherLines: 'object',
  opexMonthLines: 'object',
  opexDayFacts: 'object',
  opexPromotedGroupCodes: 'string',
  finishedGoodsOpenings: 'object',
  finishedGoodsNorms: 'object',
  materials: 'object',
  materialNorms: 'object',
  materialMonthPlans: 'object',
  materialOpenings: 'object',
  materialReceipts: 'object',
  derivatives: 'object',
  derivativeOpenings: 'object',
  derivativeNorms: 'object',
  creditors: 'object',
  creditResourceMonths: 'object',
  propertyTaxMonths: 'object',
} as const satisfies Record<DocumentCollectionKey, 'object' | 'string'>;

export type ParseDocumentResult = { ok: true; document: PrototypeDocument } | { ok: false; error: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function serializeDocument(document: PrototypeDocument): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}

export function formatDocumentFileName(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `food-proto-v${SCHEMA_VERSION}-${year}-${month}-${day}.json`;
}

export function downloadDocumentFile(document: PrototypeDocument, now?: Date): void {
  const json = serializeDocument(document);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = formatDocumentFileName(now);
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function parseDocumentFile(raw: string): ParseDocumentResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      error: 'Файл повреждён или не является JSON.',
    };
  }

  if (!isPlainObject(parsed)) {
    return {
      ok: false,
      error: 'Файл не содержит документ прототипа.',
    };
  }

  if (typeof parsed.schemaVersion !== 'number') {
    return {
      ok: false,
      error: 'В файле не указана версия схемы (schemaVersion).',
    };
  }

  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    return {
      ok: false,
      error: `Версия файла (v${parsed.schemaVersion}) не совпадает с версией приложения (v${SCHEMA_VERSION}).`,
    };
  }

  const entries = Object.entries(DOCUMENT_COLLECTION_KEYS) as [DocumentCollectionKey, 'object' | 'string'][];

  for (const [key, itemKind] of entries) {
    const collection = parsed[key];
    if (!Array.isArray(collection)) {
      return {
        ok: false,
        error: `В файле отсутствует или повреждён раздел «${key}».`,
      };
    }

    const validItems =
      itemKind === 'string'
        ? collection.every((item) => typeof item === 'string')
        : collection.every((item) => isPlainObject(item));

    if (!validItems) {
      return {
        ok: false,
        error: `В разделе «${key}» найдены некорректные записи.`,
      };
    }
  }

  const document = migrateDocument(parsed as unknown as PrototypeDocument);
  return {
    ok: true,
    document,
  };
}
