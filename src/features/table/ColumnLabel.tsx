/** Предлоги, союзы и частицы, которые не оставляют в конце строки. */
const HANGING_WORDS = new Set([
  'а',
  'без',
  'бы',
  'в',
  'во',
  'для',
  'до',
  'же',
  'за',
  'и',
  'из',
  'к',
  'ко',
  'ли',
  'на',
  'не',
  'ни',
  'но',
  'о',
  'об',
  'от',
  'по',
  'под',
  'при',
  'с',
  'со',
  'у',
]);

export function keepWithNext(text: string): string {
  const parts = text.split(' ');
  let line = '';
  for (let index = 0; index < parts.length; index += 1) {
    line += parts[index] ?? '';
    if (index === parts.length - 1) {
      break;
    }
    const bare = (parts[index] ?? '').toLowerCase().replace(/^[^a-zа-яё]+|[^a-zа-яё]+$/gi, '');
    line += HANGING_WORDS.has(bare) ? '\u00A0' : ' ';
  }
  return line;
}

export function ColumnLabel({ label }: { label: string }) {
  const chunks = keepWithNext(label).split(' ');
  return (
    <span className="mx-auto block w-min text-center">
      {chunks.map((chunk) => (
        <span key={chunk} className="block whitespace-nowrap">
          {chunk}
        </span>
      ))}
    </span>
  );
}
