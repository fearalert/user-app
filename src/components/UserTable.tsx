/** @format */
import React from 'react';
import { User } from '../types';
import { useUI } from '../hooks/useUI';
import { useNavigate } from 'react-router-dom';
import { Star, StarOff } from 'lucide-react';

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const { favorites, toggleFavorite } = useUI();
  const navigate = useNavigate();

  if (!users.length)
    return <p className="text-center text-gray-400 py-8">No users found</p>;

  return (
    <div className="bg-base-100 rounded-xl shadow-md overflow-x-auto border border-base-200">
      <table className="table w-full">
        <thead className="bg-base-200 text-base-content/70">
          <tr>
            <th>Fav</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Blood Group</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              className="hover:bg-base-200 transition-colors duration-150">
              <td>
                <button
                  onClick={() => toggleFavorite(u.id)}
                  className="btn btn-ghost btn-xs p-0">
                  {favorites.includes(u.id) ? (
                    <Star className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <StarOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </td>
              <td>
                <div className="avatar">
                  <div className="w-10 rounded-full ring ring-primary/40 ring-offset-base-100 ring-offset-2">
                    <img
                      src={u.image}
                      alt={u.firstName}
                    />
                  </div>
                </div>
              </td>
              <td className="font-medium">{`${u.firstName} ${u.lastName}`}</td>
              <td className="text-sm text-gray-500">{u.email}</td>
              <td>
                <span
                  className={`badge ${
                    u.gender === 'male' ? 'badge-info' : 'badge-secondary'
                  } badge-outline`}>
                  {u.gender}
                </span>
              </td>
              <td>{u.age}</td>
              <td className="text-sm">{u.phone}</td>
              <td>
                <span className="badge badge-outline badge-primary">
                  {u.bloodGroup}
                </span>
              </td>
              <td>{u.role}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline btn-primary"
                  onClick={() => navigate(`/users/${u.id}`)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
