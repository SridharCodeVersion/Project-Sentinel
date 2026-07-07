import React, { createContext, useContext, useState } from 'react';

type SettingsContextType = {
  aiConfidenceCutoff: number;
  setAiConfidenceCutoff: (val: number) => void;
  deepfakeSensorWeight: number;
  setDeepfakeSensorWeight: (val: number) => void;
};

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [aiConfidenceCutoff, setAiConfidenceCutoff] = useState(87);
  const [deepfakeSensorWeight, setDeepfakeSensorWeight] = useState(1.4);

  return (
    <SettingsContext.Provider value={{
      aiConfidenceCutoff, setAiConfidenceCutoff,
      deepfakeSensorWeight, setDeepfakeSensorWeight
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
