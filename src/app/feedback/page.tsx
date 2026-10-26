import type { Metadata } from 'next';

import { FeedbackPrototype } from '@/features/feedback/FeedbackPrototype';

export const metadata: Metadata = {
  title: 'Отклик — платформа обратной связи',
  description: 'Интерактивный прототип платформы для сбора и анализа отзывов в офлайн-бизнесе.',
};

export default function FeedbackPage() {
  return <FeedbackPrototype />;
}
