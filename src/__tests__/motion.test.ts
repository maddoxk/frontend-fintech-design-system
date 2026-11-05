/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import css from '../styles.css?raw';

describe('motion tokens', () => {
  it('defines the motion custom properties', () => {
    for (const n of ['duration-fast', 'duration-base', 'duration-slow', 'ease-standard', 'ease-emphasized']) {
      expect(css).toContain(`--fds-motion-${n}:`);
    }
  });

  it('has no raw time literals in transitions/animations', () => {
    const offenders = css
      .split('\n')
      .filter((l: string) => !/^\s*--fds-motion-[\w-]+\s*:/.test(l))
      .filter((l: string) => /(transition|animation)\s*:/.test(l) && /\d(ms|s)\b/.test(l));
    expect(offenders).toEqual([]);
  });

  it('has a reduced-motion block that disables toast/fade and keeps the spinner', () => {
    const m = css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*$/);
    expect(m).not.toBeNull();
    const block = m![0];
    expect(block).toMatch(/\.fds-toast[\s\S]*animation: none/);
    expect(block).toMatch(/\.fds-modal__overlay/);
    expect(block).toMatch(/--fds-motion-duration-spinner:\s*\d+ms/);
    expect(block).not.toMatch(/fds-spin[^;]*none/);
  });
});
