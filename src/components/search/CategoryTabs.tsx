
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Category } from '@/types';

interface CategoryTabsProps {
  activeTab: Category | 'all';
  setActiveTab: (tab: Category | 'all') => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as Category | 'all')}
      >
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="agriculture" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Agricultural Issues
          </TabsTrigger>
          <TabsTrigger 
            value="tender" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Tender Opportunities
          </TabsTrigger>
          <TabsTrigger 
            value="solutions" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Agricultural Solutions
          </TabsTrigger>
          <TabsTrigger 
            value="awarded-tender" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Awarded Tenders
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
