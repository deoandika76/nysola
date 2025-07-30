// components/DashboardCard.tsx
import React from 'react';

interface Props {
  title: string;
  value: string | number;
  emoji?: string;
  subtitle?: string;
  color?: string;
}

export default function DashboardCard({
  title,
  value,
  emoji = '📊',
  subtitle,
  color = 'cyan',
}: Props) {
  return (
    <div className={`bg-carbon p-5 rounded-xl shadow-md border-l-4 border-${color}-400`}>
      <h3 className={`text-lg font-semibold text-${color}-300`}>
        {emoji} {title}
      </h3>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
}