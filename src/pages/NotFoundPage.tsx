/** @format */

import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-error rounded-2xl mb-6 shadow-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-error mb-2">404</h1>
        <p className="text-xl font-semibold text-base-content/70 mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          to="/dashboard"
          className="btn btn-primary w-full text-base">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
