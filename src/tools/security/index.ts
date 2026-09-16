/**
 * AHADEX TOOLS - Security & Cryptography Module Blueprint
 */
export interface CryptoOptions {
  algorithm?: 'SHA-256' | 'SHA-512' | 'AES-GCM' | 'RSA-OAEP';
  keySize?: 256 | 2048 | 4096;
}

export const securityToolModule = {
  category: 'security',
  cryptoEngine: 'WebCryptoAPI',
  zeroTelemetry: true,
};
