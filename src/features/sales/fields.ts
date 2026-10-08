import type { FieldRejection } from '@/domain/products';

export const fieldClassName =
  'h-11 w-full border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-ink focus-visible:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60';

/** Ширина под самое длинное русское название месяца и год, без лишнего. */
export const monthFieldClassName =
  'h-11 w-[11.5rem] shrink-0 border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-ink focus-visible:bg-sheet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60';

export const primaryButtonClassName =
  'inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-ink px-4 text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted';

export const FIELD_ERROR: Record<FieldRejection, string> = {
  empty: 'Укажите название.',
  'too-long': 'Слишком длинное название.',
  duplicate: 'Такое название уже есть.',
  cost: 'Укажите себестоимость.',
  missing: 'Запись не найдена.',
  category: 'Выберите категорию.',
};

export const VAT_PARSE_ERROR = 'Укажите НДС целым числом.';
