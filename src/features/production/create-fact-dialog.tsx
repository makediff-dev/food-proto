"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";

import { MAX_LABEL_LENGTH } from "@/domain/document";
import { activeFactOnDate } from "@/domain/production-fact";
import { fieldClassName, primaryButtonClassName } from "@/features/materials/fields";
import { factHref } from "@/features/production/paths";
import { FACT_ERROR, defaultFactDate, monthDateBounds } from "@/features/production/text";
import { useProductionFact } from "@/features/production/use-production";
import { Dialog } from "@/features/shell/dialog";
import { IconPlus } from "@/features/shell/icons";

export function CreateFactDialog({
  month,
  today,
  onClose,
}: {
  month: string;
  today: Date;
  onClose: () => void;
}) {
  const production = useProductionFact();
  const router = useRouter();
  const dateId = useId();
  const noteId = useId();
  const bounds = monthDateBounds(month);
  const [id] = useState(() => `fact:${crypto.randomUUID()}`);
  const [occurredOn, setOccurredOn] = useState(() => defaultFactDate(month, today));
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const existing = useMemo(
    () => activeFactOnDate(production.document, occurredOn),
    [occurredOn, production.document],
  );

  function submit() {
    if (pending) {
      return;
    }

    if (!occurredOn.startsWith(`${month}-`)) {
      setError("Выберите день этого месяца.");
      return;
    }

    const rejection = production.addFact(id, { occurredOn, note });
    if (rejection) {
      setError(FACT_ERROR[rejection]);
      return;
    }

    setPending(true);
    router.push(factHref(id));
  }

  return (
    <Dialog title="Новый день" onClose={onClose}>
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div>
          <label htmlFor={dateId} className="text-sm text-muted">
            Дата
          </label>
          <input
            id={dateId}
            type="date"
            value={occurredOn}
            min={bounds.min}
            max={bounds.max}
            onChange={(event) => {
              setOccurredOn(event.target.value);
              setError(null);
            }}
            className={`mt-2 ${fieldClassName}`}
          />
        </div>
        <div>
          <label htmlFor={noteId} className="text-sm text-muted">
            Пометка
          </label>
          <input
            id={noteId}
            value={note}
            maxLength={MAX_LABEL_LENGTH}
            autoComplete="off"
            placeholder="Необязательно"
            onChange={(event) => {
              setNote(event.target.value);
              setError(null);
            }}
            className={`mt-2 ${fieldClassName}`}
          />
        </div>
        {error ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-ink">{error}</p>
            {existing ? (
              <Link
                href={factHref(existing.id)}
                className="text-sm text-ink underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Открыть запись
              </Link>
            ) : null}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={pending || !production.hydrated}
          className={`w-full sm:w-auto ${primaryButtonClassName}`}
        >
          <IconPlus />
          Добавить день
        </button>
      </form>
    </Dialog>
  );
}
