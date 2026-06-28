import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepperForm, type Step } from '../components/StepperForm';

const steps: Step[] = [
  { id: 'a', label: 'Identity', content: <div>Step A content</div> },
  { id: 'b', label: 'Address', content: <div>Step B content</div> },
  { id: 'c', label: 'Review', content: <div>Step C content</div> },
];

describe('StepperForm', () => {
  it('advances through steps and completes', async () => {
    const onComplete = vi.fn();
    render(<StepperForm steps={steps} onComplete={onComplete} />);

    expect(screen.getByText('Step A content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step B content')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('Step C content')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('blocks advancing when validation fails', async () => {
    const failing: Step[] = [
      { id: 'a', label: 'One', content: <div>A</div>, validate: () => false },
      { id: 'b', label: 'Two', content: <div>B</div> },
    ];
    render(<StepperForm steps={failing} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });

  it('marks the current step with aria-current', () => {
    render(<StepperForm steps={steps} />);
    const current = screen.getByText('Identity').closest('li');
    expect(current).toHaveAttribute('aria-current', 'step');
  });
});
