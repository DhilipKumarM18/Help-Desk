import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { dark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-${dark ? "light" : "dark"} rounded-circle shadow`}
    >
      {dark ? "🌞" : "🌙"}
    </button>
  );
};

export default ThemeToggle;
