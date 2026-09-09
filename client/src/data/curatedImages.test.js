import { describe, it, expect } from 'vitest';
import { CURATED_IMAGES } from './curatedImages';

describe('CURATED_IMAGES', () => {
  it('gives every category a name and a non-empty image list', () => {
    for (const cat of CURATED_IMAGES) {
      expect(cat.category, 'category missing name').toBeTruthy();
      expect(Array.isArray(cat.images)).toBe(true);
      expect(cat.images.length).toBeGreaterThan(0);
    }
  });

  it('gives every image a valid https URL and non-empty alt text for accessibility', () => {
    for (const cat of CURATED_IMAGES) {
      for (const img of cat.images) {
        expect(img.url, `image in "${cat.category}"`).toMatch(/^https:\/\//);
        expect(img.alt, `image "${img.url}" missing alt text`).toBeTruthy();
      }
    }
  });

  it('has no duplicate image URLs across the whole library', () => {
    const urls = CURATED_IMAGES.flatMap(cat => cat.images.map(img => img.url));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('has no duplicate category names', () => {
    const names = CURATED_IMAGES.map(cat => cat.category);
    expect(new Set(names).size).toBe(names.length);
  });
});
