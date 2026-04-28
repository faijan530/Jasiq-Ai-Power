import React from 'react';

interface TenantJobBadgeProps {
  tenantId: string | null;
}

export const TenantJobBadge: React.FC<TenantJobBadgeProps> = ({ tenantId }) => {
  if (!tenantId) return null;

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800">
      <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
      Placement Job
    </span>
  );
};
