import { Fragment, useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { Button } from './Button';

export interface Step {
  id: string;
  label: string;
  /** Step content. Receives nothing; manage your own form state outside. */
  content: ReactNode;
  /** Optional validator; return true (or a resolved true) to allow advancing. */
  validate?: () => boolean;
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

/**
 * Multi-step (KYC-style) form stepper. Renders a progress rail with proper
 * aria-current, and Back/Next navigation with optional per-step validation.
 */
export function StepperForm({
  steps,
  onComplete,
  current,
  onStepChange,
  submitLabel = 'Submit',
}: StepperFormProps) {
  const [internal, setInternal] = useState(0);
  const active = current ?? internal;
  const setActive = (i: number) => {
    onStepChange?.(i);
    if (current === undefined) setInternal(i);
  };

  const isLast = active === steps.length - 1;

  const goNext = () => {
    const step = steps[active];
    if (step.validate && !step.validate()) return;
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
          const state = i < active ? 'done' : i === active ? 'active' : 'todo';
          return (
            <Fragment key={step.id}>
              <li
                className={cx('fds-step', state !== 'todo' && `fds-step--${state}`)}
                aria-current={i === active ? 'step' : undefined}
              >
                <span className="fds-step__dot">{i < active ? '✓' : i + 1}</span>
                <span className="fds-step__label">{step.label}</span>
              </li>
              {i < steps.length - 1 && (
                <span
                  className={cx('fds-step__bar', i < active && 'fds-step__bar--done')}
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </ol>

      <div role="group" aria-label={steps[active].label}>
        {steps[active].content}
      </div>

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
