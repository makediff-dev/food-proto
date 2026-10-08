import type { Metadata } from 'next';

import questions from '@/content/questions.json';
import { PageFrame } from '@/features/shell/page-frame';

const TITLE = 'Вопросы';

export const metadata: Metadata = {
  title: TITLE,
};

export default function QuestionsPage() {
  return (
    <PageFrame title={TITLE} lede="Открытые вопросы по прототипу.">
      {questions.length === 0 ? (
        <div className="border border-line bg-sheet px-4 py-4">
          <p className="text-sm text-ink">Пока вопросов нет.</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Добавьте строки в массив <code className="text-ink">src/content/questions.json</code>.
          </p>
        </div>
      ) : (
        <ol className="list-decimal space-y-3 border border-line bg-sheet px-4 py-4 pl-9 text-sm leading-6 text-ink">
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      )}
    </PageFrame>
  );
}
