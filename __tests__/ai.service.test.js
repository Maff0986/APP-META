const aiService = require('../backend/services/ai.service');

describe('AI Service', () => {
  test('should exist', () => {
    expect(aiService).toBeDefined();
  });

  test('should have detectProvider method', () => {
    expect(typeof aiService.detectProvider).toBe('function');
  });

  test('should have ask method', () => {
    expect(typeof aiService.ask).toBe('function');
  });

  test('should have buildPrompt method', () => {
    expect(typeof aiService.buildPrompt).toBe('function');
  });

  test('should have suggestContent method', () => {
    expect(typeof aiService.suggestContent).toBe('function');
  });

  test('should have validateContent method', () => {
    expect(typeof aiService.validateContent).toBe('function');
  });

  test('should have healthCheck method', () => {
    expect(typeof aiService.healthCheck).toBe('function');
  });
});