import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type ToastTone = 'info' | 'success' | 'error' | 'warning';

export interface ToastOptions {
  title: ReactNode;
  message?: ReactNode;
  tone?: ToastTone;
  /** Auto-dismiss after this many ms. 0 disables. Default 4000. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let counter = 0;
const nextId = () => `toast-${++counter}`;

/** Single toast row. */
function ToastView({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  return (
    <div className={cx('fds-toast', `fds-toast--${item.tone ?? 'info'}`)}>
      <div className="fds-toast__body">
        <div className="fds-toast__title">{item.title}</div>
        {item.message && <div className="fds-toast__msg">{item.message}</div>}
      </div>
      <button
        type="button"
        className="fds-toast__close"
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Provides an imperative `toast()` API via context. Renders a polite live
 * region (aria-live) so screen readers announce new toasts.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const handle = timers.current[id];
    if (handle) {
      clearTimeout(handle);
      delete timers.current[id];
    }
  }, []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = nextId();
      const item: ToastItem = { duration: 4000, tone: 'info', ...opts, id };
      setItems((prev) => [...prev, item]);
      if (item.duration && item.duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), item.duration);
      }
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const t = timers.current;
    return () => {
      Object.values(t).forEach(clearTimeout);
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fds-toast-region" role="region" aria-label="Notifications">
        <div aria-live="polite" aria-atomic="false">
          {items.map((item) => (
            <ToastView key={item.id} item={item} onClose={() => dismiss(item.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

/** Access the imperative toast API. Must be inside a ToastProvider. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
  return ctx;
}
