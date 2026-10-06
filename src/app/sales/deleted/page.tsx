import type { Metadata } from 'next';

import { DeletedSalesScreen } from '@/features/sales-fact/deleted-sales-screen';
import { SALES_SECTION_TITLE } from '@/features/sales-fact/paths';

export const metadata: Metadata = {
  title: SALES_SECTION_TITLE,
};

export default function DeletedSalesPage() {
  return <DeletedSalesScreen />;
}
