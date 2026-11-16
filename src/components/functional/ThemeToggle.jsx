import { useTheme } from '../../context/ThemeContext.jsx';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme(); // useContext (via helper hook)
  return (
    <button type="button" className="btn ghost" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

export default ThemeToggle;
