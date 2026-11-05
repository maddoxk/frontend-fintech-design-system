import { useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Button } from './Button';

export interface Step {
  id: string;
  label: string;
  /** Step content. Receives nothing; manage your own form state outside. */
  content: ReactNode;
  /** Optional validator; return true (or a resolved true) to allow advancing. */
  validate?: () => boolean;
  /** Force the error state on this step (also set automatically when validate fails). */
  error?: boolean;
}

export interface StepperFormProps {
  steps: Step[];
  /** Called when the user completes the final step. */
  onComplete?: () => void;
  /** Controlled current index (optional). */
  current?: number;
  onStepChange?: (index: number) => void;
  submitLabel?: string;
}

const STATUS_TEXT = { error: 'Error', done: 'Complete', active: 'Current', todo: 'Not started' } as const;

/**
 * Multi-step (KYC-style) form stepper. Renders a compact progress rail with
 * aria-current, glyph + text states (never colour alone), and Back/Next
 * navigation with optional per-step validation.
 */
export function StepperForm({
  steps,
  onComplete,
  current,
  onStepChange,
  submitLabel = 'Submit',
}: StepperFormProps) {
  const [internal, setInternal] = useState(0);
  const [failedId, setFailedId] = useState<string | null>(null);
  const active = current ?? internal;
  const setActive = (i: number) => {
    setFailedId(null);
    onStepChange?.(i);
    if (current === undefined) setInternal(i);
  };

  const isLast = active === steps.length - 1;

  const goNext = () => {
    const step = steps[active];
    if (step.validate && !step.validate()) {
      setFailedId(step.id);
      return;
    }
    setFailedId(null);
    if (isLast) {
      onComplete?.();
    } else {
      setActive(active + 1);
    }
  };

  const goBack = () => {
    if (active > 0) setActive(active - 1);
  };

  return (
    <div className="fds-stepper">
      <ol className="fds-stepper__rail" aria-label="Progress">
        {steps.map((step, i) => {
          const hasError = step.error === true || failedId === step.id;
          const state = hasError ? 'error' : i < active ? 'done' : i === active ? 'active' : 'todo';
          const glyph = state === 'error' ? '!' : state === 'done' ? '✓' : i + 1;
          const last = i === steps.length - 1;
          return (
            <li
              key={step.id}
              className={cx('fds-step', state !== 'todo' && `fds-step--${state}`, !last && 'fds-step--has-bar')}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className="fds-step__dot" aria-hidden="true">
                {glyph}
              </span>
              <span className="fds-step__label">{step.label}</span>
              <span className={state === 'error' ? 'fds-step__status' : 'fds-sr-only'}>
                ({STATUS_TEXT[state]})
              </span>
              {!last && (
                <span
                  className={cx('fds-step__bar', i < active && 'fds-step__bar--done')}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <div role="group" aria-label={steps[active].label}>
        {steps[active].content}
      </div>

      {failedId === steps[active].id && (
        <p className="fds-stepper__error" role="alert">
          Error: complete this step to continue.
        </p>
      )}

      <div className="fds-stepper__actions">
        <Button variant="ghost" onClick={goBack} disabled={active === 0}>
          Back
        </Button>
        <Button variant="primary" onClick={goNext}>
          {isLast ? submitLabel : 'Next'}
        </Button>
      </div>
    </div>
  );
}
