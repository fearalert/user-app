/** @format */

import { useState, useContext, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Cross, Eye, EyeOffIcon, Lock, User2Icon } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext not found.');
  }

  const { login, loading } = authContext;

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const res = await login({ username, password, expiresInMins: 30 });
    if (res.ok) {
      navigate('/dashboard');
    } else {
      setError(res.error?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">Welcome Back</h1>
          <p className="text-base-content/60 mt-2">
            Sign in to continue to your account
          </p>
        </div>

        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8">
            {error && (
              <div className="alert alert-error mb-6">
                <Cross className="inline-block w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Username</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="input input-bordered w-full pr-10 focus:input-primary transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <User2Icon />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pr-10 focus:input-primary transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-primary transition-colors">
                    {showPassword ? <Eye /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              <Link
                to="#"
                className="label-text-alt link link-hover link-primary mb-4 block text-right">
                Forgot password?
              </Link>

              <button
                type="submit"
                className={`btn btn-primary w-full text-base ${
                  loading ? 'loading' : ''
                }`}
                disabled={loading}>
                {loading ? <>Signing in...</> : <>Sign in</>}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-base-content/60">
            Don't have an account?{' '}
            <Link
              to="#"
              className="link link-primary font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
