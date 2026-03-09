// src/components/ui — Reusable D-Armada UI components

// ─── Button ───
export function Button({ children, primary, full, className = '', ...rest }) {
  return (
    <button
      className={`
        px-7 py-3 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all cursor-pointer
        ${primary
          ? 'bg-gradient-to-br from-brand to-brand-dark text-surface-bg shadow-lg shadow-brand/20 hover:shadow-brand/40'
          : 'bg-transparent border border-border text-text-secondary hover:border-brand/40 hover:text-text-primary'
        }
        ${full ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}

// ─── Card ───
export function Card({ children, glow, className = '', ...rest }) {
  return (
    <div
      className={`
        bg-surface-1 border rounded-xl p-6 transition-all cursor-pointer
        hover:border-brand/30 hover:bg-surface-2
        ${glow ? 'border-brand/30 shadow-lg shadow-brand/5' : 'border-border'}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Tag ───
export function Tag({ children, color = 'brand' }) {
  const colorMap = {
    brand: 'bg-brand/10 text-brand',
    profit: 'bg-profit/10 text-profit',
    loss: 'bg-loss/10 text-loss',
    caution: 'bg-caution/10 text-caution',
    muted: 'bg-text-muted/10 text-text-muted',
  };
  return (
    <span className={`text-[9px] tracking-widest px-2 py-0.5 rounded font-semibold uppercase ${colorMap[color] || colorMap.brand}`}>
      {children}
    </span>
  );
}

// ─── Stat ───
export function Stat({ value, label, color = 'text-brand' }) {
  return (
    <div className="text-center">
      <div className={`font-sora text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-[9px] text-text-muted tracking-widest uppercase mt-1">{label}</div>
    </div>
  );
}

// ─── Section ───
// ─── Section (Corrected with institutional padding) ───
export function Section({ label, title, subtitle, children, className = "" }) {
  return (
    // We changed pb-16 to pb-52 to create more space before the footer
    // We also added ${className} so you can add extra styles later if needed
    <div className={`w-full max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-52 ${className}`}>
      {label && <div className="text-[10px] tracking-[5px] uppercase text-brand mb-2 font-semibold">{label}</div>}
      <h1 className="text-2xl md:text-3xl font-bold text-text-bright mb-2">{title}</h1>
      {subtitle && <p className="text-text-secondary text-sm mb-8 max-w-xl font-light">{subtitle}</p>}
      {children}
    </div>
  );
}

// ─── Pill (filter button) ───
export function Pill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-full text-[11px] tracking-wide cursor-pointer transition-all border
        ${active
          ? 'bg-brand/10 border-brand/30 text-brand'
          : 'bg-transparent border-border text-text-secondary hover:border-brand/20'
        }
      `}
    >
      {children}
    </button>
  );
}
