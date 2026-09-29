"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type ReactNode } from "react";

import { priceExVatKopecks } from "@/domain/cost";
import { MAX_LABEL_LENGTH, MAX_VAT_PERCENT, MIN_VAT_PERCENT } from "@/domain/document";
import { activeWarehouses, activeWorkshops, normalizeName } from "@/domain/directory";
import type { FieldRejection } from "@/domain/materials";
import { formatRublesFromKopecks } from "@/domain/units";
import {
  FIELD_ERROR,
  fieldClassName,
  parseKopecks,
  parseStockQuantity,
  parseWholePercent,
  primaryButtonClassName,
} from "@/features/materials/fields";
import { derivativeDetailHref, type MaterialKind } from "@/features/materials/paths";
import { useMaterials } from "@/features/materials/use-materials";
import { Dialog } from "@/features/shell/dialog";
import { IconPlus } from "@/features/shell/icons";

type FieldKey =
  "name" | "brand" | "warehouse" | "workshop" | "price" | "vat" | "minStock" | "maxStock";

export function CreateEntryDialog({
  kind,
  onClose,
}: {
  kind: MaterialKind;
  onClose: () => void;
}) {
  const title =
    kind === "materials"
      ? "Новое сырьё"
      : kind === "products"
        ? "Новый товар"
        : "Новая производная";

  return (
    <Dialog title={title} onClose={onClose}>
      {kind === "materials" ? (
        <MaterialFields onClose={onClose} />
      ) : (
        <DerivativeFields onClose={onClose} isFinalProduct={kind === "products"} />
      )}
    </Dialog>
  );
}

function MaterialFields({ onClose }: { onClose: () => void }) {
  const catalog = useMaterials();
  const warehouses = activeWarehouses(catalog.document);
  const nameId = useId();
  const brandId = useId();
  const warehouseId = useId();
  const priceId = useId();
  const vatId = useId();
  const minStockId = useId();
  const maxStockId = useId();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [price, setPrice] = useState("");
  const [vat, setVat] = useState("");
  const [minStock, setMinStock] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [unit, setUnit] = useState<"kg" | "piece">("kg");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const kopecks = parseKopecks(price);
  const vatPercent = parseWholePercent(vat);
  const exVat =
    kopecks !== null &&
    vatPercent !== null &&
    vatPercent >= MIN_VAT_PERCENT &&
    vatPercent <= MAX_VAT_PERCENT
      ? priceExVatKopecks({
          id: "preview",
          name: "Черновик",
          brand: "",
          warehouseId: "preview",
          unit,
          priceWithVatKopecks: kopecks,
          vatPercent,
          minNormStock: 0,
          maxNormStock: 0,
          deletedAt: null,
        })
      : null;

  function clear(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function submit() {
    const next: Partial<Record<FieldKey, string>> = {};
    if (normalizeName(name).length === 0) {
      next.name = FIELD_ERROR.empty;
    }
    if (brand.trim().length > MAX_LABEL_LENGTH) {
      next.brand = FIELD_ERROR.brand;
    }
    if (warehouses.length === 0) {
      next.warehouse = "Сначала добавьте склад в разделе «Цеха и склады».";
    } else if (!warehouse) {
      next.warehouse = FIELD_ERROR.warehouse;
    }
    const priceKopecks = parseKopecks(price);
    if (priceKopecks === null) {
      next.price = FIELD_ERROR.price;
    }
    const vatValue = parseWholePercent(vat);
    if (vatValue === null || vatValue < MIN_VAT_PERCENT || vatValue > MAX_VAT_PERCENT) {
      next.vat = FIELD_ERROR.vat;
    }
    const minNormStock = parseStockQuantity(minStock, unit);
    const maxNormStock = parseStockQuantity(maxStock, unit);
    if (minNormStock === null) {
      next.minStock = FIELD_ERROR.stock;
    }
    if (maxNormStock === null) {
      next.maxStock = FIELD_ERROR.stock;
    }
    if (minNormStock !== null && maxNormStock !== null && minNormStock > maxNormStock) {
      next.maxStock = FIELD_ERROR["stock-range"];
    }
    if (
      Object.keys(next).length > 0 ||
      priceKopecks === null ||
      vatValue === null ||
      minNormStock === null ||
      maxNormStock === null
    ) {
      setErrors(next);
      return;
    }

    const rejection = catalog.addMaterial(`material:${crypto.randomUUID()}`, {
      name,
      brand,
      warehouseId: warehouse,
      unit,
      priceWithVatKopecks: priceKopecks,
      vatPercent: vatValue,
      minNormStock,
      maxNormStock,
    });
    if (rejection) {
      setErrors(placeMaterialError(rejection));
      return;
    }

    onClose();
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <FormField id={nameId} label="Название" error={errors.name}>
        <input
          id={nameId}
          value={name}
          maxLength={MAX_LABEL_LENGTH}
          autoComplete="off"
          placeholder="Название сырья"
          aria-invalid={errors.name ? true : undefined}
          onChange={(event) => {
            setName(event.target.value);
            clear("name");
          }}
          className={fieldClassName}
        />
      </FormField>
      <FormField
        id={brandId}
        label="Бренд, производитель"
        hint="Справочно"
        error={errors.brand}
      >
        <input
          id={brandId}
          value={brand}
          maxLength={MAX_LABEL_LENGTH}
          autoComplete="off"
          aria-invalid={errors.brand ? true : undefined}
          onChange={(event) => {
            setBrand(event.target.value);
            clear("brand");
          }}
          className={fieldClassName}
        />
      </FormField>
      <FormField id={warehouseId} label="Склад хранения" error={errors.warehouse}>
        <select
          id={warehouseId}
          value={warehouse}
          disabled={warehouses.length === 0}
          aria-invalid={errors.warehouse ? true : undefined}
          onChange={(event) => {
            setWarehouse(event.target.value);
            clear("warehouse");
          }}
          className={fieldClassName}
        >
          <option value="">Выберите склад</option>
          {warehouses.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </FormField>
      <div>
        <p className="text-sm text-muted">Единица</p>
        <div className="mt-1.5 grid grid-cols-2 border border-line bg-paper p-1">
          <Choice selected={unit === "kg"} onClick={() => setUnit("kg")}>
            кг
          </Choice>
          <Choice selected={unit === "piece"} onClick={() => setUnit("piece")}>
            шт
          </Choice>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          id={priceId}
          label={`Плановая цена с НДС, ₽/${unit === "piece" ? "шт" : "кг"}`}
          error={errors.price}
        >
          <input
            id={priceId}
            value={price}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            aria-invalid={errors.price ? true : undefined}
            onChange={(event) => {
              setPrice(event.target.value);
              clear("price");
            }}
            className={fieldClassName}
          />
        </FormField>
        <FormField id={vatId} label="НДС, %" error={errors.vat}>
          <input
            id={vatId}
            value={vat}
            inputMode="numeric"
            autoComplete="off"
            placeholder="10"
            aria-invalid={errors.vat ? true : undefined}
            onChange={(event) => {
              setVat(event.target.value);
              clear("vat");
            }}
            className={fieldClassName}
          />
        </FormField>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          id={minStockId}
          label={`Минимальный нормативный остаток, ${unit === "piece" ? "шт" : "кг"}`}
          error={errors.minStock}
        >
          <input
            id={minStockId}
            value={minStock}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            aria-invalid={errors.minStock ? true : undefined}
            onChange={(event) => {
              setMinStock(event.target.value);
              clear("minStock");
            }}
            className={fieldClassName}
          />
        </FormField>
        <FormField
          id={maxStockId}
          label={`Максимальный нормативный остаток, ${unit === "piece" ? "шт" : "кг"}`}
          error={errors.maxStock}
        >
          <input
            id={maxStockId}
            value={maxStock}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            aria-invalid={errors.maxStock ? true : undefined}
            onChange={(event) => {
              setMaxStock(event.target.value);
              clear("maxStock");
            }}
            className={fieldClassName}
          />
        </FormField>
      </div>
      <p className="text-sm text-ink">
        {kopecks !== null && exVat !== null
          ? `${formatRublesFromKopecks(kopecks, true)} с НДС · ${formatRublesFromKopecks(exVat, true)} без НДС за ${unit === "piece" ? "шт" : "кг"}`
          : "Цена без НДС появится после цены с НДС и ставки."}
      </p>
      <button
        type="submit"
        disabled={!catalog.hydrated}
        className={`w-full sm:w-auto ${primaryButtonClassName}`}
      >
        <IconPlus />
        Добавить сырьё
      </button>
    </form>
  );
}

function DerivativeFields({
  onClose,
  isFinalProduct,
}: {
  onClose: () => void;
  isFinalProduct: boolean;
}) {
  const catalog = useMaterials();
  const router = useRouter();
  const warehouses = activeWarehouses(catalog.document);
  const workshops = activeWorkshops(catalog.document);
  const nameId = useId();
  const warehouseId = useId();
  const workshopId = useId();
  const vatId = useId();
  const [name, setName] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [workshop, setWorkshop] = useState("");
  const [vat, setVat] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  function clear(key: FieldKey) {
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function submit() {
    const next: Partial<Record<FieldKey, string>> = {};
    if (normalizeName(name).length === 0) {
      next.name = FIELD_ERROR.empty;
    }
    if (warehouses.length === 0) {
      next.warehouse = "Сначала добавьте склад в разделе «Цеха и склады».";
    } else if (!warehouse) {
      next.warehouse = FIELD_ERROR.warehouse;
    }
    if (workshops.length === 0) {
      next.workshop = "Сначала добавьте цех в разделе «Цеха и склады».";
    } else if (!workshop) {
      next.workshop = FIELD_ERROR.workshop;
    }
    const vatPercent = isFinalProduct ? parseWholePercent(vat) : null;
    if (
      isFinalProduct &&
      (vatPercent === null ||
        vatPercent < MIN_VAT_PERCENT ||
        vatPercent > MAX_VAT_PERCENT)
    ) {
      next.vat = FIELD_ERROR.vat;
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const id = `derivative:${crypto.randomUUID()}`;
    const rejection = catalog.addDerivative(id, {
      name,
      isFinalProduct,
      warehouseId: warehouse,
      workshopId: workshop,
      vatPercent,
    });
    if (rejection) {
      setErrors(placeDerivativeError(rejection));
      return;
    }

    onClose();
    router.push(derivativeDetailHref(id));
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <FormField id={nameId} label="Название" error={errors.name}>
        <input
          id={nameId}
          value={name}
          maxLength={MAX_LABEL_LENGTH}
          autoComplete="off"
          placeholder="Название"
          aria-invalid={errors.name ? true : undefined}
          onChange={(event) => {
            setName(event.target.value);
            clear("name");
          }}
          className={fieldClassName}
        />
      </FormField>
      <FormField id={warehouseId} label="Склад хранения" error={errors.warehouse}>
        <select
          id={warehouseId}
          value={warehouse}
          disabled={warehouses.length === 0}
          aria-invalid={errors.warehouse ? true : undefined}
          onChange={(event) => {
            setWarehouse(event.target.value);
            clear("warehouse");
          }}
          className={fieldClassName}
        >
          <option value="">Выберите склад</option>
          {warehouses.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField id={workshopId} label="Цех производства" error={errors.workshop}>
        <select
          id={workshopId}
          value={workshop}
          disabled={workshops.length === 0}
          aria-invalid={errors.workshop ? true : undefined}
          onChange={(event) => {
            setWorkshop(event.target.value);
            clear("workshop");
          }}
          className={fieldClassName}
        >
          <option value="">Выберите цех</option>
          {workshops.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </FormField>
      {isFinalProduct ? (
        <FormField id={vatId} label="НДС, %" error={errors.vat}>
          <input
            id={vatId}
            value={vat}
            inputMode="numeric"
            autoComplete="off"
            placeholder="20"
            aria-invalid={errors.vat ? true : undefined}
            onChange={(event) => {
              setVat(event.target.value);
              clear("vat");
            }}
            className={fieldClassName}
          />
        </FormField>
      ) : null}
      <button
        type="submit"
        disabled={!catalog.hydrated}
        className={`w-full sm:w-auto ${primaryButtonClassName}`}
      >
        <IconPlus />
        {isFinalProduct ? "Добавить товар" : "Добавить производную"}
      </button>
    </form>
  );
}

function placeMaterialError(
  rejection: FieldRejection,
): Partial<Record<FieldKey, string>> {
  if (rejection === "empty" || rejection === "too-long" || rejection === "duplicate") {
    return { name: FIELD_ERROR[rejection] };
  }
  if (
    rejection === "brand" ||
    rejection === "warehouse" ||
    rejection === "price" ||
    rejection === "vat"
  ) {
    return { [rejection]: FIELD_ERROR[rejection] };
  }
  if (rejection === "stock") {
    return { minStock: FIELD_ERROR.stock };
  }
  if (rejection === "stock-range") {
    return { maxStock: FIELD_ERROR["stock-range"] };
  }
  return { name: FIELD_ERROR[rejection] };
}

function placeDerivativeError(
  rejection: FieldRejection,
): Partial<Record<FieldKey, string>> {
  if (rejection === "empty" || rejection === "too-long" || rejection === "duplicate") {
    return { name: FIELD_ERROR[rejection] };
  }
  if (rejection === "warehouse" || rejection === "workshop" || rejection === "vat") {
    return { [rejection]: FIELD_ERROR[rejection] };
  }
  return { name: FIELD_ERROR[rejection] };
}

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-10 px-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        selected ? "bg-ink text-white" : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="text-sm text-muted">
        {label}
        {hint ? ` · ${hint}` : ""}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}
