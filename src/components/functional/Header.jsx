import ThemeToggle from './ThemeToggle.jsx';

function Header({ totalProducts, lowCount }) {
  return (
    <header className="header">
      <div>
        <h1>📦 Inventory &amp; Stock Dashboard</h1>
        <p className="muted">
          {totalProducts} product{totalProducts !== 1 && 's'} tracked
          {lowCount > 0 && <span className="warn"> · {lowCount} need attention</span>}
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}

export default Header;
