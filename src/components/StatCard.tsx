import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  borderColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconTextColor = 'text-brand-600',
  borderColor,
}) => {
  return (
    <div
      className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between ${
        borderColor ? `border-l-4 ${borderColor}` : ''
      }`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {Icon && (
        <div className={`p-3.5 rounded-xl ${iconBgColor} ${iconTextColor} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
