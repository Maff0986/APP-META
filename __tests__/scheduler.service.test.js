const scheduler = require('../backend/services/scheduler.service');

describe('Scheduler Service', () => {
  test('should exist', () => {
    expect(scheduler).toBeDefined();
  });

  test('should have enqueuePost method', () => {
    expect(typeof scheduler.enqueuePost).toBe('function');
  });

  test('should have duePosts method', () => {
    expect(typeof scheduler.duePosts).toBe('function');
  });

  test('should have publishNow method', () => {
    expect(typeof scheduler.publishNow).toBe('function');
  });

  test('should have preview method', () => {
    expect(typeof scheduler.preview).toBe('function');
  });
});