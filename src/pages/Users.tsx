/** @format */
import { useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { api } from '../api/apiClient';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import Pagination from '../components/Pagination';
import UserTable from '../components/UserTable';
import { useUI } from '../hooks/useUI';

type SortField = 'firstName' | 'age' | 'email';
type SortOrder = 'asc' | 'desc';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');

  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const { itemsPerPage } = useUI();
  const limit = itemsPerPage;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    try {
      const endpoint = debouncedSearch
        ? `/users/search?q=${debouncedSearch}&limit=${limit}&skip=${
            page * limit
          }`
        : `/users?limit=${limit}&skip=${page * limit}`;

      const res = await api.get(endpoint);
      let filteredUsers = res.data.users || [];

      if (genderFilter !== 'all') {
        filteredUsers = filteredUsers.filter(
          (u: User) => u.gender === genderFilter
        );
      }
      if (roleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(
          (u: User) => u.role === roleFilter
        );
      }
      if (ageFilter !== 'all') {
        const [min, max] = ageFilter.split('-').map(Number);
        filteredUsers = filteredUsers.filter((u: User) => {
          if (max) return u.age >= min && u.age <= max;
          return u.age >= min;
        });
      }

      filteredUsers.sort((a: User, b: User) => {
        let comparison = 0;

        if (sortField === 'firstName') {
          comparison = a.firstName.localeCompare(b.firstName);
        } else if (sortField === 'age') {
          comparison = a.age - b.age;
        } else if (sortField === 'email') {
          comparison = a.email.localeCompare(b.email);
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });

      setUsers(filteredUsers);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  }, [
    page,
    debouncedSearch,
    limit,
    genderFilter,
    roleFilter,
    ageFilter,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const clearFilters = () => {
    setGenderFilter('all');
    setRoleFilter('all');
    setAgeFilter('all');
    setSearch('');
    setSortField('firstName');
    setSortOrder('asc');
  };

  const activeFiltersCount = [genderFilter, roleFilter, ageFilter].filter(
    (f) => f !== 'all'
  ).length;

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-base-content mb-2">
          Users List
        </h1>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 w-4 h-4" />
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

        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-outline gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Sort: {sortField} ({sortOrder})
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
            <li className="menu-title">
              <span>Sort by</span>
            </li>
            <li>
              <a
                onClick={() => toggleSort('firstName')}
                className={sortField === 'firstName' ? 'active' : ''}>
                Name {sortField === 'firstName' && `(${sortOrder})`}
              </a>
            </li>
            <li>
              <a
                onClick={() => toggleSort('age')}
                className={sortField === 'age' ? 'active' : ''}>
                Age {sortField === 'age' && `(${sortOrder})`}
              </a>
            </li>
            <li>
              <a
                onClick={() => toggleSort('email')}
                className={sortField === 'email' ? 'active' : ''}>
                Email {sortField === 'email' && `(${sortOrder})`}
              </a>
            </li>
          </ul>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn btn-outline h-10 min-h-0 gap-2 ${
            activeFiltersCount > 0 ? 'btn-primary' : ''
          }`}>
          <Filter className="w-4 h-4" />
          Filter
          {activeFiltersCount > 0 && (
            <span className="badge badge-sm">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="card bg-base-100 border border-base-300 shadow-md">
          <div className="card-body p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="select select-bordered select-sm w-full">
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Role</span>
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="select select-bordered select-sm w-full">
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Age Range</span>
                </label>
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="select select-bordered select-sm w-full">
                  <option value="all">All Ages</option>
                  <option value="18-25">18-25</option>
                  <option value="26-35">26-35</option>
                  <option value="36-50">36-50</option>
                  <option value="51-100">51+</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">&nbsp;</span>
                </label>
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm"
                  disabled={
                    activeFiltersCount === 0 &&
                    sortField === 'firstName' &&
                    sortOrder === 'asc'
                  }>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-base-content/60">
        Showing <strong>{users.length}</strong> of <strong>{total}</strong>{' '}
        results
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
