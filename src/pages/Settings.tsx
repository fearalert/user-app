/** @format */
import UserTable from '../components/UserTable';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import { Sun, Moon, Star } from 'lucide-react';

export default function Settings() {
  const {
    theme,
    setTheme,
    itemsPerPage,
    setItemsPerPage,
    favorites,
    resetPreferences,
  } = useUI();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-base-content mb-6">Settings</h1>

      <div className="card bg-base-200 shadow-lg border border-base-300 rounded-2xl">
        <div className="card-body space-y-4">
          <h2 className="card-title text-xl font-semibold text-base-content/90">
            Theme
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-2 btn w-32 justify-center transition-all ${
                theme === 'light'
                  ? 'btn-accent text-white'
                  : 'btn-outline btn-accent'
              }`}>
              <Sun className="w-5 h-5" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-2 btn w-32 justify-center transition-all ${
                theme === 'dark'
                  ? 'btn-accent text-white'
                  : 'btn-outline btn-accent'
              }`}>
              <Moon className="w-5 h-5" />
              Dark
            </button>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-lg border border-base-300 rounded-2xl">
        <div className="card-body space-y-4">
          <h2 className="card-title text-xl font-semibold text-base-content/90">
            Items Per Page
          </h2>
          <div className="flex flex-wrap gap-4">
            {[5, 10, 20, 50].map((n) => (
              <button
                key={n}
                onClick={() => setItemsPerPage(n)}
                className={`btn w-20 ${
                  itemsPerPage === n
                    ? 'btn-accent text-white'
                    : 'btn-outline btn-accent'
                }`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-base-200 shadow-lg border border-base-300 rounded-2xl">
        <div className="card-body space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            <h2 className="card-title text-xl font-semibold text-base-content/90">
              Favourites
            </h2>
          </div>
          <p className="text-gray-600">
            You currently have <strong>{favorites.length}</strong> favourite
            {favorites.length === 1 ? ' user' : ' users'}.
          </p>
          {favorites.length > 0 && (
            <button
              onClick={resetPreferences}
              className="btn btn-error btn-outline btn-wide mt-2 hover:scale-105 transition-transform">
              Reset Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
