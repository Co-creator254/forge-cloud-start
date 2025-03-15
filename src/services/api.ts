
import { DataItem, SearchFilters, Category, AwardedTender } from '@/types';

// Sample data since we're not connecting to a real API yet
const SAMPLE_DATA: DataItem[] = [
  {
    id: '1',
    title: 'Managing Tomato Blight in Wet Seasons',
    description: 'Effective strategies for managing tomato blight during rainy seasons in Kenya',
    category: 'agriculture',
    date: '2023-11-15',
    source: 'Kenya Agricultural Research Institute',
    content: 'Tomato blight is a common disease that affects tomato crops during wet seasons. Symptoms include dark spots on leaves, stems, and fruits. To manage tomato blight: 1) Plant resistant varieties 2) Improve drainage in your field 3) Apply appropriate fungicides preventatively 4) Practice crop rotation 5) Remove and destroy infected plants to prevent spread.',
    tags: ['disease', 'tomatoes', 'wet season', 'fungal disease'],
    location: 'Central Kenya',
  },
  {
    id: '2',
    title: 'Tender: Supply of Agricultural Inputs to Nakuru County',
    description: 'Tender notice for the supply of agricultural inputs to Nakuru County',
    category: 'tender',
    date: '2023-12-01',
    source: 'Nakuru County Government',
    content: 'The Nakuru County Government invites sealed bids from eligible candidates for the supply of agricultural inputs including certified seeds, fertilizers, and pesticides. Interested bidders must provide documentation of previous similar contracts, tax compliance, and business registration.',
    tags: ['tender', 'agricultural inputs', 'Nakuru'],
    location: 'Nakuru County',
    deadline: '2023-12-31',
    contact: 'procurement@nakuru.go.ke',
    url: 'https://nakuru.go.ke/tenders'
  },
  {
    id: '3',
    title: 'Livestock Supply Chain Manager Position',
    description: 'Job opening for a Livestock Supply Chain Manager in Nairobi',
    category: 'supply-chain',
    date: '2023-12-05',
    source: 'Kenya Agricultural Corporation',
    content: 'We are seeking an experienced Livestock Supply Chain Manager to oversee the entire supply chain from farm to market. Responsibilities include managing logistics, ensuring quality control, developing relationships with farmers and buyers, and optimizing the supply chain for efficiency and profitability.',
    tags: ['job', 'livestock', 'supply chain', 'management'],
    location: 'Nairobi',
    deadline: '2023-12-25',
    contact: 'careers@kac.co.ke',
    url: 'https://kac.co.ke/careers'
  },
  {
    id: '4',
    title: 'Drought-Resistant Maize Varieties for Eastern Kenya',
    description: 'Information on drought-resistant maize varieties suitable for Eastern Kenya',
    category: 'agriculture',
    date: '2023-10-20',
    source: 'Kenya Seed Company',
    content: 'Eastern Kenya often experiences drought conditions that affect maize production. Several drought-resistant varieties have been developed specifically for these conditions, including KDV-1, KDV-4, and Katumani. These varieties mature early (in about 90-120 days) and can produce reasonable yields even with limited rainfall. Proper spacing and timely planting are crucial for success with these varieties.',
    tags: ['drought', 'maize', 'Eastern Kenya', 'seed varieties'],
    location: 'Eastern Kenya',
  },
  {
    id: '5',
    title: 'Tender: Construction of Irrigation Infrastructure in Kitui',
    description: 'Tender for the construction of irrigation infrastructure in Kitui County',
    category: 'tender',
    date: '2023-11-25',
    source: 'Ministry of Agriculture',
    content: 'The Ministry of Agriculture invites tenders for the construction of irrigation infrastructure in Kitui County. The project involves construction of water intake structures, main canals, distribution networks, and farm inlets to serve approximately 2,000 hectares of farmland.',
    tags: ['irrigation', 'construction', 'infrastructure', 'Kitui'],
    location: 'Kitui County',
    deadline: '2024-01-15',
    contact: 'tenders@agriculture.go.ke',
    url: 'https://agriculture.go.ke/tenders'
  },
  {
    id: '6',
    title: 'Agricultural Produce Export Logistics Coordinator',
    description: 'Job opening for an Agricultural Produce Export Logistics Coordinator',
    category: 'supply-chain',
    date: '2023-12-10',
    source: 'Fresh Exports Ltd',
    content: 'Fresh Exports Ltd is seeking an Agricultural Produce Export Logistics Coordinator to manage the logistics of exporting fresh agricultural produce from Kenya to European markets. The role involves coordinating with farmers, quality inspection, documentation, cold chain management, and working with shipping partners.',
    tags: ['job', 'export', 'logistics', 'fresh produce'],
    location: 'Mombasa',
    deadline: '2024-01-05',
    contact: 'hr@freshexports.co.ke',
    url: 'https://freshexports.co.ke/careers'
  }
];

// Simulated API calls
export const fetchData = async (filters?: SearchFilters): Promise<DataItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // If the category is 'awarded-tender', fetch from Huggingface
  if (filters?.category === 'awarded-tender') {
    try {
      const tenders = await fetchAwardedTenders();
      let filteredTenders = tenders;
      
      // Apply query filter if it exists
      if (filters.query) {
        const query = filters.query.toLowerCase();
        filteredTenders = filteredTenders.filter(tender => 
          tender.tendersubject.toLowerCase().includes(query) || 
          tender.supplier.toLowerCase().includes(query) ||
          (tender.procuringentity && tender.procuringentity.toLowerCase().includes(query))
        );
      }
      
      // Apply location filter if it exists
      if (filters.location) {
        const location = filters.location.toLowerCase();
        filteredTenders = filteredTenders.filter(tender => 
          (tender.procuringentitycounty && tender.procuringentitycounty.toLowerCase().includes(location))
        );
      }
      
      // Map awarded tenders to DataItem format
      return filteredTenders.map(tender => ({
        id: tender.tenderno || Math.random().toString(36).substring(2, 9),
        title: tender.tendersubject,
        description: `Tender awarded to ${tender.supplier}`,
        category: 'awarded-tender',
        date: tender.awarddate || tender.finyrq || new Date().toISOString().split('T')[0],
        source: tender.procuringentity || 'Kenya Public Procurement',
        content: `
          Tender Number: ${tender.tenderno || 'N/A'}
          Subject: ${tender.tendersubject || 'N/A'}
          Supplier: ${tender.supplier || 'N/A'}
          Awarded Amount: ${tender.awardedamount || 'N/A'} ${tender.currency || 'KES'}
          Award Date: ${tender.awarddate || 'N/A'}
          Financial Year Quarter: ${tender.finyrq || 'N/A'}
          Procurement Method: ${tender.procurementmethod || 'N/A'}
          Procuring Entity: ${tender.procuringentity || 'N/A'}
          County: ${tender.procuringentitycounty || 'N/A'}
          Contact: ${tender.contactname || 'N/A'}
          Contact Email: ${tender.contactemail || 'N/A'}
          Contact Tel: ${tender.contacttel || 'N/A'}
          Contact Address: ${tender.contactaddress || 'N/A'}
        `,
        tags: [
          'awarded', 
          tender.procurementmethod || 'procurement', 
          tender.procuringentitycounty || 'kenya'
        ],
        location: tender.procuringentitycounty,
        contact: tender.contactemail || tender.contacttel
      }));
    } catch (error) {
      console.error("Error fetching awarded tenders:", error);
      return [];
    }
  }
  
  if (!filters) return SAMPLE_DATA;
  
  let filteredData = [...SAMPLE_DATA];
  
  // Apply category filter
  if (filters.category) {
    filteredData = filteredData.filter(item => item.category === filters.category);
  }
  
  // Apply query filter (search in title and description)
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
  }
  
  // Apply location filter
  if (filters.location) {
    const location = filters.location.toLowerCase();
    filteredData = filteredData.filter(item => 
      item.location?.toLowerCase().includes(location)
    );
  }
  
  // Apply date filters
  if (filters.dateFrom) {
    filteredData = filteredData.filter(item => 
      new Date(item.date) >= filters.dateFrom!
    );
  }
  
  if (filters.dateTo) {
    filteredData = filteredData.filter(item => 
      new Date(item.date) <= filters.dateTo!
    );
  }
  
  return filteredData;
};

export const fetchItemById = async (id: string): Promise<DataItem | undefined> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return SAMPLE_DATA.find(item => item.id === id);
};

export const getCategoryName = (category: Category): string => {
  switch (category) {
    case 'agriculture':
      return 'Agricultural Issues';
    case 'tender':
      return 'Tender Opportunities';
    case 'supply-chain':
      return 'Supply Chain Jobs';
    case 'awarded-tender':
      return 'Awarded Tenders';
    default:
      return 'Unknown Category';
  }
};

// Function to fetch awarded tenders from Huggingface
export const fetchAwardedTenders = async (): Promise<AwardedTender[]> => {
  try {
    const response = await fetch(
      "https://datasets-server.huggingface.co/first-rows?dataset=Olive254%2FAwardedPublicProcurementTendersKenya&config=default&split=train"
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract rows from the response
    const rows = data.rows || [];
    
    // Map the rows to our AwardedTender interface
    return rows.map((row: any) => {
      const tender: AwardedTender = {
        tenderno: row.row.tenderno || '',
        tendersubject: row.row.tendersubject || '',
        finyrq: row.row.finyrq || '',
        supplier: row.row.supplier || '',
        supplierscore: row.row.supplierscore,
        supplierbid: row.row.supplierbid,
        contactaddress: row.row.contactaddress,
        contactname: row.row.contactname,
        contacttel: row.row.contacttel,
        contactemail: row.row.contactemail,
        awarddate: row.row.awarddate,
        awardedamount: row.row.awardedamount,
        currency: row.row.currency,
        procuringentity: row.row.procuringentity,
        procuringentitycounty: row.row.procuringentitycounty,
        procurementmethod: row.row.procurementmethod
      };
      return tender;
    });
  } catch (error) {
    console.error("Error fetching awarded tenders:", error);
    return [];
  }
};
