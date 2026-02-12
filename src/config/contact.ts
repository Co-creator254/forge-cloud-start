// Contact configuration
export const CONTACT_INFO = {
  phone: import.meta.env.VITE_CONTACT_PHONE || '+254 745 824 354',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'sokoconnect@tenderzville-portal.co.ke',
  location: import.meta.env.VITE_CONTACT_LOCATION || 'Nairobi, Kenya',
  whatsappGroupLink: import.meta.env.VITE_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/LZQF0tXWP9RGm6Hk7Oscxg?mode=ac_t'
};

// Social media links
export const SOCIAL_LINKS = {
  facebook: import.meta.env.VITE_FACEBOOK_URL || 'https://facebook.com/sokoconnect',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/sokoconnect',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || 'https://linkedin.com/company/sokoconnect',
  youtube: import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com/sokoconnect'
};

// Company information
export const COMPANY_INFO = {
  name: import.meta.env.VITE_COMPANY_NAME || 'SokoConnect',
  description: import.meta.env.VITE_COMPANY_DESCRIPTION || 'Connecting farmers, traders, and service providers for a better agricultural ecosystem across Africa.',
  tagline: import.meta.env.VITE_COMPANY_TAGLINE || 'Empowering African Agriculture',
  website: import.meta.env.VITE_COMPANY_WEBSITE || 'https://sokoconnect.co.ke'
};
