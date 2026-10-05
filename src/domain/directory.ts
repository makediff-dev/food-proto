import { type DeletableRecord, MAX_LABEL_LENGTH } from '@/domain/document';

export type NameRejection = 'empty' | 'too-long' | 'duplicate';

export function normalizeName(name: string): string {
  return name.trim();
}

function nameKey(name: string): string {
  return normalizeName(name).toLocaleLowerCase('ru-RU');
}

/** Пустое, длинное или уже занятое среди записей без `deletedAt`. */
export function rejectName(
  name: string,
  items: readonly DeletableRecord[],
  exceptId?: string,
): NameRejection | null {
  const normalized = normalizeName(name);
  if (normalized.length === 0) {
    return 'empty';
  }

  if (normalized.length > MAX_LABEL_LENGTH) {
    return 'too-long';
  }

  const key = nameKey(normalized);
  const clash = items.some(
    (item) =>
      item.deletedAt === null &&
      item.id !== exceptId &&
      nameKey(item.name) === key,
  );

  return clash ? 'duplicate' : null;
}
