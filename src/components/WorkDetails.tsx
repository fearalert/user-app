/** @format */

import { Building2, MapPin, Globe2, Compass } from 'lucide-react';

export default function WorkDetails({ user }: { user: any }) {
  const company = user?.company;

  return (
    <section>
      <div className="divider my-1 text-lg font-semibold mb-3 text-base-content/90">
        Work Details
      </div>

      <div className="p-4 rounded-xl bg-base-200/70 shadow-sm border border-base-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-base-content">
                {company?.name || 'N/A'}
              </h3>
              <p className="text-sm text-base-content/70 mt-0.5">
                {company?.title || '—'}
              </p>
            </div>
          </div>
          <div>
            <span className="badge badge-primary badge-outline px-3 py-1 text-sm font-medium">
              {company?.department || '—'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
            <div className="text-sm leading-relaxed text-base-content/80">
              <p>{company?.address?.address || 'N/A'}</p>
              <p>
                {company?.address?.city}, {company?.address?.state}{' '}
                {company?.address?.postalCode}
              </p>
              <p>{company?.address?.country}</p>
            </div>
          </div>

          {company?.address?.coordinates && (
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Compass className="w-4 h-4 text-accent" />
              <p>
                <span className="font-semibold">Coordinates:</span>{' '}
                {company.address.coordinates.lat},{' '}
                {company.address.coordinates.lng}
              </p>
            </div>
          )}

          {company?.address?.city && (
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Globe2 className="w-4 h-4 text-primary" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  company.address.city
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-primary font-medium">
                View on Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
