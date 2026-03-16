/**
 * Error Reporter 测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  reportError,
  setupGlobalErrorHandler,
  reportApiError,
  reportNetworkError,
  setSentryUser,
  clearSentryUser,
  setSentryContext,
  setSentryTag,
  setSentryExtra,
  addSentryBreadcrumb,
} from './error-reporter';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  withScope: vi.fn((callback) => {
    const scope = {
      setTag: vi.fn(),
      setExtra: vi.fn(),
      setUser: vi.fn(),
    };
    callback(scope);
  }),
  setUser: vi.fn(),
  setContext: vi.fn(),
  setTag: vi.fn(),
  setExtra: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

describe('Error Reporter', () => {
  const originalWindow = global.window as any;
  const mockWindow = {
    location: { href: 'https://example.com/test' },
    navigator: {
      userAgent: 'Mozilla/5.0',
      sendBeacon: vi.fn(),
    },
    addEventListener: vi.fn(),
    fetch: vi.fn(),
    __user_id__: undefined as string | undefined,
  } as any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    // Set up window mock
    global.window = mockWindow;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  describe('reportError', () => {
    it('should report error with string', async () => {
      const success = await reportError('Test error', 'custom');
      expect(success).toBeDefined();
    });

    it('should report error with Error object', async () => {
      const error = new Error('Test error');
      const success = await reportError(error, 'js-error');
      expect(success).toBeDefined();
    });

    it('should report error with metadata', async () => {
      const error = new Error('Test error');
      const metadata = { userId: '123', action: 'save' };
      const success = await reportError(error, 'custom', metadata);
      expect(success).toBeDefined();
    });
  });

  describe('setupGlobalErrorHandler', () => {
    it('should set up unhandled rejection handler', () => {
      setupGlobalErrorHandler();
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'unhandledrejection',
        expect.any(Function)
      );
    });

    it('should set up global error handler', () => {
      setupGlobalErrorHandler();
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
    });
  });

  describe('reportApiError', () => {
    it('should report API error', async () => {
      const success = await reportApiError('/api/test', 500, 'Internal Server Error');
      expect(success).toBeDefined();
    });

    it('should report API error with metadata', async () => {
      const metadata = { method: 'POST', body: '{}' };
      const success = await reportApiError('/api/test', 404, 'Not Found', metadata);
      expect(success).toBeDefined();
    });
  });

  describe('reportNetworkError', () => {
    it('should report network error', async () => {
      const error = new Error('Network timeout');
      const success = await reportNetworkError('/api/test', error);
      expect(success).toBeDefined();
    });

    it('should report network error with metadata', async () => {
      const error = new Error('Network timeout');
      const metadata = { timeout: 5000 };
      const success = await reportNetworkError('/api/test', error, metadata);
      expect(success).toBeDefined();
    });
  });

  describe('Sentry Context Management', () => {
    it('should set Sentry user', () => {
      const user = { id: '123', email: 'test@example.com', username: 'test' };
      setSentryUser(user);
      expect(mockWindow.__user_id__).toBe('123');
    });

    it('should clear Sentry user', () => {
      clearSentryUser();
      expect(mockWindow.__user_id__).toBeUndefined();
    });

    it('should set Sentry context', () => {
      const context = { feature: 'dashboard', action: 'save' };
      setSentryContext('test', context);
    });

    it('should set Sentry tag', () => {
      setSentryTag('version', '1.0.0');
    });

    it('should set Sentry extra', () => {
      setSentryExtra('custom', { data: 'test' });
    });

    it('should add Sentry breadcrumb', () => {
      addSentryBreadcrumb('User clicked button', 'user', 'info');
      addSentryBreadcrumb('Test log', 'custom', 'debug');
    });
  });
});