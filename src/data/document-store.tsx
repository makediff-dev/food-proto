"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { clearDocument, readDocument, writeDocument } from "@/data/document-storage";
import { createMockDocument } from "@/data/mock-document";
import type { PrototypeDocument } from "@/domain/document";

export type DocumentSource = "mock" | "local";

interface DocumentState {
  document: PrototypeDocument;
  source: DocumentSource;
  hydrated: boolean;
  storageError: string | null;
}

interface DocumentStoreValue extends DocumentState {
  updateDocument: (recipe: (current: PrototypeDocument) => PrototypeDocument) => void;
  resetToMock: () => void;
}

const DocumentStoreContext = createContext<DocumentStoreValue | null>(null);

const STORAGE_ERROR_MESSAGE =
  "Браузер не сохранил числа. Они пропадут после обновления страницы.";

function createInitialState(): DocumentState {
  return {
    document: createMockDocument(),
    source: "mock",
    hydrated: false,
    storageError: null,
  };
}

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(createInitialState);
  const documentRef = useRef(state.document);

  useLayoutEffect(() => {
    const stored = readDocument();
    if (stored) {
      documentRef.current = stored;
    }

    // localStorage нельзя читать на сервере. Подмена до paint, иначе мок вспыхивает поверх сохранённых чисел.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- гидрация внешнего хранилища до первой отрисовки
    setState((current) => ({
      ...current,
      document: stored ?? current.document,
      source: stored ? "local" : "mock",
      hydrated: true,
    }));
  }, []);

  const updateDocument = useCallback(
    (recipe: (current: PrototypeDocument) => PrototypeDocument) => {
      const next = recipe(documentRef.current);
      // Неудачная правка возвращает тот же документ и не должна затирать хранилище.
      if (next === documentRef.current) {
        return;
      }

      documentRef.current = next;

      let storageError: string | null = null;
      try {
        writeDocument(next);
      } catch {
        storageError = STORAGE_ERROR_MESSAGE;
      }

      setState((current) => ({
        ...current,
        document: next,
        source: "local",
        storageError,
      }));
    },
    [],
  );

  const resetToMock = useCallback(() => {
    try {
      clearDocument();
    } catch {
      setState((current) => ({ ...current, storageError: STORAGE_ERROR_MESSAGE }));
      return;
    }

    const next = createMockDocument();
    documentRef.current = next;
    setState((current) => ({
      ...current,
      document: next,
      source: "mock",
      storageError: null,
    }));
  }, []);

  const value = useMemo<DocumentStoreValue>(
    () => ({
      ...state,
      updateDocument,
      resetToMock,
    }),
    [state, updateDocument, resetToMock],
  );

  return (
    <DocumentStoreContext.Provider value={value}>
      {children}
    </DocumentStoreContext.Provider>
  );
}

export function useDocumentStore(): DocumentStoreValue {
  const store = useContext(DocumentStoreContext);
  if (!store) {
    throw new Error("useDocumentStore вызывается внутри DocumentProvider");
  }

  return store;
}
