import React, { createContext, useContext, useState, ReactNode } from 'react';

// Puducherry Leader Dashboard - Filter Context

interface FilterState {
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  constituency: string;
  district: string; // alias for backward compatibility
  topic: string;
  source: string;
  language: 'all' | 'tamil' | 'english' | 'french';
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  timeRange: '24h',
  constituency: 'all',
  district: 'all',
  topic: 'all',
  source: 'all',
  language: 'all',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilter, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
