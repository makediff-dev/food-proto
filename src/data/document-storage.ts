import {
  type PrototypeDocument,
  parsePrototypeDocument,
  SCHEMA_VERSION,
} from '@/domain/document';

export const DOCUMENT_STORAGE_KEY = `food-proto:document:v${SCHEMA_VERSION}`;

export class DocumentStorageError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'DocumentStorageError';
  }
}

export function readDocument(): PrototypeDocument | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(DOCUMENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return parsePrototypeDocument(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function writeDocument(document: PrototypeDocument): void {
  try {
    window.localStorage.setItem(DOCUMENT_STORAGE_KEY, JSON.stringify(document));
  } catch (cause) {
    throw new DocumentStorageError(
      'Не удалось записать документ в localStorage',
      {
        cause,
      },
    );
  }
}

export function clearDocument(): void {
  try {
    window.localStorage.removeItem(DOCUMENT_STORAGE_KEY);
  } catch (cause) {
    throw new DocumentStorageError(
      'Не удалось стереть документ из localStorage',
      {
        cause,
      },
    );
  }
}
