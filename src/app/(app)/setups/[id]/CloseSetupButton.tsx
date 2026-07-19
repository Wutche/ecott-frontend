'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetchClient } from '@/lib/apiClient';

export function CloseSetupButton({ setupId }: { setupId: string }) {
  const router = useRouter();
  const [closing, setClosing] = useState(false);

  async function close() {
    setClosing(true);
    try {
      await apiFetchClient(`/api/setup/${setupId}/close`, { method: 'POST' });
      router.refresh();
    } finally {
      setClosing(false);
    }
  }

  return (
    <button type="button" className="btn-primary" onClick={close} disabled={closing}>
      {closing ? 'Closing…' : 'Close setup'}
    </button>
  );
}
