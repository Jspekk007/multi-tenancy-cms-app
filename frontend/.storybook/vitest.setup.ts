/**
 * Vitest setup for Storybook component tests.
 * @storybook/addon-vitest injects its own setup files; this file adds shared
 * matchers and browser API stubs for component tests.
 *
 * Stories must include the `test` tag (globally in preview or per file) so the
 * addon includes them in the Vitest project. See `.storybook/preview.tsx`.
 *
 * Not included here (add when needed):
 * - MSW: install `msw` and start a server/worker in beforeAll / afterAll.
 * - next/navigation mocks: use `vi.mock` in the story file or a dedicated mock module.
 */

import '@testing-library/jest-dom/vitest';

import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  window.scrollTo = vi.fn();

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  globalThis.ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;

  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];

    constructor(_cb: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
});
