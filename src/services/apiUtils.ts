
export const getCategoryName = (category: string): string => {
  const categories: Record<string, string> = {
    'agriculture': 'Agricultural Issues',
    'solutions': 'Agricultural Solutions',
    'tender': 'Tender',
    'awarded-tender': 'Awarded Tender'
  };
  
  return categories[category] || category;
};

export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

export const getVerifiedSourceDomains = (): string[] => {
  return [
    'kilimo.go.ke',
    'kenyaseed.com',
    'kalro.org',
    'moa.go.ke',
    'nafis.go.ke',
    'agritechinnovations.co.ke',
    'kephis.org',
    'eaff.org',
    'farmafrica.org',
    'agriculture.go.ke',
    'agra.org'
  ];
};

export const isVerifiedSource = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    return getVerifiedSourceDomains().some(verifiedDomain => 
      domain === verifiedDomain || domain.endsWith(`.${verifiedDomain}`)
    );
  } catch (e) {
    return false;
  }
};

// For results that have no URL, generate a link to a search query for them
export const generateSearchUrl = (title: string, source: string): string => {
  const query = encodeURIComponent(`${title} ${source} Kenya agriculture`);
  return `https://www.google.com/search?q=${query}`;
};

// Check if the content is likely legitimate based on content analysis
export const assessContentLegitimacy = (item: any): boolean => {
  // Check for common indicators of fake content
  const title = item.title?.toLowerCase() || '';
  const description = item.description?.toLowerCase() || '';
  
  // Red flags in content
  const suspiciousTerms = [
    'guaranteed results',
    'miracle solution',
    'secret that experts',
    '100% effective',
    'revolutionary breakthrough'
  ];
  
  // Check for suspicious terms
  for (const term of suspiciousTerms) {
    if (title.includes(term) || description.includes(term)) {
      return false;
    }
  }
  
  // Verify the source is known
  if (item.source) {
    const knownSources = [
      'Ministry of Agriculture',
      'Kenya Seed Company',
      'Kenya Agricultural Research Institute',
      'KALRO',
      'FAO',
      'AgriTech Innovations',
      'Kenya Plant Health Inspectorate Service',
      'National Farmers Information Service'
    ];
    
    if (knownSources.some(source => item.source.includes(source))) {
      return true;
    }
  }
  
  // Default to returning true if no red flags
  return true;
};
