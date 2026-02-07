
// Detailed dialect detection logic for Kenyan languages
// Uses specific phoneme patterns and unique vocabulary markers

interface DialectScore {
  dialect: string;
  score: number;
  confidence: 'low' | 'medium' | 'high';
}

export const detectDialect = (text: string): DialectScore => {
  const lowerText = text.toLowerCase();
  
  const rules = [
    {
      id: 'kikuyu',
      markers: ['wĩra', 'mũgũnda', 'irio', 'mbembe', 'mũrĩmi', 'ngai', 'mũthamaki', 'atĩrĩrĩ', 'nyũmba', 'gĩkũyũ', 'mũndũ', 'mwathani'],
      patterns: [/ng(a|e|i|o|u)/, /mb(e|i|u)/, /th(a|e|i|o|u)/]
    },
    {
      id: 'luo',
      markers: ['chiemo', 'puothe', 'cham', 'oduma', 'japur', 'misawa', 'erokamano', 'ber', 'adhi', 'dholuo', 'nyasaye', 'baba'],
      patterns: [/ny(a|e|i|o|u)/, /th(a|e|i|o|u)/, /dh(a|e|i|o|u)/]
    },
    {
      id: 'luhya',
      markers: ['mulembe', 'ingokho', 'obusuma', 'omwami', 'amabere', 'eshie', 'omundu', 'kho'],
      patterns: [/kh(a|e|i|o|u)/, /ts(a|e|i|o|u)/]
    },
    {
      id: 'kamba',
      markers: ['nĩ', 'wĩ', 'nĩw', 'ũu', 'mwa', 'asa', 'mwaitũ'],
      patterns: [/sy(a|e|i|o|u)/, /ĩ/]
    },
    {
      id: 'swahili',
      markers: ['habari', 'sawa', 'bei', 'soko', 'mazao', 'mahindi', 'mkulima', 'shamba', 'pesa', 'asante', 'karibu', 'kwenda', 'kula', 'chakula'],
      patterns: [/nj(a|e|i|o|u)/, /ch(a|e|i|o|u)/, /sh(a|e|i|o|u)/]
    }
  ];

  let bestMatch = { id: 'unknown', score: 0 };

  for (const rule of rules) {
    let score = 0;
    
    // Check vocabulary markers (high weight)
    rule.markers.forEach(marker => {
      if (lowerText.includes(marker)) score += 5;
    });

    // Check patterns (lower weight)
    rule.patterns.forEach(pattern => {
      const matches = lowerText.match(pattern);
      if (matches) score += matches.length * 0.5;
    });

    if (score > bestMatch.score) {
      bestMatch = { id: rule.id, score };
    }
  }

  // Determine confidence
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (bestMatch.score > 20) confidence = 'high';
  else if (bestMatch.score > 10) confidence = 'medium';

  return {
    dialect: bestMatch.id,
    score: bestMatch.score,
    confidence
  };
};
