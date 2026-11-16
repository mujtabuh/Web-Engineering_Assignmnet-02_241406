import { memo } from 'react';

export const LOW_STOCK_LIMIT = 5;

export function getStatus(stock) {
  if (stock === 0) return { label: 'Out of Stock', tone: 'danger' };
  if (stock <= LOW_STOCK_LIMIT) return { label: 'Low Stock', tone: 'warn' };
  return { label: 'In Stock', tone: 'ok' };
}

// memo + stable callbacks from the parent (useCallback) => card only re-renders when its product changes
function ProductCard({ product, onUpdateStock, onDelete }) {
  const status = getStatus(product.stock);
  return (
    <article className="product">
      <div className="product-top">
        <h3>{product.title}</h3>
        <span className={`badge ${status.tone}`}>{status.label}</span>
      </div>
      <p className="muted">{product.category} · ${product.price.toFixed(2)}</p>
      <div className="stock-row">
        <button className="btn small" onClick={() => onUpdateStock(product.id, -1)} disabled={product.stock === 0} aria-label={`Decrease stock of ${product.title}`}>−</button>
        <span className="stock">{product.stock} {product.stock === 1 ? "unit" : "units"}</span>
        <button className="btn small" onClick={() => onUpdateStock(product.id, 1)} aria-label={`Increase stock of ${product.title}`}>+</button>
        <button className="btn small danger-btn" onClick={() => onDelete(product.id)}>Delete</button>
      </div>
      {product.stock <= LOW_STOCK_LIMIT && (
        <p className="warn small-text">
          {product.stock === 0 ? 'Restock needed immediately.' : 'Consider reordering soon.'}
        </p>
      )}
    </article>
  );
}

export default memo(ProductCard);
