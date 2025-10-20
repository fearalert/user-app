/** @format */

import { useEffect, useState } from 'react';
import { api } from '../api/apiClient';
import { Users, Calendar, Briefcase, Activity, Loader2 } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

export default function Dashboard() {
  const { auth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    avgAge: 0,
    maleUsers: 0,
    femaleUsers: 0,
    totalCompanies: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/users?limit=100`);
        const data = res.data.users;

        const avgAge =
          data.reduce((sum: number, u: User) => sum + u.age, 0) / data.length;
        const maleUsers = data.filter((u) => u.gender === 'male').length;
        const femaleUsers = data.filter((u) => u.gender === 'female').length;
        const totalCompanies = new Set(data.map((u) => u.company?.name)).size;

        setUsers(data);
        setStats({
          totalUsers: data.length,
          avgAge: Math.round(avgAge),
          maleUsers,
          femaleUsers,
          totalCompanies,
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch users', err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const genderData = [
    { name: 'Male', value: stats.maleUsers },
    { name: 'Female', value: stats.femaleUsers },
  ];

  const ageGroups = [
    {
      range: '18-25',
      users: users.filter((u) => u.age >= 18 && u.age <= 25).length,
    },
    {
      range: '26-35',
      users: users.filter((u) => u.age >= 26 && u.age <= 35).length,
    },
    {
      range: '36-45',
      users: users.filter((u) => u.age >= 36 && u.age <= 45).length,
    },
    {
      range: '46-55',
      users: users.filter((u) => u.age >= 46 && u.age <= 55).length,
    },
    { range: '56+', users: users.filter((u) => u.age >= 56).length },
  ];

  const COLORS = ['#3b82f6', '#ec4899'];

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Dashboard Overview
        </h1>
        <div className="text-sm opacity-70">
          Logged in as <strong>{auth?.user?.firstName}</strong>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-sm opacity-70">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-base-200 shadow-md hover:shadow-lg transition">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
                    <progress
                      className="progress progress-primary w-40 mt-2"
                      value={(stats.totalUsers / 100) * 100}
                      max="100"></progress>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md hover:shadow-lg transition">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Average Age</p>
                    <h2 className="text-2xl font-bold">{stats.avgAge}</h2>
                    <div className="badge badge-secondary mt-2">
                      Median age group: 26–35
                    </div>
                  </div>
                  <Calendar className="w-8 h-8 text-secondary" />
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md hover:shadow-lg transition">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Companies</p>
                    <h2 className="text-2xl font-bold">
                      {stats.totalCompanies}
                    </h2>
                    <div className="badge badge-accent mt-2">
                      Active partners
                    </div>
                  </div>
                  <Briefcase className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="card bg-base-200 shadow-md hover:shadow-lg transition">
              <div className="card-body">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Engagement Index (Female)
                    </p>
                    <h2 className="text-2xl font-bold text-green-600">
                      {Math.floor((stats.femaleUsers / stats.totalUsers) * 100)}
                      %
                    </h2>
                    <progress
                      className="progress progress-success w-40 mt-2"
                      value={(stats.femaleUsers / stats.totalUsers) * 100}
                      max="100"></progress>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="card bg-base-200 shadow-lg border border-base-300">
              <div className="card-body">
                <h2 className="card-title mb-4 text-lg font-semibold">
                  Gender Distribution
                </h2>
                <ResponsiveContainer
                  width="100%"
                  height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label>
                      {genderData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--b1))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card bg-base-200 shadow-lg border border-base-300">
              <div className="card-body">
                <h2 className="card-title mb-4 text-lg font-semibold">
                  Age Group Distribution
                </h2>
                <ResponsiveContainer
                  width="100%"
                  height={300}>
                  <BarChart data={ageGroups}>
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--b1))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar
                      dataKey="users"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
