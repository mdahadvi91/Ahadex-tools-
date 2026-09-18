import QRCode from 'qrcode';

export const getInitials = (name: string): string => {
  if (!name) return 'AH';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read file as data URL.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('File reading error.'));
    reader.readAsDataURL(file);
  });

export const waitForImages = async (root: HTMLElement): Promise<void> => {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }
          const done = () => resolve();
          image.addEventListener('load', done, { once: true });
          image.addEventListener('error', done, { once: true });
        }),
    ),
  );
};

export const waitForFonts = async (): Promise<void> => {
  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignored: Font load timeout should not break render
    }
  }
};

export const buildContactVCard = (data: {
  fullName: string;
  jobTitle: string;
  companyName: string;
  phone: string;
  email: string;
  website: string;
}): string => {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.fullName || 'Mohammad Ahad'}`,
    `ORG:${data.companyName || 'AHADEX'}`,
    `TITLE:${data.jobTitle || 'Founder & CEO'}`,
    `TEL:${data.phone || ''}`,
    `EMAIL:${data.email || ''}`,
    `URL:${data.website || 'https://ahadex.fun'}`,
    'END:VCARD',
  ].join('\n');
};

export const generateQrDataUrl = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text || 'https://ahadex.fun', {
      width: 250,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('Failed to generate QR code', error);
    return '';
  }
};
