'use client';

import { createContext, useContext, useState } from 'react';

const BatchCountContext = createContext<{
  filteredCount: number;
  setFilteredCount: (n: number) => void;
}>({ filteredCount: -1, setFilteredCount: () => {} });

export function BatchCountProvider({
  initialCount,
  children,
}: {
  initialCount: number;
  children: React.ReactNode;
}) {
  const [filteredCount, setFilteredCount] = useState(initialCount);
  return (
    <BatchCountContext.Provider value={{ filteredCount, setFilteredCount }}>
      {children}
    </BatchCountContext.Provider>
  );
}

export function useBatchCount() {
  return useContext(BatchCountContext);
}
