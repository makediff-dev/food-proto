import { type DeletableRecord } from '@/domain/document';

export type NameRejection = 'empty' | 'too-long' | 'duplicate';

function nameKey(name: string): string {
  return name.trim().toLocaleLowerCase('ru-RU');
}

/** Пустое, длинное или уже занятое среди записей без `deletedAt`. */
export function rejectName(name: string, items: readonly DeletableRecord[], exceptId?: string): NameRejection | null {
  const normalized = name.trim();
  if (normalized.length === 0) return 'empty';

  const key = nameKey(normalized);
  const clash = items.some((item) => item.deletedAt === null && item.id !== exceptId && nameKey(item.name) === key);

  return clash ? 'duplicate' : null;
}
