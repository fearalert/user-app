/** @format */
import { useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../api/apiClient';
import { useUI } from '../hooks/useUI';
import Pagination from '../components/Pagination';
import UserTable from '../components/UserTable';

export default function Favourites() {
  const { favorites } = useUI();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const { itemsPerPage } = useUI();

  const limit = itemsPerPage;

  const start = page * limit;
  const paginatedUsers = allUsers.slice(start, start + limit);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        if (!favorites.length) {
          setAllUsers([]);
          return;
        }

        const res = await api.get(`/users`);
        const all: User[] = res.data.users || [];

        const favUsers = all.filter((u) => favorites.includes(u.id));
        setAllUsers(favUsers);

        if (page * limit >= favUsers.length) setPage(0);
      } catch (err) {
        console.error('Failed to fetch favorite users', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favorites]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-base-content mb-4">
        Favourite Users
      </h1>

      <UserTable users={paginatedUsers} />

      {allUsers.length > limit && (
        <Pagination
          page={page}
          total={allUsers.length}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
