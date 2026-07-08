'use client';

import { CSSProperties, ReactNode, useId, useState } from 'react';

// Primitivas del RU.L Final Design System, reimplementadas con los tokens CSS (no dependen
// del bundle compilado del prototipo). Solo se usan en las rutas públicas de la encuesta.

/* ----------------------------- Button ----------------------------- */
type BtnVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type BtnSize = 'sm' | 'md' | 'lg';

const BTN_SIZES: Record<BtnSize, CSSProperties> = {
  sm: { fontSize: '0.8125rem', padding: '0.4375rem 0.875rem', gap: '0.375rem' },
  md: { fontSize: '0.9375rem', padding: '0.625rem 1.25rem', gap: '0.5rem' },
  lg: { fontSize: '1rem', padding: '0.9375rem 1.875rem', gap: '0.5rem' },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  pill?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const variants: Record<BtnVariant, CSSProperties> = {
    primary: {
      background: active ? 'var(--accent-900)' : hover ? 'var(--accent-600)' : 'var(--accent)',
      color: 'var(--text-onaccent)',
      borderColor: 'transparent',
    },
    secondary: {
      background: active ? 'var(--paper-200)' : hover ? 'var(--paper-100)' : 'var(--paper-50)',
      color: 'var(--text-primary)',
      borderColor: 'transparent',
    },
    outline: {
      background: hover ? 'var(--paper-50)' : 'transparent',
      color: 'var(--text-primary)',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)',
    },
    ghost: {
      background: hover ? 'var(--paper-50)' : 'transparent',
      color: hover ? 'var(--text-primary)' : 'var(--text-secondary)',
      borderColor: 'transparent',
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      className="ru-focus"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: BTN_SIZES[size].gap,
        fontFamily: 'var(--font-text)',
        fontWeight: 'var(--fw-medium)',
        fontSize: BTN_SIZES[size].fontSize,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        padding: BTN_SIZES[size].padding,
        minHeight: size === 'lg' ? '52px' : size === 'md' ? '44px' : 'auto',
        width: fullWidth ? '100%' : 'auto',
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-sm)',
        border: 'var(--rule-thin) solid transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease)',
        outline: 'none',
        opacity: disabled ? 0.4 : 1,
        ...variants[variant],
      }}
    >
      {children}
    </button>
  );
}

/* ----------------------------- Badge ------------------------------ */
export function Badge({ children, tone = 'neutral', dot = false }: { children: ReactNode; tone?: 'neutral' | 'accent'; dot?: boolean }) {
  const t =
    tone === 'accent'
      ? { ink: 'var(--accent)', bg: 'var(--accent-tint)' }
      : { ink: 'var(--ink-500)', bg: 'var(--paper-100)' };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4375rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 'var(--fw-regular)',
        fontSize: 'var(--text-mono-sm)',
        letterSpacing: 'var(--tracking-mono)',
        lineHeight: 1,
        padding: '0.375rem 0.625rem',
        borderRadius: 'var(--radius-pill)',
        color: t.ink,
        background: t.bg,
        border: 'var(--rule-thin) solid transparent',
      }}
    >
      {dot ? <span style={{ width: 6, height: 6, borderRadius: '999px', background: t.ink }} /> : null}
      {children}
    </span>
  );
}

/* ----------------------------- Input ------------------------------ */
export function Input({
  label,
  value,
  onChange,
  type = 'text',
  mono = false,
  placeholder,
  maxLength,
  inputMode,
  id,
  required,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'number';
  mono?: boolean;
  placeholder?: string;
  maxLength?: number;
  inputMode?: 'numeric' | 'text';
  id?: string;
  required?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4375rem', width: '100%' }}>
      {label ? (
        <label
          htmlFor={inputId}
          style={{ fontFamily: 'var(--font-text)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
        >
          {label}
          {required ? <span style={{ color: 'var(--accent)', marginLeft: '0.25rem' }}>*</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-text)',
          fontSize: mono ? 'var(--text-mono)' : 'var(--text-sm)',
          letterSpacing: mono ? 'var(--tracking-mono)' : 'normal',
          color: 'var(--text-primary)',
          background: focus ? 'var(--white)' : 'var(--paper-50)',
          border: `var(--rule-thin) solid ${focus ? 'var(--accent)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          minHeight: '48px',
          outline: 'none',
          boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
          width: '100%',
          transition: 'border-color var(--dur) var(--ease), background var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
        }}
      />
    </div>
  );
}

/* --------------------------- SelectField -------------------------- */
const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none' stroke='%236E6E73' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='4 6 8 10 12 6'/%3E%3C/svg%3E\")";

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccione…',
  id,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[] | { valor: string; etiqueta: string }[];
  placeholder?: string;
  id?: string;
  required?: boolean;
}) {
  const autoId = useId();
  const selectId = id || autoId;
  const opts = options.map((o) => (typeof o === 'string' ? { valor: o, etiqueta: o } : o));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4375rem' }}>
      <label htmlFor={selectId} style={{ fontFamily: 'var(--font-text)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
        {label}
        {required ? <span style={{ color: 'var(--accent)', marginLeft: '0.25rem' }}>*</span> : null}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ru-select"
        style={
          {
            fontFamily: 'var(--font-text)',
            fontSize: 'var(--text-sm)',
            color: value ? 'var(--text-primary)' : 'var(--text-muted)',
            background: `var(--paper-50) ${CHEVRON} no-repeat right 12px center`,
            border: 'var(--rule-thin) solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 2.25rem 0.75rem 0.75rem',
            minHeight: '48px',
            width: '100%',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            transition: 'border-color var(--dur) var(--ease), background var(--dur) var(--ease), box-shadow var(--dur) var(--ease)',
          } as CSSProperties
        }
      >
        <option value="">{placeholder}</option>
        {opts.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
    </div>
  );
}

/* --------------------------- ChoiceOption ------------------------- */
export function ChoiceOption({
  label,
  selected,
  onSelect,
  size = 'lg',
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  size?: 'lg' | 'sm';
}) {
  const big = size === 'lg';
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="ru-focus"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        textAlign: 'left',
        minHeight: big ? '56px' : '52px',
        padding: big ? '1rem 1.125rem' : '0.75rem 1rem',
        fontFamily: 'var(--font-text)',
        fontSize: big ? 'var(--text-body)' : 'var(--text-sm)',
        fontWeight: selected ? 'var(--fw-semibold)' : 'var(--fw-medium)',
        color: selected ? 'var(--text-onaccent)' : 'var(--text-primary)',
        background: selected ? 'var(--accent)' : 'var(--paper-50)',
        border: `var(--rule-thin) solid ${selected ? 'var(--accent)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease)',
      }}
    >
      <span
        aria-hidden
        style={{
          width: 14,
          height: 14,
          borderRadius: '999px',
          flex: '0 0 auto',
          border: selected ? 'none' : '1.5px solid var(--line-strong)',
          background: selected ? 'var(--white)' : 'transparent',
        }}
      />
      <span>{label}</span>
    </button>
  );
}

/* ------------------------------- Chip ----------------------------- */
export function Chip({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="ru-focus"
      style={{
        padding: '0.5rem 1rem',
        minHeight: '48px',
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--text-sm)',
        fontWeight: selected ? 'var(--fw-semibold)' : 'var(--fw-medium)',
        color: selected ? 'var(--text-onaccent)' : 'var(--text-primary)',
        background: selected ? 'var(--accent)' : 'var(--paper-50)',
        border: `var(--rule-thin) solid ${selected ? 'var(--accent)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: 'background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease)',
      }}
    >
      {label}
    </button>
  );
}

/* --------------------- Chrome: progress + masthead ---------------- */
export function ProgressHairline({ pct }: { pct: number }) {
  return (
    <div style={{ width: '100%', height: 3, background: 'var(--paper-100)' }}>
      <div className="ru-prog-fill" style={{ height: '100%', background: 'var(--accent)', width: `${pct}%` }} />
    </div>
  );
}

export function Masthead({ sectionLabel }: { sectionLabel: string }) {
  const mono: CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-mono-sm)',
    letterSpacing: 'var(--tracking-mono)',
  };
  return (
    <div style={{ width: '100%', borderBottom: 'var(--rule-thin) solid var(--border-faint)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ ...mono, color: 'var(--text-secondary)' }}>encuesta · capacidades legales</span>
        <span style={{ ...mono, color: 'var(--text-muted)' }}>{sectionLabel}</span>
      </div>
    </div>
  );
}

/* --------------------------- Small helpers ------------------------ */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-text)',
        fontWeight: 'var(--fw-semibold)',
        fontSize: 'var(--text-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}
    >
      {children}
    </div>
  );
}

export function CampoLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-text)', fontWeight: 'var(--fw-medium)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 10 }}>
      {children}
    </div>
  );
}

export function HeavyBar({ center = false }: { center?: boolean }) {
  return <div style={{ width: 44, height: 6, background: 'var(--accent)', borderRadius: 2, margin: center ? '0 auto 32px' : '0 0 28px' }} />;
}
