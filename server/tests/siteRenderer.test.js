import { describe, it, expect } from 'vitest';
import { renderSiteHtml } from '../siteRenderer.js';
import { SEED_SITES } from '../seedSites.js';
import { minimalSite } from './testUtils.js';

const SECTION_TYPES = [
  'navbar', 'hero', 'features', 'about', 'gallery', 'menu', 'pricing',
  'testimonials', 'faq', 'countdown', 'stats', 'contact', 'newsletter',
  'ctaBanner', 'footer'
];

describe('renderSiteHtml', () => {
  it('renders every seeded showcase site to valid-looking HTML without throwing', () => {
    for (const site of SEED_SITES) {
      const html = renderSiteHtml(site, false);
      expect(html).toContain('<!DOCTYPE html>');
      // Titles are HTML-escaped in <title>, so compare loosely on the "&"-free ones
      // and always assert the escaped variant is present.
      const escapedTitle = site.title.replace(/&/g, '&amp;');
      expect(html).toContain(escapedTitle);
      expect(html).toContain('</html>');
    }
  });

  it('renders each section type without throwing when given empty data', () => {
    for (const type of SECTION_TYPES) {
      const site = minimalSite({ sections: [{ id: `sec-${type}`, type, data: {} }] });
      expect(() => renderSiteHtml(site, false)).not.toThrow();
    }
  });

  it('falls back to sensible theme defaults when theme/settings are missing', () => {
    const site = minimalSite({ theme: undefined, settings: undefined });
    const html = renderSiteHtml(site, false);
    expect(html).toContain('#4f46e5'); // default primary color
    expect(html).toContain('🌐'); // default favicon
  });

  it('emits a placeholder comment for unknown section types instead of crashing', () => {
    const site = minimalSite({ sections: [{ id: 'weird', type: 'not-a-real-type', data: {} }] });
    const html = renderSiteHtml(site, false);
    expect(html).toContain('<!-- Section type not-a-real-type -->');
  });

  it('escapes/handles a site with zero sections', () => {
    const site = minimalSite({ sections: [] });
    const html = renderSiteHtml(site, false);
    expect(html).toContain(site.title);
  });

  it('wires the AJAX contact form handler to the site slug', () => {
    const site = minimalSite({
      slug: 'my-cool-site',
      sections: [{ id: 'c1', type: 'contact', data: {} }]
    });
    const html = renderSiteHtml(site, false);
    expect(html).toContain("handleSiteFormSubmit(event, 'my-cool-site')");
  });
});
