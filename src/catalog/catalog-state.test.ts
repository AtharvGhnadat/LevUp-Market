import { describe, it, expect } from 'vitest';
import {
  emptyCatalogFilters,
  filterCatalog,
  sortCatalog,
  hasCatalogFilters,
  activeFilterCount,
  parseCatalogUrl,
  catalogUrlParams,
  toggleArrayValue,
} from './catalog-state';
import { catalogProjects } from '@/data/catalog-projects';

describe('catalog-state logic', () => {
  it('filters projects by category', () => {
    const filters = {
      ...emptyCatalogFilters,
      categories: ['iot-electronics'],
    };

    const filtered = filterCatalog(catalogProjects, filters);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => p.category === 'iot-electronics')).toBe(true);
  });

  it('filters projects by difficulty', () => {
    const filters = {
      ...emptyCatalogFilters,
      difficulties: ['advanced' as const],
    };

    const filtered = filterCatalog(catalogProjects, filters);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => p.difficulty === 'advanced')).toBe(true);
  });

  it('filters by query matching title and search terms', () => {
    const filters = {
      ...emptyCatalogFilters,
      query: 'yolo',
    };

    const filtered = filterCatalog(catalogProjects, filters);
    expect(filtered.length).toBe(1);
    expect(filtered[0].slug).toBe('ai-object-detection-yolo');
  });

  it('sorts projects by price ascending and descending', () => {
    const sortedAsc = sortCatalog(catalogProjects, 'price-asc');
    for (let i = 0; i < sortedAsc.length - 1; i++) {
      expect(sortedAsc[i].startingPrice).toBeLessThanOrEqual(sortedAsc[i + 1].startingPrice);
    }

    const sortedDesc = sortCatalog(catalogProjects, 'price-desc');
    for (let i = 0; i < sortedDesc.length - 1; i++) {
      expect(sortedDesc[i].startingPrice).toBeGreaterThanOrEqual(sortedDesc[i + 1].startingPrice);
    }
  });

  it('correctly tracks active filters and count', () => {
    expect(hasCatalogFilters(emptyCatalogFilters)).toBe(false);
    expect(activeFilterCount(emptyCatalogFilters)).toBe(0);

    const active = {
      ...emptyCatalogFilters,
      categories: ['iot-electronics'],
      query: 'esp32',
    };

    expect(hasCatalogFilters(active)).toBe(true);
    expect(activeFilterCount(active)).toBe(1);
  });

  it('parses and serializes URL parameters bidirectionally', () => {
    const search = '?category=iot-electronics&difficulty=beginner&sort=price-asc&page=2';
    const parsed = parseCatalogUrl(search);

    expect(parsed.filters.categories).toEqual(['iot-electronics']);
    expect(parsed.filters.difficulties).toEqual(['beginner']);
    expect(parsed.sort).toBe('price-asc');
    expect(parsed.page).toBe(2);

    const serialized = catalogUrlParams(parsed.filters, parsed.sort, parsed.page, parsed.view);
    expect(serialized.get('category')).toBe('iot-electronics');
    expect(serialized.get('difficulty')).toBe('beginner');
    expect(serialized.get('sort')).toBe('price-asc');
    expect(serialized.get('page')).toBe('2');
  });

  it('toggles array values cleanly', () => {
    const initial = ['react', 'node'];
    const added = toggleArrayValue(initial, 'typescript');
    expect(added).toEqual(['react', 'node', 'typescript']);

    const removed = toggleArrayValue(added, 'react');
    expect(removed).toEqual(['node', 'typescript']);
  });
});
