/* @ds-bundle: {"format":4,"namespace":"RULDesignSystem_533834","components":[{"name":"DocumentCard","sourcePath":"components/data/DocumentCard.jsx"},{"name":"MatterStatus","sourcePath":"components/data/MatterStatus.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"ScoreDial","sourcePath":"components/instrument/ScoreDial.jsx"}],"sourceHashes":{"components/data/DocumentCard.jsx":"356c13aa4715","components/data/MatterStatus.jsx":"7775429fe7af","components/data/Table.jsx":"bcceb4f8b4f8","components/feedback/Badge.jsx":"cce329d8d92d","components/feedback/EmptyState.jsx":"10ca46e09ad1","components/feedback/Toast.jsx":"0a7fc06a7c55","components/forms/Button.jsx":"76fcf3495f4a","components/forms/Input.jsx":"07c1b96fbe35","components/instrument/ScoreDial.jsx":"137c75b7f1e0","ui_kits/audit/AuditChrome.jsx":"176d7ffbe296","ui_kits/audit/InstrumentScreen.jsx":"e49a713f1578","ui_kits/audit/LandingScreen.jsx":"9bdc7b5c0d80","ui_kits/audit/ResultScreen.jsx":"d22ff4b500b3","ui_kits/matter-portal/DashboardScreen.jsx":"ffc18f3b5bd3","ui_kits/matter-portal/EntryScreen.jsx":"bbedf87f7e02","ui_kits/matter-portal/MatterDetailScreen.jsx":"a731f3a3ac18","ui_kits/matter-portal/PortalChrome.jsx":"35b44eb5b0c2"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RULDesignSystem_533834 = window.RULDesignSystem_533834 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/DocumentCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L DocumentCard — a document as a clean white card. Thin hairline,
 * modest radius, restrained shadow that lifts a touch on hover. Mono
 * reference line, grotesque title, quiet metadata. Optional status and a
 * cobalt left rule for the one document that needs attention.
 */
function DocumentCard({
  title,
  reference,
  kind,
  meta,
  updated,
  status,
  accent = false,
  onClick,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const interactive = !!onClick;
  return /*#__PURE__*/React.createElement("article", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      background: 'var(--bg-surface)',
      border: 'var(--rule-thin) solid var(--border-default)',
      borderLeft: accent ? 'var(--rule-medium) solid var(--accent)' : undefined,
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem 1.375rem',
      cursor: interactive ? 'pointer' : 'default',
      boxShadow: hover && interactive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      transform: hover && interactive ? 'translateY(-1px)' : 'translateY(0)',
      transition: 'box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease), border-color var(--dur) var(--ease)',
      borderColor: hover && interactive ? 'var(--border-strong)' : 'var(--border-default)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      minWidth: 0
    }
  }, reference && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-mono-sm)',
      letterSpacing: 'var(--tracking-mono)',
      color: 'var(--text-muted)'
    }
  }, reference), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-h4)',
      lineHeight: 'var(--lh-heading)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-primary)'
    }
  }, title)), status && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto'
    }
  }, status)), children, (kind || meta || updated) && /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      paddingTop: '0.75rem',
      borderTop: 'var(--rule-thin) solid var(--line-faint)',
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, kind && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-secondary)'
    }
  }, kind), kind && (meta || updated) && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\xB7"), meta && /*#__PURE__*/React.createElement("span", null, meta), meta && updated && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\xB7"), updated && /*#__PURE__*/React.createElement("span", null, updated)));
}
Object.assign(__ds_scope, { DocumentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DocumentCard.jsx", error: String((e && e.message) || e) }); }

// components/data/MatterStatus.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L MatterStatus — the lifecycle indicator for a legal matter.
 * A clean tinted capsule with a small dot. Stages: drafting → review
 * (partner review) → delivered, plus hold. Bilingual by default (es).
 */
const STAGES = {
  drafting: {
    es: 'En redacción',
    en: 'Drafting',
    ink: 'var(--status-drafting-ink)',
    bg: 'var(--status-drafting-bg)'
  },
  review: {
    es: 'Revisión del socio',
    en: 'Partner review',
    ink: 'var(--status-review-ink)',
    bg: 'var(--status-review-bg)'
  },
  delivered: {
    es: 'Entregado',
    en: 'Delivered',
    ink: 'var(--status-delivered-ink)',
    bg: 'var(--status-delivered-bg)'
  },
  hold: {
    es: 'En pausa',
    en: 'On hold',
    ink: 'var(--status-hold-ink)',
    bg: 'var(--status-hold-bg)'
  }
};
function MatterStatus({
  stage = 'drafting',
  lang = 'es',
  label,
  variant = 'capsule',
  style,
  ...rest
}) {
  const s = STAGES[stage] || STAGES.drafting;
  const text = label || (lang === 'en' ? s.en : s.es);
  const dot = /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '0.4375rem',
      height: '0.4375rem',
      borderRadius: 'var(--radius-pill)',
      background: s.ink,
      flex: '0 0 auto'
    }
  });
  const labelEl = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-medium)',
      fontSize: 'var(--text-sm)',
      letterSpacing: '-0.005em',
      lineHeight: 1,
      color: s.ink
    }
  }, text);
  if (variant === 'inline') {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4375rem',
        ...style
      }
    }, rest), dot, labelEl);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4375rem',
      padding: '0.375rem 0.6875rem',
      background: s.bg,
      borderRadius: 'var(--radius-pill)',
      ...style
    }
  }, rest), dot, labelEl);
}
MatterStatus.stages = Object.keys(STAGES);
Object.assign(__ds_scope, { MatterStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/MatterStatus.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L Table — clean data table. Light grey header row, hairline dividers,
 * no vertical lines. Numbers, folios and codes set in mono tabular figures.
 *
 * columns: [{ key, header, align?, mono?, width?, render? }]
 */
function Table({
  columns = [],
  rows = [],
  onRowClick,
  getRowKey,
  emptyLabel = 'Sin registros.',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-text)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '0.75rem 1rem',
      background: 'var(--paper-50)',
      borderBottom: 'var(--rule-thin) solid var(--line)',
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0',
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      width: c.width
    }
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length,
    style: {
      padding: '2rem 1rem',
      textAlign: 'center',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, emptyLabel)), rows.map((row, i) => {
    const key = getRowKey ? getRowKey(row, i) : row.id ?? i;
    const isHover = hover === key && onRowClick;
    return /*#__PURE__*/React.createElement("tr", {
      key: key,
      onClick: onRowClick ? () => onRowClick(row) : undefined,
      onMouseEnter: () => setHover(key),
      onMouseLeave: () => setHover(null),
      style: {
        cursor: onRowClick ? 'pointer' : 'default',
        background: isHover ? 'var(--bg-hover)' : 'transparent',
        transition: 'background var(--dur) var(--ease)'
      }
    }, columns.map(c => /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        textAlign: c.align || 'left',
        padding: '0.875rem 1rem',
        borderBottom: 'var(--rule-thin) solid var(--line-faint)',
        fontFamily: c.mono ? 'var(--font-mono)' : 'var(--font-text)',
        fontSize: c.mono ? 'var(--text-mono)' : 'var(--text-sm)',
        fontVariantNumeric: c.mono ? 'tabular-nums' : 'normal',
        letterSpacing: c.mono ? 'var(--tracking-mono)' : 'normal',
        color: 'var(--text-body)',
        verticalAlign: 'middle'
      }
    }, c.render ? c.render(row[c.key], row) : row[c.key])));
  })));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L Badge — a compact chip for classifications, counts, jurisdictions,
 * audit findings. Clean pill or square. Tones map to the calm semantic
 * palette. Optional leading dot. For matter lifecycle use MatterStatus.
 */
function Badge({
  children,
  tone = 'neutral',
  variant = 'tint',
  dot = false,
  shape = 'pill',
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      ink: 'var(--ink-500)',
      bg: 'var(--paper-100)',
      line: 'var(--line-strong)'
    },
    accent: {
      ink: 'var(--accent)',
      bg: 'var(--accent-tint)',
      line: 'var(--accent)'
    },
    success: {
      ink: 'var(--success-ink)',
      bg: 'var(--success-bg)',
      line: 'var(--success-ink)'
    },
    warning: {
      ink: 'var(--warning-ink)',
      bg: 'var(--warning-bg)',
      line: 'var(--warning-ink)'
    },
    danger: {
      ink: 'var(--danger-ink)',
      bg: 'var(--danger-bg)',
      line: 'var(--danger-ink)'
    },
    info: {
      ink: 'var(--info-ink)',
      bg: 'var(--info-bg)',
      line: 'var(--info-ink)'
    }
  };
  const t = tones[tone] || tones.neutral;
  const isSolid = variant === 'solid';
  const isOutline = variant === 'outline';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4375rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--fw-regular)',
      fontSize: 'var(--text-mono-sm)',
      letterSpacing: 'var(--tracking-mono)',
      lineHeight: 1,
      padding: '0.375rem 0.625rem',
      borderRadius: shape === 'square' ? 'var(--radius-sm)' : 'var(--radius-pill)',
      color: isSolid ? 'var(--white)' : t.ink,
      background: isSolid ? t.ink : isOutline ? 'transparent' : t.bg,
      border: `var(--rule-thin) solid ${isOutline ? t.line : 'transparent'}`,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '0.375rem',
      height: '0.375rem',
      borderRadius: 'var(--radius-pill)',
      background: isSolid ? 'var(--white)' : t.ink,
      flex: '0 0 auto'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L EmptyState — a clean, composed absence. A quiet label, a grotesque
 * line, one measured sentence, at most one action. Centered, generous air.
 * No illustration.
 */
function EmptyState({
  eyebrow,
  title,
  description,
  action,
  align = 'center',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      gap: '0.875rem',
      padding: '3.5rem 2rem',
      maxWidth: '30rem',
      margin: align === 'center' ? '0 auto' : 0,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-h3)',
      lineHeight: 'var(--lh-heading)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-primary)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-regular)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--lh-relaxed)',
      color: 'var(--text-secondary)'
    }
  }, description), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.75rem'
    }
  }, action));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L Toast — a clean notice card. Modest radius, restrained shadow, a
 * toned status dot. Sentence-case title, one measured line, optional quiet
 * action and dismiss. It states; it does not celebrate.
 */
function Toast({
  title,
  message,
  tone = 'neutral',
  onDismiss,
  action,
  style,
  ...rest
}) {
  const tones = {
    neutral: 'var(--ink-500)',
    success: 'var(--success-ink)',
    warning: 'var(--warning-ink)',
    danger: 'var(--danger-ink)',
    info: 'var(--info-ink)',
    accent: 'var(--accent)'
  };
  const c = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      minWidth: '19rem',
      maxWidth: '26rem',
      background: 'var(--bg-surface)',
      border: 'var(--rule-thin) solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: '0.9375rem 1.0625rem',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: 'var(--radius-pill)',
      background: c,
      flex: '0 0 auto',
      marginTop: '0.375rem'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: 'var(--text-sm)',
      letterSpacing: '-0.005em',
      color: 'var(--text-primary)'
    }
  }, title), message && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--lh-normal)',
      color: 'var(--text-secondary)'
    }
  }, message), action && /*#__PURE__*/React.createElement("button", {
    onClick: action.onClick,
    style: {
      alignSelf: 'flex-start',
      marginTop: '0.375rem',
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-medium)',
      fontSize: 'var(--text-sm)',
      color: 'var(--accent)'
    }
  }, action.label)), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Descartar",
    style: {
      flex: '0 0 auto',
      background: 'none',
      border: 'none',
      padding: '0.125rem',
      marginTop: '-0.125rem',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-text)',
      fontSize: '1.125rem',
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L Button — clean, confident, grotesque. Sentence case, medium weight,
 * modest radius. Primary is a solid cobalt fill; the hero CTA can be a pill.
 * Variants: primary · secondary (grey fill) · outline · ghost. Sizes sm/md/lg.
 */
function Button({
  children,
  variant = 'secondary',
  size = 'md',
  type = 'button',
  disabled = false,
  fullWidth = false,
  pill = false,
  leadingIcon = null,
  trailingIcon = null,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = {
    sm: {
      fontSize: '0.8125rem',
      padding: '0.4375rem 0.875rem',
      gap: '0.375rem'
    },
    md: {
      fontSize: '0.9375rem',
      padding: '0.625rem 1.25rem',
      gap: '0.5rem'
    },
    lg: {
      fontSize: '1rem',
      padding: '0.9375rem 1.875rem',
      gap: '0.5rem'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes[size].gap,
    fontFamily: 'var(--font-text)',
    fontWeight: 'var(--fw-medium)',
    fontSize: sizes[size].fontSize,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    padding: sizes[size].padding,
    width: fullWidth ? '100%' : 'auto',
    borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-sm)',
    border: 'var(--rule-thin) solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease)',
    outline: 'none',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.4 : 1
  };
  const variants = {
    primary: {
      background: active ? 'var(--accent-900)' : hover ? 'var(--accent-600)' : 'var(--accent)',
      color: 'var(--text-onaccent)',
      borderColor: 'transparent'
    },
    secondary: {
      background: active ? 'var(--paper-200)' : hover ? 'var(--paper-100)' : 'var(--paper-50)',
      color: 'var(--text-primary)',
      borderColor: 'transparent'
    },
    outline: {
      background: hover ? 'var(--paper-50)' : 'transparent',
      color: 'var(--text-primary)',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)'
    },
    ghost: {
      background: hover ? 'var(--paper-50)' : 'transparent',
      color: hover ? 'var(--text-primary)' : 'var(--text-secondary)',
      borderColor: 'transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), leadingIcon, /*#__PURE__*/React.createElement("span", null, children), trailingIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L Input — a clean filled field. Grey inset that turns white with a
 * cobalt border and faint ring on focus. Label above in quiet grey.
 * `mono` for folios, RFCs, reference codes.
 */
function Input({
  label,
  value,
  defaultValue,
  placeholder,
  type = 'text',
  mono = false,
  hint,
  error,
  disabled = false,
  required = false,
  id,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const inputId = id || autoId;
  const borderColor = error ? 'var(--danger-ink)' : focus ? 'var(--accent)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4375rem',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-medium)',
      fontSize: 'var(--text-xs)',
      letterSpacing: '0',
      color: 'var(--text-secondary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      marginLeft: '0.25rem'
    }
  }, "*")), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    disabled: disabled,
    required: required,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-text)',
      fontSize: mono ? 'var(--text-mono)' : 'var(--text-sm)',
      letterSpacing: mono ? 'var(--tracking-mono)' : 'normal',
      color: 'var(--text-primary)',
      background: focus ? 'var(--white)' : 'var(--paper-50)',
      border: `var(--rule-thin) solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      padding: '0.625rem 0.75rem',
      outline: 'none',
      boxShadow: focus && !error ? '0 0 0 3px var(--focus-ring)' : 'none',
      width: '100%',
      opacity: disabled ? 0.5 : 1,
      transition: 'border-color var(--dur) var(--ease), background var(--dur) var(--ease), box-shadow var(--dur) var(--ease)'
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger-ink)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/instrument/ScoreDial.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RU.L ScoreDial — the signature object. A circular gauge that draws its
 * arc on mount: a soft track, a cobalt→cyan gradient arc, and the score
 * set large in mono at the center with a quiet label beneath. This is the
 * "halo" that anchors the audit. Use it once per view, as the hero.
 *
 * score 0–100 (or pass max). size in px. `flat` uses solid cobalt instead
 * of the gradient (for smaller, in-context dials). `halo` adds the glow.
 */
function ScoreDial({
  score = 94,
  max = 100,
  label = 'en orden',
  size = 320,
  stroke,
  flat = false,
  halo = false,
  animate = true,
  style,
  ...rest
}) {
  const gradId = React.useId().replace(/:/g, '');
  const sw = stroke != null ? stroke : Math.max(6, Math.round(size * 0.044));
  const r = (size - sw) / 2 - 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / max));
  const [drawn, setDrawn] = React.useState(!animate);
  React.useEffect(() => {
    if (!animate) return;
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDrawn(true);
      return;
    }
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
    return () => cancelAnimationFrame(t);
  }, [animate]);
  const offset = circ * (1 - (drawn ? pct : 0));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...(halo ? {} : {}),
      ...style
    }
  }, rest), halo && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      width: size * 2.4,
      height: size * 2.4,
      background: 'var(--accent-halo)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      transform: 'rotate(-90deg)',
      filter: halo ? 'drop-shadow(var(--shadow-halo))' : 'none'
    }
  }, !flat && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: gradId,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "var(--accent)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--accent-300)"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cx,
    r: r,
    fill: "none",
    stroke: "var(--paper-100)",
    strokeWidth: sw
  }), /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cx,
    r: r,
    fill: "none",
    stroke: flat ? 'var(--accent)' : `url(#${gradId})`,
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeDasharray: circ,
    strokeDashoffset: offset,
    style: {
      transition: animate ? 'stroke-dashoffset var(--dur-slow) var(--ease-out)' : 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--fw-semibold)',
      fontSize: size * 0.36,
      lineHeight: 1,
      letterSpacing: 'var(--tracking-metric)',
      color: 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, score), label && /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: size * 0.02,
      fontFamily: 'var(--font-text)',
      fontWeight: 'var(--fw-medium)',
      fontSize: Math.max(10, size * 0.038),
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label)));
}
Object.assign(__ds_scope, { ScoreDial });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/instrument/ScoreDial.jsx", error: String((e && e.message) || e) }); }

// ui_kits/audit/AuditChrome.jsx
try { (() => {
/* RU.L Audit — shared chrome. Exposes Nav, Wordmark, Section to window. */

function Wordmark({
  size = 22,
  onClick
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '-0.03em',
      color: 'var(--ink-900)',
      cursor: onClick ? 'pointer' : 'default',
      lineHeight: 1
    }
  }, "ru", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "."), "l");
}
function Nav({
  onHome,
  price = true
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      padding: '26px 52px',
      maxWidth: 1240,
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    onClick: onHome
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 28,
      fontSize: 13.5,
      color: 'var(--ink-400)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "abogados \u2014 ciudad de m\xE9xico"), price && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--ink-900)'
    }
  }, "la auditor\xEDa \xB7 mx$10,000")));
}
function Section({
  no,
  title,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: 1240,
      margin: '0 auto',
      padding: '0 52px 96px',
      boxSizing: 'border-box',
      ...style
    }
  }, (no || title) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      borderTop: '1px solid var(--ink-900)',
      paddingTop: 14,
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.06em'
    }
  }, no), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)'
    }
  }, title)), children);
}
Object.assign(window, {
  Wordmark,
  Nav,
  Section
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/audit/AuditChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/audit/InstrumentScreen.jsx
try { (() => {
/* RU.L Audit — the live instrument. Numbers count, the seismograph feeds,
   sources clear one by one, the provisional score drifts. Composes ScoreDial
   + Badge. Exposes InstrumentScreen to window. */

function InstrumentScreen({
  onComplete
}) {
  const {
    ScoreDial,
    Badge,
    Button
  } = window.RULDesignSystem_533834;
  const [n, setN] = React.useState(1248);
  const [secs, setSecs] = React.useState(252);
  const [score, setScore] = React.useState(78);
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  React.useEffect(() => {
    if (reduced) {
      setN(1411);
      return;
    }
    const a = setInterval(() => setN(v => v >= 1411 ? 1411 : v + Math.floor(Math.random() * 7) + 2), 240);
    const b = setInterval(() => setSecs(v => v + 1), 1000);
    const c = setInterval(() => setScore(v => Math.max(76, Math.min(83, v + (Math.random() < 0.6 ? 1 : -1)))), 2600);
    return () => {
      clearInterval(a);
      clearInterval(b);
      clearInterval(c);
    };
  }, [reduced]);
  const fmt = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
  const pad = x => (x < 10 ? '0' : '') + x;
  const timer = '00:' + pad(Math.floor(secs / 60)) + ':' + pad(secs % 60);
  const sources = [{
    nm: 'sat — cfdi emitidos',
    rng: '2019–2026',
    state: 'ok'
  }, {
    nm: 'sat — declaraciones anuales',
    rng: '2021–2025',
    state: 'ok'
  }, {
    nm: 'impi — marcas y avisos',
    rng: 'expedientes 3',
    state: 'live'
  }, {
    nm: 'rpc — actas y poderes',
    rng: 'folio mercantil 88421',
    state: 'queue'
  }, {
    nm: 'cofece — precedentes',
    rng: '2016–2026',
    state: 'queue'
  }];
  const mono = {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '8px 52px 80px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 34
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      margin: 0,
      maxWidth: '24ch',
      color: 'var(--ink-900)'
    }
  }, "Barriendo sus registros. La socia firma al final."), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 13,
      color: 'var(--accent)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: 'var(--accent)',
      animation: reduced ? 'none' : 'insPulse 1.8s ease-in-out infinite'
    }
  }), "en vivo \xB7 ", timer)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 12,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)'
    }
  }, "registros barridos \u2014 sat \xB7 impi \xB7 rpc \xB7 cofece"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 56,
      fontWeight: 600,
      letterSpacing: '-0.04em',
      marginTop: 10,
      color: 'var(--ink-900)'
    }
  }, fmt(n), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      color: 'var(--ink-300)'
    }
  }, "/ 1 411")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      height: 88,
      overflow: 'hidden',
      position: 'relative',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      background: 'repeating-linear-gradient(90deg, transparent 0 55px, var(--paper-50) 55px 56px)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "1640",
    height: "88",
    viewBox: "0 0 1640 88",
    fill: "none",
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 88,
      animation: reduced ? 'none' : 'insFeed 11s linear infinite'
    }
  }, /*#__PURE__*/React.createElement("path", {
    id: "insTrace",
    d: "M0,52 L56,52 L64,46 L72,58 L80,52 L150,52 L157,20 L164,74 L171,38 L178,52 L262,52 L270,47 L278,57 L286,52 L360,52 L367,30 L374,66 L381,52 L470,52 L478,48 L486,56 L494,52 L560,52 L567,14 L574,78 L581,32 L588,60 L595,52 L700,52 L708,46 L716,58 L724,52 L820,52",
    stroke: "var(--accent)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("use", {
    href: "#insTrace",
    x: "820"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 56,
      borderLeft: '1px solid var(--accent)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, sources.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      gap: 18,
      padding: '11px 0',
      borderTop: i === 0 ? '1px solid var(--ink-900)' : '1px solid var(--line-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 13,
      color: 'var(--ink-900)'
    }
  }, s.nm, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-400)',
      marginLeft: 10
    }
  }, s.rng)), s.state === 'ok' && /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "conforme"), s.state === 'live' && /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 12,
      color: 'var(--accent)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--accent)',
      animation: reduced ? 'none' : 'insPulse 1.4s ease-in-out infinite'
    }
  }), "barriendo\u2026"), s.state === 'queue' && /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    variant: "outline"
  }, "en cola"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--line)',
      borderRadius: 10,
      padding: '26px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ScoreDial, {
    score: score,
    label: "provisional",
    size: 190,
    flat: true,
    animate: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 22
    }
  }, ['№ 8842-11', '№ 8842-12'].map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      ...mono,
      fontSize: 11.5,
      border: '1px solid var(--line)',
      borderRadius: 6,
      padding: '7px 10px',
      display: 'flex',
      justifyContent: 'space-between',
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "acuse sat"), /*#__PURE__*/React.createElement("span", null, f))))), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onComplete
  }, "Ver resultado \u2192"))));
}
Object.assign(window, {
  InstrumentScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/audit/InstrumentScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/audit/LandingScreen.jsx
try { (() => {
/* RU.L Audit — Landing. The Halo hero + the eight conversion blocks.
   Composes ScoreDial, Button, Badge from the design system.
   Exposes LandingScreen to window. */

function LandingScreen({
  onStart
}) {
  const {
    ScoreDial,
    Button,
    Badge
  } = window.RULDesignSystem_533834;
  const modules = [{
    h: 'Fiscal',
    items: ['opinión de cumplimiento (32-D) y su vigencia', 'presencia de sus proveedores en la lista 69-B del SAT', 'coincidencia entre CFDI emitidos y declaraciones anuales 2021–2025', 'buzón tributario con medios de contacto validados']
  }, {
    h: 'Corporativo',
    items: ['inscripciones y gravámenes en el Registro Público de Comercio', 'vigencia y alcance de los poderes otorgados', 'libros corporativos y variaciones de capital', 'aviso de beneficiario controlador (art. 32-B Ter CFF)']
  }, {
    h: 'Propiedad intelectual',
    items: ['titularidad y vigencia de marcas ante el IMPI', 'avisos comerciales y reservas de derechos', 'coincidencia entre razón social, marca y dominio', 'licencias y gravámenes inscritos sobre la marca']
  }];
  const label = {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.06em',
    color: 'var(--ink-400)'
  };
  const sechead = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderTop: '1px solid var(--ink-900)',
    paddingTop: 14,
    marginBottom: 44
  };
  const h2 = {
    fontSize: 34,
    fontWeight: 600,
    letterSpacing: '-0.035em',
    margin: 0,
    color: 'var(--ink-900)'
  };
  const wrap = {
    maxWidth: 1240,
    margin: '0 auto',
    padding: '0 52px 96px',
    boxSizing: 'border-box'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: '38%',
      left: '50%',
      width: 1000,
      height: 1000,
      transform: 'translate(-50%,-50%)',
      background: 'var(--accent-halo)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '48px 52px 104px'
    }
  }, /*#__PURE__*/React.createElement(ScoreDial, {
    score: 94,
    label: "en orden",
    size: 300,
    halo: true
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 58,
      fontWeight: 600,
      letterSpacing: '-0.04em',
      lineHeight: 1.05,
      margin: '44px 0 0',
      maxWidth: '18ch',
      color: 'var(--ink-900)'
    }
  }, "Su sociedad, auditada y firmada hoy."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 20,
      lineHeight: 1.5,
      color: 'var(--ink-500)',
      margin: '22px 0 0',
      maxWidth: '52ch'
    }
  }, "Barremos el SAT, el IMPI y el Registro P\xFAblico de Comercio. Una socia revisa los hallazgos y firma el resultado con su c\xE9dula profesional."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    pill: true,
    onClick: onStart
  }, "Iniciar la auditor\xEDa"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      color: 'var(--ink-400)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--ink-900)',
      fontWeight: 600,
      fontFamily: 'var(--font-mono)'
    }
  }, "mx$10,000"), " por sociedad \xB7 m\xE1s iva")))), /*#__PURE__*/React.createElement("section", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: sechead
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: 'var(--ink-900)'
    }
  }, "\u2116 02"), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "c\xF3mo funciona")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 44
    }
  }, [['01', 'Nos da acceso de solo lectura con su CIEC o e.firma. La credencial se usa una sola vez y no se almacena.'], ['02', 'El sistema contrasta cada asiento contra las bases públicas. Puede seguir el avance en vivo, fuente por fuente.'], ['03', 'Una socia revisa los hallazgos, firma el informe con su cédula y se lo entrega el mismo día.']].map(([n, t]) => /*#__PURE__*/React.createElement("div", {
    key: n
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--accent)'
    }
  }, n), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.62,
      color: 'var(--ink-700)',
      margin: '14px 0 0'
    }
  }, t))))), /*#__PURE__*/React.createElement("section", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: sechead
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: 'var(--ink-900)'
    }
  }, "\u2116 03"), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "qu\xE9 revisamos")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 44
    }
  }, modules.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.h
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      margin: '0 0 16px',
      color: 'var(--ink-900)'
    }
  }, m.h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, m.items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      lineHeight: 1.5,
      color: 'var(--ink-700)',
      padding: '11px 0',
      borderTop: '1px solid var(--line-faint)'
    }
  }, it))))))), /*#__PURE__*/React.createElement("section", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: sechead
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: 'var(--ink-900)'
    }
  }, "\u2116 04"), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "qui\xE9nes firman")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 26,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.5,
      margin: 0,
      maxWidth: '30ch',
      color: 'var(--ink-900)'
    }
  }, "Antes de fundar ru.l, los socios cerraron operaciones de fusi\xF3n y adquisici\xF3n por m\xE1s de ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-300)'
    }
  }, "[monto]"), " en M\xE9xico, en ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-300)'
    }
  }, "[firmas]"), ". Cada auditor\xEDa la firma la socia que la revis\xF3, con su nombre y su c\xE9dula profesional.")), /*#__PURE__*/React.createElement("section", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: sechead
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: 'var(--ink-900)'
    }
  }, "\u2116 05"), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "el informe")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '460px 1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ReportSheet, null), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--ink-500)',
      margin: 0,
      maxWidth: '38ch'
    }
  }, "Una p\xE1gina del informe real. Cada hallazgo cita su fundamento, su fuente y la correcci\xF3n recomendada, con folio y acuse por cada consulta a una base p\xFAblica."))), /*#__PURE__*/React.createElement("section", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: sechead
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: 'var(--ink-900)'
    }
  }, "\u2116 06"), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "si algo aparece")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 26,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.5,
      margin: 0,
      maxWidth: '34ch',
      color: 'var(--ink-900)'
    }
  }, "Si la auditor\xEDa encuentra problemas, cotizamos la correcci\xF3n a precio fijo antes de empezar. Si su caso no encaja en la auditor\xEDa, escr\xEDbanos y le decimos si podemos llevarlo."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      marginTop: 22,
      color: 'var(--ink-700)'
    }
  }, "casos@ru.l")), /*#__PURE__*/React.createElement("section", {
    style: {
      ...wrap,
      paddingBottom: 110
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: sechead
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: 'var(--ink-900)'
    }
  }, "\u2116 07"), /*#__PURE__*/React.createElement("span", {
    style: label
  }, "sus datos")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      maxWidth: '62ch'
    }
  }, ['El acceso con CIEC es de solo lectura; la credencial se usa una vez y no se almacena.', 'La información viaja y se guarda cifrada, y se elimina a los treinta días de entregado el informe.', 'Cada consulta a una base pública queda registrada; puede pedir la bitácora completa cuando quiera.'].map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--ink-700)',
      padding: '14px 0',
      borderTop: '1px solid var(--line-faint)'
    }
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--accent)',
      color: '#fff',
      padding: '96px 52px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1240,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 44,
      fontWeight: 600,
      letterSpacing: '-0.035em',
      lineHeight: 1.15,
      margin: 0,
      maxWidth: '24ch'
    }
  }, "La auditor\xEDa empieza hoy y el informe llega firmado."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: 52,
      flexWrap: 'wrap',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    pill: true,
    onClick: onStart,
    style: {
      background: '#fff',
      color: 'var(--accent)'
    }
  }, "Iniciar la auditor\xEDa"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12.5,
      color: 'rgba(255,255,255,0.66)',
      marginTop: 16
    }
  }, "mx$10,000 por sociedad \xB7 precio \xFAnico, m\xE1s iva")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 14,
      textAlign: 'right',
      lineHeight: 1.8,
      color: 'rgba(255,255,255,0.9)'
    }
  }, "elena.rueda@ru.l", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,0.55)'
    }
  }, "la socia responde en el d\xEDa"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px solid rgba(255,255,255,0.25)',
      paddingTop: 16,
      marginTop: 84,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'rgba(255,255,255,0.6)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "ru.l \u2014 abogados, ciudad de m\xE9xico"), /*#__PURE__*/React.createElement("span", null, "es / en")))));
}

/* A miniature of the signed report — composes ScoreDial + Badge. */
function ReportSheet() {
  const {
    ScoreDial,
    Badge
  } = window.RULDesignSystem_533834;
  const frow = {
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    padding: '9px 0',
    borderTop: '1px solid var(--line-faint)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1px solid var(--line)',
      borderRadius: 10,
      boxShadow: 'var(--shadow-lg)',
      padding: '32px 36px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: '-0.03em'
    }
  }, "ru", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "."), "l"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--ink-400)'
    }
  }, "folio a-0148 \xB7 04.07.2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--ink-900)',
      margin: '10px 0 22px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3
    }
  }, "Auditor\xEDa de Grupo Alaris, S.A.P.I. de C.V."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      margin: '20px 0'
    }
  }, /*#__PURE__*/React.createElement(ScoreDial, {
    score: 94,
    label: "",
    size: 76,
    flat: true,
    animate: false
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-700)',
      lineHeight: 1.7
    }
  }, "1 411 registros barridos", /*#__PURE__*/React.createElement("br", null), "3 observaciones menores", /*#__PURE__*/React.createElement("br", null), "acuses sat \xB7 impi \xB7 rpc")), /*#__PURE__*/React.createElement("div", {
    style: frow
  }, /*#__PURE__*/React.createElement("span", null, "69-B \u2014 proveedores"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--success-ink)'
    }
  }, "conforme")), /*#__PURE__*/React.createElement("div", {
    style: frow
  }, /*#__PURE__*/React.createElement("span", null, "32-D \u2014 opini\xF3n de cumplimiento"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--success-ink)'
    }
  }, "conforme")), /*#__PURE__*/React.createElement("div", {
    style: frow
  }, /*#__PURE__*/React.createElement("span", null, "impi \u2014 clase 36, renovaci\xF3n"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "observaci\xF3n")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--ink-400)',
      lineHeight: 1.7
    }
  }, "mtra. elena rueda \u2014 socia", /*#__PURE__*/React.createElement("br", null), "c\xE9d. prof. [n\xFAmero]"), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    variant: "outline",
    shape: "square",
    style: {
      transform: 'rotate(4deg)'
    }
  }, "en orden")));
}
Object.assign(window, {
  LandingScreen,
  ReportSheet
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/audit/LandingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/audit/ResultScreen.jsx
try { (() => {
/* RU.L Audit — the result. "Todo en orden": the arc closes at 94, a stamp
   settles, findings and acuses read as objects. Composes ScoreDial, Badge,
   Button. Exposes ResultScreen to window. */

function ResultScreen({
  onRestart
}) {
  const {
    ScoreDial,
    Badge,
    Button
  } = window.RULDesignSystem_533834;
  const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [stamped, setStamped] = React.useState(reduced);
  React.useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setStamped(true), 1400);
    return () => clearTimeout(t);
  }, [reduced]);
  const mono = {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums'
  };
  const sources = [{
    nm: 'sat — cfdi emitidos',
    rng: '2019–2026',
    tone: 'ok',
    txt: 'conforme'
  }, {
    nm: 'sat — declaraciones anuales',
    rng: '2021–2025',
    tone: 'ok',
    txt: 'conforme'
  }, {
    nm: 'impi — marcas y avisos',
    rng: 'expedientes 3',
    tone: 'accent',
    txt: '3 observaciones'
  }, {
    nm: 'rpc — actas y poderes',
    rng: 'folio mercantil 88421',
    tone: 'ok',
    txt: 'conforme'
  }, {
    nm: 'cofece — precedentes',
    rng: '2016–2026',
    tone: 'ok',
    txt: 'conforme'
  }];
  const acuses = [['acuse sat', '№ 8842-11'], ['acuse sat', '№ 8842-12'], ['acuse impi', '№ 2210-04'], ['acuse rpc', '№ 0088-42']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '8px 52px 80px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 34
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: '-0.03em',
      margin: 0,
      maxWidth: '30ch',
      color: 'var(--ink-900)'
    }
  }, "Todo en orden. Tres observaciones menores; la socia las firma hoy."), /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 13,
      color: 'var(--ink-400)'
    }
  }, "completada \u2014 00:11:37")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 12,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)'
    }
  }, "registros barridos \u2014 sat \xB7 impi \xB7 rpc \xB7 cofece"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 56,
      fontWeight: 600,
      letterSpacing: '-0.04em',
      marginTop: 10,
      color: 'var(--ink-900)'
    }
  }, "1 411 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      color: 'var(--ink-300)'
    }
  }, "/ 1 411")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      height: 88,
      overflow: 'hidden',
      position: 'relative',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      background: 'var(--paper-50)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "1080",
    height: "88",
    viewBox: "0 0 1080 88",
    fill: "none",
    style: {
      position: 'absolute',
      top: 0,
      left: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,52 L160,52 L168,48 L176,56 L184,52 L420,52 L427,36 L434,66 L441,52 L720,52 L728,47 L736,57 L744,52 L1080,52",
    stroke: "var(--line-strong)",
    strokeWidth: "1.5"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, sources.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      gap: 18,
      padding: '11px 0',
      borderTop: i === 0 ? '1px solid var(--ink-900)' : '1px solid var(--line-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...mono,
      fontSize: 13,
      color: 'var(--ink-900)'
    }
  }, s.nm, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-400)',
      marginLeft: 10
    }
  }, s.rng)), s.tone === 'ok' ? /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, s.txt) : /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, s.txt))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      border: '1px solid var(--line)',
      borderRadius: 10,
      padding: '26px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -12,
      top: -16,
      border: '2px solid var(--accent)',
      color: 'var(--accent)',
      padding: '9px 14px',
      borderRadius: 6,
      background: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
      transform: stamped ? 'rotate(6deg) scale(1)' : 'rotate(6deg) scale(1.7)',
      opacity: stamped ? 1 : 0,
      transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 600,
      letterSpacing: '-0.01em'
    }
  }, "en orden"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...mono,
      fontSize: 9.5,
      letterSpacing: '0.08em',
      marginTop: 2
    }
  }, "04.07.2026 \u2014 09:12 \xB7 ru.l")), /*#__PURE__*/React.createElement(ScoreDial, {
    score: 94,
    label: "en orden",
    size: 190
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 22
    }
  }, acuses.map(([k, f]) => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      ...mono,
      fontSize: 11.5,
      border: '1px solid var(--line)',
      borderRadius: 6,
      padding: '7px 10px',
      display: 'flex',
      justifyContent: 'space-between',
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", null, f))))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true
  }, "Descargar informe firmado"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onRestart
  }, "\u2190 Volver al inicio"))));
}
Object.assign(window, {
  ResultScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/audit/ResultScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/matter-portal/DashboardScreen.jsx
try { (() => {
/* RU.L Matter Portal — Dashboard. Clean white, cobalt accent, a live audit
   score as the one hero object. Exposes DashboardScreen to window. */

function DashboardScreen({
  onOpenMatter,
  matters
}) {
  const {
    Table,
    MatterStatus,
    DocumentCard,
    Button,
    ScoreDial,
    Badge
  } = window.RULDesignSystem_533834;
  const documents = [{
    ref: 'RUL-2026-0148 · Cláusula 4',
    title: 'Contrato de compraventa de acciones',
    kind: 'Contrato',
    updated: 'Hoy, 14:20',
    stage: 'review',
    accent: true
  }, {
    ref: 'RUL-2026-0148 · Anexo B',
    title: 'Cédula de revelaciones',
    kind: 'Anexo',
    updated: 'Ayer, 19:05',
    stage: 'drafting',
    accent: false
  }, {
    ref: 'RUL-2026-0143',
    title: 'Term sheet — Serie B',
    kind: 'Term sheet',
    updated: '02 jul',
    stage: 'delivered',
    accent: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 44
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 240px',
      gap: 40,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)'
    }
  }, "buenas tardes"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '14px 0 0',
      fontSize: 42,
      fontWeight: 600,
      lineHeight: 1.08,
      letterSpacing: '-0.035em',
      color: 'var(--ink-900)',
      maxWidth: '20ch'
    }
  }, "Su auditor\xEDa cerr\xF3 en orden. Un documento est\xE1 en revisi\xF3n del socio."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px 0 0',
      fontFamily: 'var(--font-text)',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--ink-500)',
      maxWidth: '54ch'
    }
  }, "El contrato de compraventa pas\xF3 al escritorio de la socia esta ma\xF1ana. Entrega estimada: hoy, 6 pm. No se requiere ninguna acci\xF3n de su parte."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Ver el informe"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "Solicitar una llamada"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(ScoreDial, {
    score: 94,
    label: "en orden",
    size: 200
  }))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--ink-900)'
    }
  }, "Mat\xE9rias abiertas"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost"
  }, "Ver archivadas")), /*#__PURE__*/React.createElement(Table, {
    columns: [{
      key: 'ref',
      header: 'Expediente',
      mono: true,
      width: 150
    }, {
      key: 'matter',
      header: 'Matería'
    }, {
      key: 'lead',
      header: 'Socio',
      width: 150
    }, {
      key: 'status',
      header: 'Estado',
      render: v => /*#__PURE__*/React.createElement(MatterStatus, {
        stage: v
      })
    }, {
      key: 'due',
      header: 'Entrega',
      mono: true,
      align: 'right',
      width: 120
    }],
    rows: matters,
    onRowClick: m => onOpenMatter && onOpenMatter(m)
  })), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 18px',
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--ink-900)'
    }
  }, "Documentos recientes"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 18
    }
  }, documents.map((d, i) => /*#__PURE__*/React.createElement(DocumentCard, {
    key: i,
    reference: d.ref,
    title: d.title,
    kind: d.kind,
    updated: `Actualizado ${d.updated}`,
    status: /*#__PURE__*/React.createElement(MatterStatus, {
      stage: d.stage
    }),
    accent: d.accent,
    onClick: () => {}
  })))));
}
Object.assign(window, {
  DashboardScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/matter-portal/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/matter-portal/EntryScreen.jsx
try { (() => {
/* RU.L Matter Portal — Entry / sign-in, clean and quiet.
   Exposes EntryScreen to window. */

function EntryScreen({
  onEnter
}) {
  const {
    Input,
    Button
  } = window.RULDesignSystem_533834;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '64px 72px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: '1px solid var(--line)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: '55%',
      left: '30%',
      width: 720,
      height: 720,
      transform: 'translate(-50%,-50%)',
      background: 'var(--accent-halo)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontWeight: 600,
      fontSize: 30,
      letterSpacing: '-0.03em',
      color: 'var(--ink-900)'
    }
  }, "ru", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "."), "l"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontWeight: 600,
      fontSize: 52,
      lineHeight: 1.05,
      letterSpacing: '-0.04em',
      color: 'var(--ink-900)',
      maxWidth: '16ch'
    }
  }, "Su expediente, a la velocidad del software."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '24px 0 0',
      fontFamily: 'var(--font-text)',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--ink-500)',
      maxWidth: '46ch'
    }
  }, "El expediente privado de ru.l. Acceso por invitaci\xF3n; sus asuntos, su estado y sus entregas, en un solo lugar.")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-400)'
    }
  }, "ru.l \u2014 abogados, ciudad de m\xE9xico")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '64px 64px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'var(--paper-50)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)'
    }
  }, "acceso"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '12px 0 32px',
      fontWeight: 600,
      fontSize: 28,
      letterSpacing: '-0.03em',
      color: 'var(--ink-900)'
    }
  }, "Entrar a su expediente"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onEnter && onEnter();
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Correo",
    type: "email",
    defaultValue: "director@grupoalaris.mx"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "C\xF3digo de invitaci\xF3n",
    mono: true,
    defaultValue: "RUL\xB78842\xB7ALARIS"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit",
    fullWidth: true
  }, "Entrar")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-text)',
      fontSize: 13,
      color: 'var(--ink-400)',
      lineHeight: 1.5
    }
  }, "El acceso es por referencia. Si su c\xF3digo no funciona, escriba a su socio.")))));
}
Object.assign(window, {
  EntryScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/matter-portal/EntryScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/matter-portal/MatterDetailScreen.jsx
try { (() => {
/* RU.L Matter Portal — Matter detail, set like a legal opinion's inner page.
   Exposes MatterDetailScreen to window. */

function MatterDetailScreen({
  matter,
  onBack
}) {
  const {
    MatterStatus,
    Badge,
    Button,
    Table,
    DocumentCard
  } = window.RULDesignSystem_533834;
  const m = matter || {};
  const timeline = [{
    ref: '03 jul · 09:12',
    event: 'Borrador enviado a revisión del socio',
    by: 'Sistema'
  }, {
    ref: '02 jul · 18:40',
    event: 'Segunda revisión de cláusulas 4–7',
    by: 'Equipo RU.L'
  }, {
    ref: '01 jul · 11:03',
    event: 'Matería abierta',
    by: 'Mtra. Elena Rueda'
  }];
  const docs = [{
    ref: 'Cláusula 4',
    title: 'Contrato de compraventa de acciones',
    kind: 'Contrato',
    updated: 'Hoy, 14:20',
    stage: 'review'
  }, {
    ref: 'Anexo B',
    title: 'Cédula de revelaciones',
    kind: 'Anexo',
    updated: 'Ayer',
    stage: 'drafting'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 34
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      alignSelf: 'flex-start',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      fontFamily: 'var(--font-mono)',
      fontWeight: 400,
      fontSize: 12,
      letterSpacing: '0.02em',
      color: 'var(--ink-400)'
    }
  }, "\u2190 volver al \xEDndice"), /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--ink-400)'
    }
  }, m.ref || 'RUL-2026-0148'), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    variant: "outline"
  }, "M&A"), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    variant: "tint"
  }, "Confidencial")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontWeight: 600,
      fontSize: 40,
      lineHeight: 1.08,
      letterSpacing: '-0.035em',
      color: 'var(--ink-900)',
      maxWidth: '18ch'
    }
  }, m.matter || 'Adquisición Grupo Alaris'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(MatterStatus, {
    stage: m.status || 'review'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 14,
      color: 'var(--ink-500)'
    }
  }, "Socia: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600,
      color: 'var(--ink-700)'
    }
  }, "Mtra. Elena Rueda")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 14,
      color: 'var(--ink-500)'
    }
  }, "Entrega: ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600,
      color: 'var(--ink-700)'
    }
  }, m.due || 'Hoy · 18:00')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 44
    }
  }, /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 16px',
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: '-0.02em',
      color: 'var(--ink-900)'
    }
  }, "Documentos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, docs.map((d, i) => /*#__PURE__*/React.createElement(DocumentCard, {
    key: i,
    reference: `${m.ref || 'RUL-2026-0148'} · ${d.ref}`,
    title: d.title,
    kind: d.kind,
    updated: `Actualizado ${d.updated}`,
    status: /*#__PURE__*/React.createElement(MatterStatus, {
      stage: d.stage
    }),
    onClick: () => {}
  })))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 16px',
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: '-0.02em',
      color: 'var(--ink-900)'
    }
  }, "Actividad"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, timeline.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 16,
      padding: '14px 0',
      borderBottom: '1px solid var(--line-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-400)',
      width: 92,
      flex: '0 0 auto'
    }
  }, t.ref), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 14,
      color: 'var(--ink-700)',
      lineHeight: 1.45
    }
  }, t.event), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: 12,
      color: 'var(--ink-400)',
      marginTop: 3
    }
  }, t.by))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true
  }, "Solicitar una llamada")))));
}
Object.assign(window, {
  MatterDetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/matter-portal/MatterDetailScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/matter-portal/PortalChrome.jsx
try { (() => {
/* RU.L Matter Portal — shared chrome, clean white/cobalt.
   Exposes Masthead, Sidebar, Wordmark to window. */

function Wordmark({
  size = 26
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '-0.03em',
      color: 'var(--ink-900)',
      lineHeight: 1
    }
  }, "ru", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "."), "l");
}
function Masthead({
  client = 'Grupo Alaris',
  date = 'Jueves, 3 de julio de 2026'
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      padding: '0 0 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 30
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)'
    }
  }, "expediente del cliente"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--ink-900)'
    }
  }, client))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 0,
      borderTop: '1px solid var(--ink-900)',
      marginTop: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-400)'
    }
  }, "ru.l \u2014 abogados, ciudad de m\xE9xico"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--ink-400)'
    }
  }, date)));
}
function Sidebar({
  active = 'matters',
  onNav
}) {
  const items = [{
    key: 'matters',
    label: 'Matérias'
  }, {
    key: 'audit',
    label: 'Auditoría'
  }, {
    key: 'documents',
    label: 'Documentos'
  }, {
    key: 'billing',
    label: 'Honorarios'
  }, {
    key: 'contacts',
    label: 'Contactos'
  }];
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 400,
      fontSize: 11,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)',
      marginBottom: 14
    }
  }, "\xEDndice"), items.map(it => {
    const on = active === it.key;
    return /*#__PURE__*/React.createElement("button", {
      key: it.key,
      onClick: () => onNav && onNav(it.key),
      style: {
        textAlign: 'left',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '9px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-text)',
        fontSize: 14,
        fontWeight: on ? 600 : 400,
        color: on ? 'var(--ink-900)' : 'var(--ink-500)',
        borderBottom: '1px solid var(--line-faint)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: 999,
        background: on ? 'var(--accent)' : 'transparent',
        flex: '0 0 auto'
      }
    }), it.label);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      paddingTop: 18,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.06em',
      color: 'var(--ink-400)'
    }
  }, "su socia"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--ink-900)'
    }
  }, "Mtra. Elena Rueda"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: 'var(--font-text)',
      fontSize: 13,
      color: 'var(--ink-500)',
      lineHeight: 1.5
    }
  }, "Socia \xB7 M&A", /*#__PURE__*/React.createElement("br", null), "elena.rueda@ru.l")));
}
Object.assign(window, {
  Wordmark,
  Masthead,
  Sidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/matter-portal/PortalChrome.jsx", error: String((e && e.message) || e) }); }

__ds_ns.DocumentCard = __ds_scope.DocumentCard;

__ds_ns.MatterStatus = __ds_scope.MatterStatus;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ScoreDial = __ds_scope.ScoreDial;

})();
