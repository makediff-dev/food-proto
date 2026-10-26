import type { DerivativeNormRejection, DerivativeOpeningRejection } from '@/domain/derivative-movement';

export const DERIVATIVE_OPENING_ERROR: Record<DerivativeOpeningRejection, string> = {
  month: 'Этот месяц выбрать нельзя.',
  closed: 'Этот месяц сейчас нельзя править.',
  derivative: 'Производная не найдена.',
  locked: 'Удалённую производную не меняют.',
  quantity: 'Укажите остаток на конец.',
};

export const DERIVATIVE_NORM_ERROR: Record<DerivativeNormRejection, string> = {
  month: 'Этот месяц выбрать нельзя.',
  closed: 'Этот месяц сейчас нельзя править.',
  derivative: 'Производная не найдена.',
  locked: 'Удалённую производную не меняют.',
  quantity: 'Укажите количество.',
};
