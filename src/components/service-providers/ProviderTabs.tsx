import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceProviderType } from "@/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ProviderTabsProps {
  activeTab: ServiceProviderType | "all";
  onTabChange: (value: string) => void;
  providerTypes: Array<{ value: ServiceProviderType | "all"; label: string; }>;
}

export const ProviderTabs = ({ activeTab, onTabChange, providerTypes }: ProviderTabsProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <TabsList className="inline-flex h-auto w-max gap-1 p-1">
        {providerTypes.map((type) => (
          <TabsTrigger 
            key={type.value} 
            value={type.value} 
            className="text-xs md:text-sm px-3 py-2 whitespace-nowrap font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {type.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
};
