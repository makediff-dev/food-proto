import { formatRubles } from '@/domain/units';

export function formatMoney(amount: number): string {
  return formatRubles(amount, true);
}
