import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  toolData?: {
    name: string;
    description: string;
    category: string;
    slug: string;
  };
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  toolData,
}) => {
  useEffect(() => {
    const defaultTitle = 'AHADEX TOOLS – Free Privacy-First Web Utilities & Developer Suite';
    const defaultDesc =
      'High-performance, client-side web tools. Photo QR badge generator, PDF merger, WebP converter, image compressor, password generator, JSON formatter & more. 100% free & zero server retention.';
    const siteUrl = 'https://ahadex.fun';

    const currentTitle = title ? `${title} | AHADEX TOOLS` : defaultTitle;
    const currentDesc = description || defaultDesc;
    const currentCanonical = canonicalUrl || `${siteUrl}${window.location.pathname}`;
    const currentOgImage = ogImage || `${siteUrl}/og-image.svg`;

    // 1. Update Title
    document.title = currentTitle;

    // 2. Helper to set meta content
    const setMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          meta.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        } else if (selector.startsWith('meta[property=')) {
          meta.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    setMeta('meta[name="description"]', currentDesc);
    if (keywords) setMeta('meta[name="keywords"]', keywords);

    // OpenGraph
    setMeta('meta[property="og:title"]', currentTitle);
    setMeta('meta[property="og:description"]', currentDesc);
    setMeta('meta[property="og:url"]', currentCanonical);
    setMeta('meta[property="og:image"]', currentOgImage);

    // Twitter
    setMeta('meta[name="twitter:title"]', currentTitle);
    setMeta('meta[name="twitter:description"]', currentDesc);
    setMeta('meta[name="twitter:image"]', currentOgImage);

    // Canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', currentCanonical);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', currentCanonical);
      document.head.appendChild(canonicalLink);
    }

    // 3. Inject Dynamic Schema.org JSON-LD script for Tool
    let schemaScript = document.getElementById('seo-dynamic-schema');
    if (toolData) {
      const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: toolData.name,
        description: toolData.description,
        applicationCategory: toolData.category,
        operatingSystem: 'Any web browser (Windows, macOS, Linux, iOS, Android)',
        url: currentCanonical,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Organization',
          name: 'AHADEX TOOLS',
          url: 'https://ahadex.fun',
        },
      };

      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'seo-dynamic-schema';
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(toolSchema);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [title, description, keywords, canonicalUrl, ogImage, toolData]);

  return null;
};
