import { memo } from 'react';

function InventoryMetrics({ metrics }) {
  const items = [
    { label: 'Products', value: metrics.products },
    { label: 'Total units', value: metrics.units },
    { label: 'Inventory value', value: `$${metrics.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: 'Low stock', value: metrics.low, tone: metrics.low > 0 ? 'warn' : '' },
    { label: 'Out of stock', value: metrics.out, tone: metrics.out > 0 ? 'danger' : '' },
  ];
  return (
    <div className="metrics">
      {items.map((m) => (
        <div key={m.label} className="metric">
          <span className="muted">{m.label}</span>
          <strong className={m.tone}>{m.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default memo(InventoryMetrics);
