
import React from 'react';
import ResultCard from '@/components/ResultCard';
import { DataItem, Category, SOLUTION_CATEGORIES } from '@/types';
import { getCategoryName } from '@/services/apiUtils';

interface SolutionCategoryProps {
  title: string;
  solutions: {
    title: string;
    approach: string;
    challenge: string;
  }[];
}

// Define the SolutionCategory component before using it
const SolutionCategory: React.FC<SolutionCategoryProps> = ({ title, solutions }) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-3 text-primary">{title}</h4>
      <div className="space-y-4">
        {solutions.map((solution, index) => (
          <div key={index} className="border border-border rounded-lg p-4 bg-card">
            <h5 className="font-medium text-base mb-2">{solution.title}</h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-primary">Novel Approach: </span>
                <span className="text-sm">{solution.approach}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-primary">Challenges: </span>
                <span className="text-sm">{solution.challenge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
    if (activeTab === 'solutions') {
      return (
        <div className="py-8">
          <h3 className="text-lg font-medium mb-4">Innovative Solutions Not Yet Implemented</h3>
          <div className="space-y-6">
            <SolutionCategory 
              title="Market Access Solutions" 
              solutions={[
                {
                  title: "Dynamic Forward Contracts Platform",
                  approach: "Create AI-driven smart contracts that adjust based on quality metrics captured via smartphone photos at delivery",
                  challenge: "Most platforms offer static contracts that don't adapt to quality variations, creating disputes. Technical complexities in implementing verifiable quality assessment via smartphones and reliable AI grading algorithms have hindered adoption."
                },
                {
                  title: "Micro-Export Aggregation",
                  approach: "Enable small farmers to pool resources to meet minimum export requirements through cooperative virtual entities",
                  challenge: "Most platforms focus on local markets. International trade regulations and logistics complexity for small-batch exports have been barriers, along with insufficient coordination mechanisms for quality standardization."
                }
              ]} 
            />
            <SolutionCategory 
              title="Logistical Innovations" 
              solutions={[
                {
                  title: "Shared Cold Chain Marketplace",
                  approach: "Create a timeshare model for cold storage facilities where farmers rent slots in minutes/hours instead of days",
                  challenge: "Traditional models require full-day rentals. The technical requirement for granular access control systems and real-time temperature monitoring has been prohibitive in rural areas with connectivity challenges."
                },
                {
                  title: "Crowd-Sourced Rural Transport Network",
                  approach: "Build an Uber-like platform specifically for agricultural goods using motorcycles and small vehicles already in rural areas",
                  challenge: "Logistics apps typically focus on urban areas. Rural implementation faces challenges with mapping uncharted roads, offline functionality requirements, and handling varying produce types with different transport needs."
                }
              ]} 
            />
            <SolutionCategory 
              title="Payment & Financing Solutions" 
              solutions={[
                {
                  title: "Harvest-Indexed Microloans",
                  approach: "Offer small loans with repayment schedules tied to predicted harvest dates based on planting data and weather forecasts",
                  challenge: "Traditional financing uses fixed schedules. Creating reliable harvest prediction models that account for local climate variations and crop differences requires sophisticated data integration that most fintech companies haven't prioritized."
                },
                {
                  title: "Digital Escrow with Quality Verification",
                  approach: "Implement a payment system where funds are released only after quality verification through photo/video evidence or third-party verification",
                  challenge: "Trust issues between buyers and sellers; technical complexity of creating tamper-proof quality verification in low-connectivity environments."
                }
              ]} 
            />
            <SolutionCategory 
              title="Quality & Traceability Innovations" 
              solutions={[
                {
                  title: "Collaborative Blockchain Verification",
                  approach: "Create a system where multiple stakeholders (farmers, transporters, buyers) independently record data points that must match to verify authenticity",
                  challenge: "Most blockchain implementations rely on single-point data entry. Creating multiple verification points with lightweight blockchain implementations that work on basic smartphones has been technically challenging."
                },
                {
                  title: "Visual Quality Passport",
                  approach: "Generate a visual \"passport\" for produce with time-stamped photos at each supply chain stage, verifiable via QR code",
                  challenge: "High data storage requirements and technical complexity in creating visual fingerprinting that works across different devices and lighting conditions."
                }
              ]} 
            />
            <SolutionCategory 
              title="Information Asymmetry Solutions" 
              solutions={[
                {
                  title: "Anonymous Price Discovery",
                  approach: "Create a blind bidding system where buyers can't see each other's offers but farmers can view aggregate statistics",
                  challenge: "Market manipulation concerns and technical complexity in creating truly anonymous yet verifiable bidding systems."
                },
                {
                  title: "Predictive Regional Supply Forecasting",
                  approach: "Combine satellite imagery, weather data, and crowdsourced planting information to predict regional supply months in advance",
                  challenge: "Requires sophisticated data integration across multiple sources with varying reliability and availability."
                }
              ]} 
            />
          </div>
        </div>
      );
    }
    
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
