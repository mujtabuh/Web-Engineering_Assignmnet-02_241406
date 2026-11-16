import { useEffect, useRef, useState } from 'react';
import CardWrapper from './CardWrapper.jsx';

export const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports'];
const EMPTY = { title: '', category: CATEGORIES[0], price: '', stock: '' };

function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState(EMPTY); // useState – controlled inputs
  const [error, setError] = useState('');
  const titleRef = useRef(null); // useRef – focus management

  // focus the title field on mount
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = form.title.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!title || !(price >= 0) || form.price === '' || !Number.isInteger(stock) || stock < 0) {
      setError('Enter a title, a price ≥ 0 and a whole-number stock ≥ 0.');
      titleRef.current.focus();
      return;
    }
    onAddProduct({ title, category: form.category, price, stock });
    setForm(EMPTY);
    setError('');
    titleRef.current.focus(); // focus again after submit
  };

  return (
    <CardWrapper title="Add product">
      <form onSubmit={handleSubmit} className="form">
        <label>
          Title
          <input ref={titleRef} name="title" value={form.title} onChange={handleChange} placeholder="e.g. Wireless Mouse" />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Price ($)
          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Stock
          <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn primary">Add product</button>
      </form>
    </CardWrapper>
  );
}

export default ProductForm;
