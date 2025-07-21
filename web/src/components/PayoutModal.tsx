import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface Props {
  payouts: number[];
  open: boolean;
  onRestart(): void;
}

export function PayoutModal({ payouts, open, onRestart }: Props) {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>Round Over</Dialog.Title>
          <ul>
            {payouts.map((p, i) => (
              <li key={i}>Player {i + 1}: {p * 5}</li>
            ))}
          </ul>
          <Dialog.Close asChild>
            <button onClick={onRestart}>Restart</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
