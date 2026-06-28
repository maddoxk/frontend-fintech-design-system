import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Footer actions; if omitted a single "Close" button is shown. */
  footer?: ReactNode;
  /** Close when clicking the backdrop. Default true. */
  closeOnOverlay?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog. Implements role="dialog" aria-modal, Escape to close,
 * a basic focus trap, and focus restoration to the previously focused element.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnOverlay = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab' && dialogRef.current) {
        const nodes = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((n) => n.offsetParent !== null);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;
    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onDocKeyDown);
    return () => document.removeEventListener('keydown', onDocKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement as HTMLElement;
      // Focus the dialog (or first focusable) after mount.
      const id = requestAnimationFrame(() => {
        const node =
          dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? dialogRef.current;
        node?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
    lastFocused.current?.focus?.();
    return undefined;
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fds-modal__overlay"
      onMouseDown={(e) => {
        if (closeOnOverlay && e.target === e.currentTarget) onClose();
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div
        ref={dialogRef}
        className="fds-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <div className="fds-modal__header">
          <h2 className="fds-modal__title" id={titleId}>
            {title}
          </h2>
          <button
            type="button"
            className="fds-toast__close"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="fds-modal__body">{children}</div>
        <div className="fds-modal__footer">
          {footer ?? (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
