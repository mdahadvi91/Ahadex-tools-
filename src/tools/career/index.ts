/**
 * AHADEX TOOLS - Career & Writing Module Blueprint
 */
export interface TextMetricsResult {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export const careerToolModule = {
  category: 'career',
  supportedFormats: ['txt', 'md', 'pdf', 'docx'],
};
