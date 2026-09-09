import { describe, it, expect } from 'vitest';
import { AVAILABLE_SECTIONS, THEME_PALETTES, TYPOGRAPHY_PRESETS } from './defaultTemplates';

describe('AVAILABLE_SECTIONS', () => {
  it('gives every section a type, name, category, icon, and default data object', () => {
    for (const sec of AVAILABLE_SECTIONS) {
      expect(sec.type, `section missing type: ${JSON.stringify(sec)}`).toBeTruthy();
      expect(sec.name, `section ${sec.type} missing name`).toBeTruthy();
      expect(sec.category, `section ${sec.type} missing category`).toBeTruthy();
      expect(sec.icon, `section ${sec.type} missing icon`).toBeTruthy();
      expect(typeof sec.defaultData, `section ${sec.type} defaultData should be an object`).toBe('object');
    }
  });

  it('has no duplicate section types', () => {
    const types = AVAILABLE_SECTIONS.map(s => s.type);
    expect(new Set(types).size).toBe(types.length);
  });

  it('matches the section types the server-side renderer knows how to draw', () => {
    // Keep in sync with the switch in server/siteRenderer.js's renderSection().
    const rendererKnownTypes = [
      'navbar', 'hero', 'features', 'about', 'gallery', 'menu', 'pricing',
      'testimonials', 'faq', 'countdown', 'stats', 'contact', 'newsletter',
      'ctaBanner', 'footer'
    ];
    for (const sec of AVAILABLE_SECTIONS) {
      expect(rendererKnownTypes, `section type "${sec.type}" has no matching renderer`).toContain(sec.type);
    }
  });
});

describe('THEME_PALETTES', () => {
  const HEX_COLOR = /^#[0-9a-f]{6}$/i;

  it('gives every palette a full, valid-hex color set', () => {
    for (const pal of THEME_PALETTES) {
      expect(pal.id, 'palette missing id').toBeTruthy();
      expect(pal.name, `palette ${pal.id} missing name`).toBeTruthy();
      for (const key of ['primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor', 'textColor']) {
        expect(pal[key], `palette ${pal.id}.${key}`).toMatch(HEX_COLOR);
      }
    }
  });

  it('has no duplicate palette ids', () => {
    const ids = THEME_PALETTES.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('TYPOGRAPHY_PRESETS', () => {
  it('gives every preset an id, name, heading font, and body font', () => {
    for (const tp of TYPOGRAPHY_PRESETS) {
      expect(tp.id).toBeTruthy();
      expect(tp.name).toBeTruthy();
      expect(tp.heading).toBeTruthy();
      expect(tp.body).toBeTruthy();
    }
  });

  it('has no duplicate preset ids', () => {
    const ids = TYPOGRAPHY_PRESETS.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
