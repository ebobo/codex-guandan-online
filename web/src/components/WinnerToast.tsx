import React, { useEffect, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';

interface Props {
  winner: number | null;
}

export function WinnerToast({ winner }: Props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (winner !== null) setOpen(true);
  }, [winner]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root className="toast" open={open} onOpenChange={setOpen}>
        Player {winner !== null ? winner + 1 : ''} wins!
      </Toast.Root>
      <Toast.Viewport className="toast-viewport" />
    </Toast.Provider>
  );
}
