import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StepperForm } from '../components/StepperForm';
import { Field } from '../components/Field';

const meta: Meta<typeof StepperForm> = {
  title: 'Components/StepperForm',
  component: StepperForm,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof StepperForm>;

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
