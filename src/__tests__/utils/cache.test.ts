import { apiCache } from '../../utils/cache';

describe('ApiCache Utils', () => {
  beforeEach(() => {
    apiCache.clear();
    // Mock Date.now for consistent testing
    jest.spyOn(Date, 'now').mockReturnValue(1000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('set', () => {
    test('데이터를 캐시에 저장한다', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData, 5000);

      expect(apiCache.has('test-key')).toBe(true);
    });

    test('기본 TTL(1시간)로 데이터를 저장한다', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData);

      expect(apiCache.has('test-key')).toBe(true);
    });
  });

  describe('get', () => {
    test('유효한 캐시 데이터를 반환한다', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData, 5000);

      const result = apiCache.get('test-key');
      expect(result).toEqual(testData);
    });

    test('만료된 캐시 데이터는 null을 반환하고 삭제한다', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData, 5000);

      // 6초 후로 시간 이동
      jest.spyOn(Date, 'now').mockReturnValue(1006000);

      const result = apiCache.get('test-key');
      expect(result).toBeNull();
      expect(apiCache.has('test-key')).toBe(false);
    });

    test('존재하지 않는 키는 null을 반환한다', () => {
      const result = apiCache.get('non-existent-key');
      expect(result).toBeNull();
    });
  });

  describe('has', () => {
    test('유효한 캐시가 있으면 true를 반환한다', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData, 5000);

      expect(apiCache.has('test-key')).toBe(true);
    });

    test('만료된 캐시는 false를 반환하고 삭제한다', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData, 5000);

      // 6초 후로 시간 이동
      jest.spyOn(Date, 'now').mockReturnValue(1006000);

      expect(apiCache.has('test-key')).toBe(false);
    });

    test('존재하지 않는 키는 false를 반환한다', () => {
      expect(apiCache.has('non-existent-key')).toBe(false);
    });
  });

  describe('delete', () => {
    test('특정 키의 캐시를 삭제한다', () => {
      const testData = { id: 1, name: 'test' };
      apiCache.set('test-key', testData, 5000);

      expect(apiCache.has('test-key')).toBe(true);

      apiCache.delete('test-key');
      expect(apiCache.has('test-key')).toBe(false);
    });
  });

  describe('clear', () => {
    test('모든 캐시를 삭제한다', () => {
      apiCache.set('key1', { data: 'test1' }, 5000);
      apiCache.set('key2', { data: 'test2' }, 5000);

      expect(apiCache.has('key1')).toBe(true);
      expect(apiCache.has('key2')).toBe(true);

      apiCache.clear();

      expect(apiCache.has('key1')).toBe(false);
      expect(apiCache.has('key2')).toBe(false);
    });
  });
});
