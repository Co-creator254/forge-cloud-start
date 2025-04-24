
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceProviderType } from "@/types";

interface ProviderFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: ServiceProviderType | "all";
  setSelectedType: (value: ServiceProviderType | "all") => void;
  selectedCounty: string;
  setSelectedCounty: (value: string) => void;
  filteredCount: number;
  counties: Array<{ value: string; label: string; }>;
  providerTypes: Array<{ value: ServiceProviderType | "all"; label: string; }>;
}

export const ProviderFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedCounty,
  setSelectedCounty,
  filteredCount,
  counties,
  providerTypes,
}: ProviderFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="relative">
        <Input
          placeholder="Search by name, service or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <Select
          value={selectedCounty}
          onValueChange={setSelectedCounty}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by county" />
          </SelectTrigger>
          <SelectContent>
            {counties.map((county) => (
              <SelectItem key={county.value} value={county.value}>
                {county.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-end">
        <span className="text-sm text-muted-foreground mr-2">
          {filteredCount} providers found
        </span>
      </div>
    </div>
  );
};
