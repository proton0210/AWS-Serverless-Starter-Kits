'use client';

export type FilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;
}

export default function TodoFilters({
  currentFilter,
  onFilterChange,
  totalCount,
  activeCount,
  completedCount,
}: TodoFiltersProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            currentFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            currentFilter === 'active'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
            currentFilter === 'completed'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </div>
    </div>
  );
}