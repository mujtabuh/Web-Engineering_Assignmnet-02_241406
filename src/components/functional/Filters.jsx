import { CATEGORIES } from './ProductForm.jsx';

function Filters({ category, status, search, onCategory, onStatus, onSearch }) {
  return (
    <div className="filters">
      <input type="search" placeholder="Search…" value={search} onChange={(e) => onSearch(e.target.value)} />
      <select value={category} onChange={(e) => onCategory(e.target.value)} aria-label="Category filter">
        <option value="All">All categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={status} onChange={(e) => onStatus(e.target.value)} aria-label="Stock status filter">
        <option value="All">All stock levels</option>
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
    </div>
  );
}

export default Filters;
