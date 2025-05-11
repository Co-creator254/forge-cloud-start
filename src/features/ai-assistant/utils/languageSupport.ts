
// Language detection and support
export const SWAHILI_KEYWORDS = [
  'habari', 'sawa', 'bei', 'soko', 'mazao', 'wakulima', 'chakula', 'kilimo', 'mbegu', 'maji',
  'mahindi', 'pesa', 'ngapi', 'mombasa', 'nairobi', 'viazi', 'nyanya', 'ndizi', 'embe', 'kahawa'
];
export const KIKUYU_KEYWORDS = ['wĩra', 'mũgũnda', 'irio', 'mbembe', 'mbeca', 'thoko', 'mũrĩmi'];
export const LUO_KEYWORDS = ['chiemo', 'puothe', 'cham', 'yath', 'ohala', 'lupo'];
export const KALENJIN_KEYWORDS = ['kerichek', 'imbarek', 'chepkwony', 'beek', 'korosio', 'burgeiyot'];

// Language response templates
export const languageResponses = {
  swahili: {
    greeting: "Habari! Mimi ni msaidizi wako wa kilimo. Ninaweza kukusaidia kupata masoko, kubashiri bei, kukuunganisha na maghala na wasafirishaji, kupata wanunuzi, kupendekeza suluhisho za mnyororo wa usambazaji, na kukupa taarifa kuhusu bidhaa bandia, magonjwa, sera, na teknolojia.",
    cropRequest: "Unakulima zao gani?",
    marketPrices: (crop: string) => `Bei ya soko ya ${crop} inabadilika kulingana na eneo. Nitakupa maelezo zaidi ukiniambia uko wapi.`,
    forecast: (crop: string) => `Utabiri wa bei ya ${crop} kwa wiki ijayo unaonesha kuongezeka kwa 5-10%. Unaweza kupata bei nzuri zaidi ukisubiri.`,
    maizePricesResponses: [
      "Bei ya mahindi Mombasa ni kati ya KES 50-65 kwa kilo. Soko kuu la Kongowea lina bei nzuri zaidi.",
      "Kwa sasa, mahindi yanauziwa bei ya KES 4,500 hadi 5,200 kwa gunia la 90kg katika soko la Mombasa. Bei hizi zinaweza kubadilika kulingana na msimu.",
      "Mahindi yanauzwa kwa bei ya juu zaidi katika soko la mwisho la juma huko Mombasa, kwa wastani wa KES 60 kwa kilo."
    ],
    generalResponse: "Samahani, sikuelewa vizuri. Tafadhali niulize juu ya bei ya mazao, masoko, au maghala katika eneo fulani.",
    noUnderstanding: "Samahani, sikuelewa ombi lako. Tafadhali jaribu tena kwa kutumia maneno tofauti au niambie unahitaji msaada gani kuhusu kilimo.",
  },
  kikuyu: {
    greeting: "Niatia! Nĩ niĩ mũteithia waku wa ũrĩmi. No ngũteithi kũona thoko, gũthugumĩra thogora, gũkũnyitithania na makorigiriro na athuti, gũcaria agũri, gũtaarana mĩoroorere ya wĩra, na gũkũhe ũmenyo kuuma kũrĩ arĩmi angĩ.",
    cropRequest: "Nĩ mũgũnda ũrĩa ũrahanda?",
    marketPrices: (crop: string) => `Thogora wa ${crop} ĩraugĩka kuringana na kũrĩa ũrĩ. Ningũkũhe ũhoro makĩria ũnanjĩĩre nĩkũ ũrĩ.`,
    forecast: (crop: string) => `Ũthugumĩri wa thogora wa ${crop} kiumia kĩĩ kĩrooka wonanitie kwona kwongerereka kwa 5-10%. No ũgĩe na thogora mwega makĩria ũetereire.`,
    noUnderstanding: "Nĩndagũthima, no ndiracoka kwĩgua wendi waku. Tafadhali geria rĩngĩ na ciugo ingĩ kana ũnjĩĩre ũteithio ũrĩa ũbataire igũrũ rĩa ũrĩmi.",
  },
  luo: {
    greeting: "Ber ahinya! An jakony mari mar pur. Anyalo konyi yudo chiro, koro nengo, riwakonyo gi migepe mag kano kod jooting, yudo jongiewo, chiwo paro mar migepe mag kelo cham, gi miyoi puonj ma ogol kuom jolup pur mamoko.",
    cropRequest: "Itimo pur mar ang'o?",
    marketPrices: (crop: string) => `Nengo mar ${crop} lokore kaluwore gi kama intie. Abiro miyi weche momedore ka inyisa kama intiere.`,
    forecast: (crop: string) => `Nengo mar ${crop} mar juma mabiro nyiso ni biro medore kuom 5-10%. Inyalo yudo nengo maber moloyo ka irito.`,
    noUnderstanding: "Akwayo tweyo, ok awinj penjoni maber. Tem kendo gi weche mopogore kata nyisa kony mane idwaro kuom pur.",
  },
  kalenjin: {
    greeting: "Chamgei! Ani ne bo ngo ya kerichek. Amuche anyiny sukik, astap oret, anai temik ak kobet ab getik ak boisionik ab kolet, anai bolenjik, kalenjin oret ab koitab ketik, ak anyinjin imbarek chebo burenik.",
    cropRequest: "Imbarek ainon ne imine?",
    marketPrices: (crop: string) => `Oretab ${crop} kowal koborunet nebo ole imine. Abwatin imanit anan inye ole imine.`,
    forecast: (crop: string) => `Astap ab oretab ${crop} wikit ne inoni kolewen konyor 5-10%. Imoche iny oret ne karam ingonyei.`,
    noUnderstanding: "Sabarei, matanyu kasotik. Saayi kaite ak kasaek alak anan ilenji toretinik ne icham kobo kerichek.",
  }
};

type SupportedLanguage = 'english' | 'swahili' | 'kikuyu' | 'luo' | 'kalenjin';

// Helper to detect language from message
export const detectLanguage = (message: string): SupportedLanguage => {
  const lowerMessage = message.toLowerCase();
  
  // Check for Swahili keywords
  if (SWAHILI_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'swahili';
  }
  
  // Check for Kikuyu keywords
  if (KIKUYU_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'kikuyu';
  }
  
  // Check for Luo keywords
  if (LUO_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'luo';
  }
  
  // Check for Kalenjin keywords
  if (KALENJIN_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'kalenjin';
  }
  
  // Default to English
  return 'english';
};

// For handling non-English language responses
export const handleLanguageResponse = (
  message: string, 
  detectedLanguage: SupportedLanguage
): string | null => {
  if (detectedLanguage === 'english') {
    return null; // Let the English flow handle it
  }

  const responses = languageResponses[detectedLanguage];
  
  // Extract key information from the message regardless of language
  const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot|nyanya|viazi|mahindi|embe|kahawa|chai|maharagwe|ngano|mchele|ndizi|kitunguu|kabichi|karoti/g);
  const crop = cropMatches ? cropMatches[0] : '';
  
  // Check for greetings
  if (message.match(/^(habari|jambo|hujambo|shikamoo|niatia|ber|chamgei)/i)) {
    return responses.greeting;
  }
  
  // Special case for "mahindi mombasa pesa ngapi" (How much is maize in Mombasa?)
  if (detectedLanguage === 'swahili' && 
      message.includes('mahindi') && 
      message.includes('mombasa') && 
      (message.includes('pesa') || message.includes('bei') || message.includes('ngapi'))) {
    const randomIndex = Math.floor(Math.random() * responses.maizePricesResponses.length);
    return responses.maizePricesResponses[randomIndex];
  }
  
  // If asking about a crop but no specific question detected
  if (crop) {
    if (responses.marketPrices) {
      return responses.marketPrices(crop);
    }
    return responses.cropRequest;
  }
  
  // Default no understanding response
  return responses.noUnderstanding || responses.generalResponse;
};
