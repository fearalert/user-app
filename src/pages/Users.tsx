/** @format */
import { useEffect, useState } from 'react';
import { User } from '../types';
import { api } from '../api/apiClient';
import { Search } from 'lucide-react';
import Pagination from '../components/Pagination';
import UserTable from '../components/UserTable';
import { useUI } from '../hooks/useUI';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const { itemsPerPage } = useUI();

  const limit = itemsPerPage;

  const fetchUsers = async () => {
    try {
      const endpoint = search
        ? `/users/search?q=${search}&limit=${limit}&skip=${page * limit}`
        : `/users?limit=${limit}&skip=${page * limit}`;

      const res = await api.get(endpoint);
      setUsers(res.data.users || []);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-base-content mb-2">Users</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      <UserTable users={users} />
      <Pagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
}
