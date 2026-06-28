import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../components/Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Confirm">
        Body
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders an accessible dialog when open', () => {
    render(
      <Modal open onClose={() => {}} title="Confirm transfer">
        Are you sure?
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Confirm transfer');
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirm">
        Body
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes via the close button', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirm">
        Body
      </Modal>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClose).toHaveBeenCalled();
  });
});
