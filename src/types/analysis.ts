export interface TextSegment {
  id: string;
  text: string;
  start: number;
  end: number;
  type: AnalysisType;
  explanation: string;
  impact: string;
  severity: 'low' | 'medium' | 'high';
}

export type AnalysisType = 
  | 'spelling' | 'confusion' | 'repetition' | 'clarity'
  | 'tone'           // 🆕 Análisis de tono (formal/informal)
  | 'readability'    // 🆕 Índice de legibilidad
  | 'sentiment'      // 🆕 Análisis de sentimientos
  | 'plagiarism'     // 🆕 Detección de plagio básico
  | 'vocabulary';    // 🆕 Riqueza de vocabulario

export interface AnalysisResult {
  segments: TextSegment[];
  strengths: string[];
  weaknesses: string[];
  purposeScore: number;
  purposeAnalysis: string;
  overallScore: number;
  recommendations: string[];
  textPurpose: TextPurpose;
  statistics: TextStatistics;
  readabilityIndex: ReadabilityScore;
  sentimentAnalysis: SentimentScore;
  vocabularyRichness: VocabularyScore;
  toneAnalysis: ToneScore;
}

export interface TextStatistics {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  readingTime: number; // en minutos
  complexWords: number;
  uniqueWords: number;
}

export interface ReadabilityScore {
  score: number; // 0-100
  level: 'muy_facil' | 'facil' | 'moderado' | 'dificil' | 'muy_dificil';
  description: string;
}

export interface SentimentScore {
  overall: 'positivo' | 'neutral' | 'negativo';
  confidence: number; // 0-1
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
  };
}

export interface VocabularyScore {
  richness: number; // 0-100
  level: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  sophisticatedWords: string[];
  repetitiveWords: string[];
}

export interface ToneScore {
  formality: 'muy_informal' | 'informal' | 'neutral' | 'formal' | 'muy_formal';
  confidence: number;
  characteristics: string[];
}

export interface ComparisonData {
  id: string;
  name: string;
  text: string;
  analysis: AnalysisResult;
  timestamp: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  analysisLevel: 'basic' | 'detailed' | 'expert';
  autoSave: boolean;
  notifications: boolean;
  language: 'es' | 'en';
}

export type TextPurpose = 
  | 'narrative'
  | 'argumentative' 
  | 'descriptive'
  | 'informative'
  | 'persuasive'
  | 'unknown';

export interface AnalysisConfig {
  highlightPositive: boolean;
  showTooltips: boolean;
  detailLevel: 'basic' | 'detailed' | 'expert';
}

export interface ColorMapping {
  spelling: string;
  confusion: string;
  repetition: string;
  clarity: string;
}

export interface ColorMapping {
  spelling: string;
  confusion: string;
  repetition: string;
  clarity: string;
  tone: string;
  readability: string;
  sentiment: string;
  plagiarism: string;
  vocabulary: string;
}

export const COLOR_SCHEME: ColorMapping = {
  spelling: 'bg-red-100 text-red-800 border-red-200',
  confusion: 'bg-orange-100 text-orange-800 border-orange-200',
  repetition: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  clarity: 'bg-green-100 text-green-800 border-green-200',
  tone: 'bg-purple-100 text-purple-800 border-purple-200',
  readability: 'bg-blue-100 text-blue-800 border-blue-200',
  sentiment: 'bg-pink-100 text-pink-800 border-pink-200',
  plagiarism: 'bg-gray-100 text-gray-800 border-gray-200',
  vocabulary: 'bg-indigo-100 text-indigo-800 border-indigo-200'
};

export const COLOR_ICONS = {
  spelling: '🔴',
  confusion: '🟠', 
  repetition: '🟡',
  clarity: '🟢',
  tone: '🟣',
  readability: '🔵',
  sentiment: '🟡',
  plagiarism: '⚫',
  vocabulary: '🟤'
} as const;