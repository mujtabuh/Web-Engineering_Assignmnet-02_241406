import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/functional/Header.jsx';
import InventoryMetrics from './components/functional/InventoryMetrics.jsx';
import ProductForm from './components/functional/ProductForm.jsx';
import ProductList from './components/functional/ProductList.jsx';
import CardWrapper from './components/functional/CardWrapper.jsx';
import Filters from './components/functional/Filters.jsx';
import { getStatus } from './components/functional/ProductCard.jsx';
import AuditLogger from './components/class/AuditLogger.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';

const SEED = [
  { id: 1, title: 'Wireless Mouse', category: 'Electronics', price: 24.99, stock: 42 },
  { id: 2, title: 'Mechanical Keyboard', category: 'Electronics', price: 89.5, stock: 4 },
  { id: 3, title: 'Cotton T-Shirt', category: 'Clothing', price: 15, stock: 0 },
  { id: 4, title: 'Desk Lamp', category: 'Home', price: 32.75, stock: 18 },
  { id: 5, title: 'JavaScript: The Good Parts', category: 'Books', price: 21.4, stock: 3 },
  { id: 6, title: 'Yoga Mat', category: 'Sports', price: 27, stock: 25 },
];

let nextEventId = 0;

function App() {
  // useState: filters + latest operation; products are persisted via a custom hook
  const [products, setProducts] = useLocalStorage('products', SEED);
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [event, setEvent] = useState(null);

  const log = useCallback((type, message) => {
    setEvent({ id: `${Date.now()}-${nextEventId++}`, type, message });
  }, []);

  // useCallback: stable handler references so memoised children don't re-render needlessly
  const handleAdd = useCallback(
    (data) => {
      setProducts((prev) => [{ id: Date.now(), ...data }, ...prev]);
      log('add', `Product added: "${data.title}" (${data.stock} units)`);
    },
    [setProducts, log]
  );

  // latest products readable inside stable callbacks without re-creating them
  const productsRef = useRef(products);
  productsRef.current = products;

  const handleStock = useCallback(
    (id, delta) => {
      const p = productsRef.current.find((x) => x.id === id);
      if (!p) return;
      const stock = Math.max(0, p.stock + delta);
      if (stock === p.stock) return;
      setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, stock } : x)));
      log('update', `Stock updated: "${p.title}" ${p.stock} → ${stock}`);
    },
    [setProducts, log]
  );

  const handleDelete = useCallback(
    (id) => {
      const p = productsRef.current.find((x) => x.id === id);
      setProducts((prev) => prev.filter((x) => x.id !== id));
      if (p) log('delete', `Item deleted: "${p.title}"`);
    },
    [setProducts, log]
  );

  // useMemo: derived data only recomputed when its inputs change
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (status === 'All' || getStatus(p.stock).label === status) &&
        (!q || p.title.toLowerCase().includes(q))
    );
  }, [products, category, status, search]);

  const metrics = useMemo(
    () => ({
      products: products.length,
      units: products.reduce((sum, p) => sum + p.stock, 0),
      value: products.reduce((sum, p) => sum + p.stock * p.price, 0),
      low: products.filter((p) => getStatus(p.stock).label === 'Low Stock').length,
      out: products.filter((p) => p.stock === 0).length,
    }),
    [products]
  );

  // useEffect: dynamic document title (active = in stock at least 1 unit)
  const activeCount = useMemo(() => products.filter((p) => p.stock > 0).length, [products]);
  useEffect(() => {
    document.title = `Inventory (${activeCount} active product${activeCount === 1 ? '' : 's'})`;
  }, [activeCount]);

  return (
    <div className="container">
      <Header totalProducts={products.length} lowCount={metrics.low + metrics.out} />
      <InventoryMetrics metrics={metrics} />
      <div className="layout">
        <aside>
          <ProductForm onAddProduct={handleAdd} />
          <AuditLogger event={event} />
        </aside>
        <main>
          <CardWrapper title="Filters">
            <Filters
              category={category}
              status={status}
              search={search}
              onCategory={setCategory}
              onStatus={setStatus}
              onSearch={setSearch}
            />
          </CardWrapper>
          <ProductList
            products={filtered}
            totalCount={products.length}
            onUpdateStock={handleStock}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
