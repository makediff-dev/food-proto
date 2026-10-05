import type { ReactNode } from 'react';

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      {children}
    </svg>
  );
}

export function IconClose() {
  return (
    <Glyph>
      <path d="M5 5l10 10M15 5 5 15" />
    </Glyph>
  );
}

export function IconPlus() {
  return (
    <Glyph>
      <path d="M10 4v12M4 10h12" />
    </Glyph>
  );
}

export function IconTrash() {
  return (
    <Glyph>
      <path d="M4 6h12M7 6V4h6v2M6 6l.7 10h6.6L14 6" />
    </Glyph>
  );
}

export function IconUndo() {
  return (
    <Glyph>
      <path d="M7 7H4v3" />
      <path d="M4 8a6 6 0 1 1 1.2 5.5" />
    </Glyph>
  );
}

// Не вызывается: каталог сырья, производных и отдельных экранов плана/факта убран.
// export function IconArrowLeft() {
//   return (
//     <Glyph>
//       <path d="M12 4 6 10l6 6M6 10h10" />
//     </Glyph>
//   );
// }

export function IconChevronLeft() {
  return (
    <Glyph>
      <path d="M12 4 6 10l6 6" />
    </Glyph>
  );
}

export function IconChevronRight() {
  return (
    <Glyph>
      <path d="M8 4l6 6-6 6" />
    </Glyph>
  );
}

export function IconChevronUp() {
  return (
    <Glyph>
      <path d="M4 12l6-6 6 6" />
    </Glyph>
  );
}

export function IconChevronDown() {
  return (
    <Glyph>
      <path d="M4 8l6 6 6-6" />
    </Glyph>
  );
}

export function IconMenu() {
  return (
    <Glyph>
      <path d="M3 6h14M3 10h14M3 14h14" />
    </Glyph>
  );
}

// Не вызывается: каталог сырья, производных и отдельных экранов плана/факта убран.
// export function IconMaterial() {
//   return (
//     <Glyph>
//       <path d="M4 8h12v8H4V8zM4 8l6-4 6 4" />
//     </Glyph>
//   );
// }
//
// export function IconDerivative() {
//   return (
//     <Glyph>
//       <path d="M3 8h9v9H3V8zM8 4h9v9" />
//     </Glyph>
//   );
// }
//
// export function IconProduct() {
//   return (
//     <Glyph>
//       <path d="M4 7h12v9H4V7zM7 7V4h6v3" />
//     </Glyph>
//   );
// }
//
// export function IconCheck() {
//   return (
//     <Glyph>
//       <path d="M4 10l4 4 8-8" />
//     </Glyph>
//   );
// }

export function IconPlan() {
  return (
    <Glyph>
      <path d="M4 5h12v11H4V5zM4 8h12M7 3v4M13 3v4" />
    </Glyph>
  );
}

export function IconEye() {
  return (
    <Glyph>
      <path d="M2 10c2.4-3.4 4.8-4.6 8-4.6s5.6 1.2 8 4.6c-2.4 3.4-4.8 4.6-8 4.6s-5.6-1.2-8-4.6z" />
      <path d="M8.8 8.8h2.4v2.4H8.8z" />
    </Glyph>
  );
}

// Не вызывается: каталог сырья, производных и отдельных экранов плана/факта убран.
// export function IconEyeOff() {
//   return (
//     <Glyph>
//       <path d="M2 10c2.4-3.4 4.8-4.6 8-4.6s5.6 1.2 8 4.6c-2.4 3.4-4.8 4.6-8 4.6s-5.6-1.2-8-4.6z" />
//       <path d="M4 16 16 4" />
//     </Glyph>
//   );
// }
//
// export function IconOrder() {
//   return (
//     <Glyph>
//       <path d="M5 3h8l3 3v11H5V3zM13 3v3h3M7 10h6M7 13h4" />
//     </Glyph>
//   );
// }
//
// export function IconFact() {
//   return (
//     <Glyph>
//       <path d="M6 3h8v14H6V3zM8 7h4M8 10h4M8 13h3" />
//     </Glyph>
//   );
// }
//
// export function IconLamp() {
//   return (
//     <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 shrink-0">
//       <circle cx="10" cy="10" r="4" fill="currentColor" />
//     </svg>
//   );
// }

export function IconFullscreen() {
  return (
    <Glyph>
      <path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4" />
    </Glyph>
  );
}

export function IconFullscreenExit() {
  return (
    <Glyph>
      <path d="M7 3v4H3M17 7h-4V3M13 17v-4h4M3 13h4v4" />
    </Glyph>
  );
}

export function IconRuble({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className ?? 'size-4 shrink-0'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M7 4h5.5a3.5 3.5 0 0 1 0 7H7" />
      <path d="M7 4v13M5.5 11H12M5.5 14H11" />
    </svg>
  );
}
