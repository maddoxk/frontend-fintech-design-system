/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import css from '../styles.css?raw';
import { Page } from '../components/Page';
import { Section } from '../components/Section';
import { Widget } from '../components/Widget';
import { themes, type ThemeName } from '../tokens/tokens';

const chan = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const lum = (hex: string) => {
  const [r, g, b] = chan(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const modes: ThemeName[] = ['dark', 'light'];

describe('Page', () => {
  it('renders an h1 title and labels the container with it', () => {
    render(
      <Page title="Overview" as="main" className="extra" data-testid="p">
        <p>child</p>
      </Page>,
    );
    const main = screen.getByRole('main', { name: 'Overview' });
    expect(main).toHaveClass('fds-page', 'extra');
    expect(main).toHaveAttribute('data-testid', 'p');
    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
  });
  it('supports headingLevel, actions slot and columns', () => {
    const { container } = render(
      <Page title="T" headingLevel={2} actions={<button>Act</button>} columns={3}>
        x
      </Page>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'T' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Act' })).toBeInTheDocument();
    expect((container.firstChild as HTMLElement).style.getPropertyValue('--fds-grid-columns')).toBe('3');
  });
});

describe('Section', () => {
  it('is a region labelled by its h2 title, with actions and children', () => {
    render(
      <Section title="Accounts" actions={<button>Add</button>} className="c">
        <span>body</span>
      </Section>,
    );
    const region = screen.getByRole('region', { name: 'Accounts' });
    expect(region.tagName).toBe('SECTION');
    expect(region).toHaveClass('fds-section', 'c');
    expect(screen.getByRole('heading', { level: 2, name: 'Accounts' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByText('body')).toBeInTheDocument();
  });
  it('honours headingLevel and passes through props', () => {
    render(
      <Section title="S" headingLevel={3} id="s1">
        x
      </Section>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'S' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'S' })).toHaveAttribute('id', 's1');
  });
});

describe('Widget', () => {
  it('is a group labelled by its h3 title, with actions slot', () => {
    render(
      <Widget title="Balance" actions={<button>Go</button>} className="w">
        <span>content</span>
      </Widget>,
    );
    const g = screen.getByRole('group', { name: 'Balance' });
    expect(g).toHaveClass('fds-widget', 'w');
    expect(screen.getByRole('heading', { level: 3, name: 'Balance' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
  it('renders without a header or role when no title/actions', () => {
    const { container } = render(<Widget data-testid="w">only</Widget>);
    expect(container.querySelector('.fds-widget__header')).toBeNull();
    expect(screen.getByTestId('w')).not.toHaveAttribute('role');
  });
  it('span sets grid-column', () => {
    render(
      <Widget title="x" span={2} data-testid="w">
        y
      </Widget>,
    );
    expect(screen.getByTestId('w').style.gridColumn).toBe('span 2');
  });
  it('nests inside Section and Page with unique heading ids', () => {
    render(
      <Page title="P">
        <Section title="S">
          <Widget title="W1">a</Widget>
          <Widget title="W2">b</Widget>
        </Section>
      </Page>,
    );
    expect(screen.getAllByRole('heading').map((h) => h.tagName)).toEqual(['H1', 'H2', 'H3', 'H3']);
    expect(screen.getByRole('group', { name: 'W2' })).toBeInTheDocument();
  });
});

describe('layout styles', () => {
  it('uses spec radii and padding tokens', () => {
    expect(css).toMatch(/\.fds-section \{[^}]*radius-section[^}]*\}/);
    expect(css).toMatch(/\.fds-section \{[^}]*space-lg-plus/);
    expect(css).toMatch(/\.fds-widget \{[^}]*radius-widget[^}]*\}/);
    expect(css).toMatch(/\.fds-widget \{[^}]*space-lg\)/);
    expect(css).toMatch(/\.fds-page__title \{[^}]*font-size-title[^}]*font-weight-bold/);
  });
  it('grid collapses to a single column on small screens', () => {
    expect(css).toMatch(/@media \(max-width: 640px\) \{[^@]*\.fds-page__grid, \.fds-section__body \{ grid-template-columns: minmax\(0, 1fr\); \}/);
    expect(css).toMatch(/\.fds-page \{[^}]*max-width: 100%/);
  });
  it('is flat: no gradients or shadows in layout rules', () => {
    const layout = css.slice(css.indexOf('Layout: Page > Section > Widget'));
    expect(layout).not.toMatch(/gradient\(/);
    expect(layout).not.toMatch(/box-shadow/);
  });
  it.each(modes)('%s title text on page/section/widget surfaces >= 4.5:1', (m) => {
    const c = themes[m];
    for (const bg of [c.bg, c.bgSection, c.bgElevated]) {
      expect(contrast(c.text, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it.each(modes)('%s panel borders against their parent surface >= 1.0 and distinct', (m) => {
    const c = themes[m];
    expect(c.border).not.toBe(c.bgSection);
    expect(c.border).not.toBe(c.bgElevated);
  });
});
