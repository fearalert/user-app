/** @format */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';

const Header = () => {
  const { theme, setTheme, itemsPerPage, setItemsPerPage, resetPreferences } =
    useUI();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link
          to="#"
          className="btn btn-ghost normal-case text-xl">
          User Management
        </Link>
      </div>

      <div className="flex-none gap-2">
        <select
          className="select select-bordered w-auto"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

        <button
          className="btn btn-ghost"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>

        <button
          className="btn btn-outline"
          onClick={resetPreferences}>
          Reset
        </button>

        {auth ? (
          <>
            <span className="px-2">{auth.user?.firstName}</span>
            <button
              className="btn btn-error"
              onClick={() => {
                logout();
                navigate('/login');
              }}>
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
