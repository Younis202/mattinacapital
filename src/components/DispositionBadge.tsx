import { Clock, ThumbsUp, ThumbsDown, Phone, Building2 } from 'lucide-react';
import { DispositionType } from '../lib/supabase';

interface DispositionBadgeProps {
  disposition: DispositionType;
  onChange?: (disposition: DispositionType) => void;
  editable?: boolean;
}

const dispositionConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', hoverColor: 'hover:bg-yellow-200 dark:hover:bg-yellow-900/50' },
  interested: { label: 'Interested', icon: ThumbsUp, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', hoverColor: 'hover:bg-green-200 dark:hover:bg-green-900/50' },
  not_interested: { label: 'Not Interested', icon: ThumbsDown, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', hoverColor: 'hover:bg-red-200 dark:hover:bg-red-900/50' },
  unavailable: { label: 'Unavailable', icon: Phone, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400', hoverColor: 'hover:bg-gray-200 dark:hover:bg-gray-600' },
  corporate: { label: 'Corporate', icon: Building2, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', hoverColor: 'hover:bg-purple-200 dark:hover:bg-purple-900/50' },
};

export const DispositionBadge = ({ disposition, onChange, editable }: DispositionBadgeProps) => {
  const config = dispositionConfig[disposition];
  const Icon = config.icon;

  if (!editable) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </span>
    );
  }

  return (
    <div className="relative group">
      <button
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} ${config.hoverColor} transition-colors`}
      >
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </button>

      <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-max">
        {(Object.entries(dispositionConfig) as [DispositionType, typeof dispositionConfig[DispositionType]][]).map(([key, value]) => {
          const ItemIcon = value.icon;
          return (
            <button
              key={key}
              onClick={() => onChange?.(key)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${value.color} ${value.hoverColor} transition-colors mb-1 last:mb-0`}
            >
              <ItemIcon className="h-4 w-4" />
              {value.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
