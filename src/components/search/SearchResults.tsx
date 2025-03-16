
import React from 'react';
import ResultCard from '@/components/ResultCard';
import { DataItem, Category } from '@/types';
import { getCategoryName } from '@/services/api';

interface SearchResultsProps {
  results: DataItem[];
  isLoading: boolean;
  activeTab: Category | 'all';
  onItemClick: (item: DataItem) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  activeTab,
  onItemClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No results found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {results.length} Result{results.length !== 1 ? 's' : ''} {activeTab !== 'all' ? `in ${getCategoryName(activeTab as Category)}` : ''}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map((item) => (
          <ResultCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
