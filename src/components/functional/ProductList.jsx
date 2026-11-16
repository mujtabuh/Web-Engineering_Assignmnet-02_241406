import { memo } from 'react';
import CardWrapper from './CardWrapper.jsx';
import ProductCard from './ProductCard.jsx';

function ProductList({ products, totalCount, onUpdateStock, onDelete }) {
  return (
    <CardWrapper title={`Products (${products.length})`}>
      {products.length === 0 ? (
        <p className="empty">
          {totalCount === 0
            ? 'Your inventory is empty. Add your first product above.'
            : 'No products match the current filters.'}
        </p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onUpdateStock={onUpdateStock} onDelete={onDelete} />
          ))}
        </div>
      )}
    </CardWrapper>
  );
}

export default memo(ProductList);
