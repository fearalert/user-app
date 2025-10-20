/** @format */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/apiClient';
import { User } from '../types';
import {
  ChevronLeft,
  MapPin,
  Mail,
  Phone,
  Heart,
  HeartOff,
  CreditCard,
  Coins,
} from 'lucide-react';
import { useUI } from '../hooks/useUI';
import WorkDetails from '../components/WorkDetails';

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'timeline'>('about');
  const navigate = useNavigate();

  const { favorites, toggleFavorite } = useUI();
  const isFavourite = user ? favorites.includes(user.id) : false;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user', err);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-base-100 rounded-2xl shadow-lg space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost btn-sm flex items-center gap-2 mb-4">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <aside className="flex flex-col items-start gap-6">
          <img
            src={user.image}
            alt={user.firstName}
            className="w-72 h-72 rounded-2xl object-cover shadow-md"
          />
          <WorkDetails user={user} />
        </aside>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-4 items-center mb-2">
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center text-gray-500 gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {user.address?.city}, {user.address?.state}
                </span>
              </div>
            </div>

            <p className="text-primary font-medium">{user.company?.title}</p>
          </div>

          <button
            onClick={() => toggleFavorite(user.id)}
            className={`btn flex items-center gap-2 transition-all duration-150 ${
              isFavourite ? 'btn-accent text-white' : 'btn-outline btn-accent'
            }`}>
            {isFavourite ? (
              <>
                <Heart className="w-4 h-4 fill-current" />
                Added to Favourites
              </>
            ) : (
              <>
                <HeartOff className="w-4 h-4" />
                Add to Favourites
              </>
            )}
          </button>

          <div className="border-b border-base-300 flex gap-6 mt-6">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === 'about'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              About
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === 'timeline'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-primary'
              }`}>
              Timeline
            </button>
          </div>

          <div className="pt-6 space-y-6">
            {activeTab === 'about' ? (
              <>
                <div className="card bg-base-200 shadow-sm border border-base-300">
                  <div className="card-body space-y-3">
                    <h2 className="card-title text-base-content/90">
                      Contact Information
                    </h2>
                    <div className="flex flex-col items-start space-y-3 text-gray-700">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        {user.phone}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <a
                          href={`mailto:${user.email}`}
                          className="text-blue-500">
                          {user.email}
                        </a>
                      </p>
                      <p className="col-span-2 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-1" />
                        <span>
                          {user.address?.address}, {user.address?.city},{' '}
                          {user.address?.state}, {user.address?.country}{' '}
                          {user.address?.postalCode}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200 shadow-sm border border-base-300">
                  <div className="card-body space-y-3">
                    <h2 className="card-title text-base-content/90">
                      Basic Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
                      <span>
                        <strong>Gender:</strong> {user.gender}
                      </span>
                      <p>
                        <strong>Age:</strong> {user.age}
                      </p>
                      <p>
                        <strong>Birthday:</strong> {user.birthDate || '—'}
                      </p>
                      <p>
                        <strong>Blood Group:</strong>
                        <span className="mx-4 badge badge-outline badge-primary w-max">
                          {user.bloodGroup}
                        </span>
                      </p>
                      <p>
                        <strong>Hair Color:</strong>
                        <span
                          className={`mx-4 badge badge-outline badge-error w-max text-error`}>
                          {user.hair.color}
                        </span>
                      </p>
                      <p>
                        <strong>Hair Type:</strong> {user.hair.type}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="card bg-base-200 shadow-sm border border-base-300">
                  <div className="card-body space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-base-content/90">
                        Bank Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
                      <p>
                        <strong>Card Type:</strong> {user.bank?.cardType}
                      </p>
                      <p>
                        <strong>Card Number:</strong> {user.bank?.cardNumber}
                      </p>
                      <p>
                        <strong>Expires:</strong> {user.bank?.cardExpire}
                      </p>
                      <p>
                        <strong>IBAN:</strong> {user.bank?.iban}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200 shadow-sm border border-base-300">
                  <div className="card-body space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-primary" />
                      <h2 className="card-title text-base-content/90">
                        Crypto Details
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-gray-700">
                      <p>
                        <strong>Coin:</strong> {user.crypto?.coin}
                      </p>
                      <p>
                        <strong>Wallet:</strong> {user.crypto?.wallet}
                      </p>
                      <p>
                        <strong>Network:</strong> {user.crypto?.network}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
