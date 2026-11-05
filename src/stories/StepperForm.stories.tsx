import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StepperForm } from '../components/StepperForm';
import { Field } from '../components/Field';
import { ThemeProvider } from '../theme/ThemeProvider';

const demoSteps = [
  { id: 'a', label: 'Identity', content: <p>Identity details</p> },
  { id: 'b', label: 'Address', content: <p>Address details</p>, error: true },
  { id: 'c', label: 'Review', content: <p>Review</p> },
];

const meta: Meta<typeof StepperForm> = {
  title: 'Components/StepperForm',
  component: StepperForm,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof StepperForm>;

/** Complete (check), current (underlined), error (!) and not-started states in both themes. */
export const StatesDarkAndLight: Story = {
  render: () => (
    <div>
      {(['dark', 'light'] as const).map((t) => (
        <ThemeProvider key={t} defaultTheme={t}>
          <div style={{ padding: 16, background: 'var(--fds-color-bg)', color: 'var(--fds-color-text)' }}>
            <StepperForm steps={demoSteps} current={1} />
          </div>
        </ThemeProvider>
      ))}
    </div>
  ),
};

export const KycOnboarding: Story = {
  render: () => {
    const [done, setDone] = useState(false);
    if (done) return <p>✅ Identity verification submitted.</p>;
    return (
      <StepperForm
        onComplete={() => setDone(true)}
        steps={[
          {
            id: 'identity',
            label: 'Identity',
            content: (
              <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                <Field label="Legal name" required placeholder="Jane Doe" />
                <Field label="Date of birth" required placeholder="MM/DD/YYYY" />
              </div>
            ),
          },
          {
            id: 'address',
            label: 'Address',
            content: (
              <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                <Field label="Street address" required placeholder="123 Main St" />
                <Field label="ZIP code" required placeholder="10001" />
              </div>
            ),
          },
          {
            id: 'review',
            label: 'Review',
            content: <p style={{ marginTop: 16 }}>Confirm your details and submit for verification.</p>,
          },
        ]}
        submitLabel="Submit for verification"
      />
    );
  },
};
