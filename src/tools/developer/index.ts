/**
 * AHADEX TOOLS - Developer Module Engine Blueprint
 */
export interface DevCodeOptions {
  indentSize?: number;
  minify?: boolean;
  sortKeys?: boolean;
  preserveComments?: boolean;
}

export const developerToolModule = {
  category: 'developer',
  supportedLanguages: ['json', 'javascript', 'html', 'css', 'regex', 'base64', 'jwt'],
  isWasmAccelerated: false,
};
