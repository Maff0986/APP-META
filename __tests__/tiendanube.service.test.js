const tiendanubeService = require('../backend/services/tiendanube.service');

describe('Tiendanube Service', () => {
  test('should exist', () => {
    expect(tiendanubeService).toBeDefined();
  });

  test('should have fetchProducts method', () => {
    expect(typeof tiendanubeService.fetchProducts).toBe('function');
  });

  test('should have fetchProductById method', () => {
    expect(typeof tiendanubeService.fetchProductById).toBe('function');
  });

  test('should have syncProducts method', () => {
    expect(typeof tiendanubeService.syncProducts).toBe('function');
  });

  test('should have extractImageUrls method', () => {
    expect(typeof tiendanubeService.extractImageUrls).toBe('function');
  });

  test('should have getFeedImageUrls method', () => {
    expect(typeof tiendanubeService.getFeedImageUrls).toBe('function');
  });
});