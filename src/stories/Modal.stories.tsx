import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Field } from '../components/Field';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Transfer money</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Transfer money"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        >
          <p style={{ marginTop: 0 }}>Move funds between your linked accounts. Press Tab to cycle focus, Escape to close.</p>
          <Field label="Amount" placeholder="$0.00" />
        </Modal>
      </>
    );
  },
};
